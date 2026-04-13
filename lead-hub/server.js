import crypto from "crypto";
import express from "express";
import pg from "pg";

const { Pool } = pg;

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "512kb" }));

const PORT = Number(process.env.PORT || 10000);
const DATABASE_URL = process.env.DATABASE_URL || "";
const HUB_TOKEN = process.env.HUB_TOKEN || "";
const SLACK_WEBHOOK_URL = (process.env.SLACK_WEBHOOK_URL || process.env.SLACK_WEBHOOK || "").trim();
const CRM_LEADS_ENDPOINT = process.env.CRM_LEADS_ENDPOINT || "";
const CRM_TOKEN = process.env.CRM_TOKEN || "";
const OWNER_CODE_SALT = process.env.OWNER_CODE_SALT || "";

if (!DATABASE_URL) {
  // eslint-disable-next-line no-console
  console.error("[lead-hub] Missing DATABASE_URL");
}

const pool = new Pool({
  connectionString: DATABASE_URL || undefined,
  ssl: DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});

async function ensureSchema() {
  await pool.query(`
    create table if not exists public.leads (
      id bigserial primary key,
      created_at timestamptz not null default now(),
      persona text not null,
      intent text not null,
      contact text not null,
      name text,
      note text,
      listing_id text,
      listing_title text,
      listing_city text,
      source_path text,
      source_href text,
      user_agent text,
      forwarded_for text,
      payload jsonb not null,
      crm_status text not null default 'pending',
      crm_error text
    );
  `);

  await pool.query("alter table public.leads add column if not exists status text not null default 'new';");
  await pool.query("alter table public.leads add column if not exists scheduled_at timestamptz;");
  await pool.query("alter table public.leads add column if not exists outcome text;");
  await pool.query("alter table public.leads add column if not exists outcome_note text;");

  await pool.query(
    "create index if not exists leads_created_at_idx on public.leads(created_at desc);",
  );
  await pool.query(
    "create index if not exists leads_listing_id_idx on public.leads(listing_id);",
  );

  await pool.query(`
    create table if not exists public.listing_metrics (
      listing_id text primary key,
      views bigint not null default 0,
      last_view_at timestamptz
    );
  `);

  await pool.query(`
    create table if not exists public.view_events (
      id bigserial primary key,
      created_at timestamptz not null default now(),
      listing_id text not null
    );
  `);
  await pool.query(
    "create index if not exists view_events_listing_created_idx on public.view_events(listing_id, created_at desc);",
  );

  await pool.query(`
    create table if not exists public.documents (
      id bigserial primary key,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      listing_id text not null,
      title text not null,
      status text not null default 'pending',
      note text
    );
  `);

  await pool.query(
    "create index if not exists documents_listing_id_idx on public.documents(listing_id);",
  );

  await pool.query(`
    create table if not exists public.owners (
      id bigserial primary key,
      created_at timestamptz not null default now(),
      name text,
      contact text,
      code_hash text not null unique,
      listing_ids jsonb not null default '[]'::jsonb,
      status text not null default 'active'
    );
  `);

  await pool.query(`
    create table if not exists public.milestones (
      id bigserial primary key,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      listing_id text not null,
      key text not null,
      title text not null,
      status text not null default 'pending',
      due_at timestamptz,
      completed_at timestamptz,
      note text
    );
  `);
  await pool.query(
    "create index if not exists milestones_listing_id_idx on public.milestones(listing_id);",
  );

  await pool.query(`
    create table if not exists public.signature_requests (
      id bigserial primary key,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      listing_id text not null,
      title text not null,
      status text not null default 'draft',
      provider text,
      external_url text,
      note text
    );
  `);
  await pool.query(
    "create index if not exists signatures_listing_id_idx on public.signature_requests(listing_id);",
  );
}

function bearerToken(req) {
  const header = req.headers.authorization || "";
  const [kind, token] = header.split(" ");
  if (kind !== "Bearer") return "";
  return token || "";
}

function safeEqual(a, b) {
  try {
    const aa = Buffer.from(a);
    const bb = Buffer.from(b);
    if (aa.length !== bb.length) return false;
    return crypto.timingSafeEqual(aa, bb);
  } catch {
    return false;
  }
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalize(value) {
  return String(value ?? "").trim();
}

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function hashOwnerCode(code) {
  const normalized = normalize(code).toLowerCase();
  if (!normalized) return "";
  return sha256(`${OWNER_CODE_SALT || "v2"}:${normalized}`);
}

function generateOwnerCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // avoid I/O ambiguity
  const digits = "23456789"; // avoid 0/1 ambiguity
  const pick = (chars, n) => {
    const out = [];
    for (let i = 0; i < n; i += 1) out.push(chars[Math.floor(Math.random() * chars.length)]);
    return out.join("");
  };
  return `V2-${pick(letters, 4)}-${pick(digits, 4)}`;
}

async function postToSlack(text) {
  if (!SLACK_WEBHOOK_URL) return;
  const res = await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`slack_failed:${res.status}:${body.slice(0, 200)}`);
  }
}

async function notifySlack(leadRow) {
  if (!SLACK_WEBHOOK_URL) return;
  const title = leadRow.listing_title
    ? `${leadRow.listing_title} (${leadRow.listing_city || "—"})`
    : "Sin inmueble";
  const text = [
    `Nuevo lead (${leadRow.intent}) · ${leadRow.persona}`,
    `Contacto: ${leadRow.contact}${leadRow.name ? ` · ${leadRow.name}` : ""}`,
    `Inmueble: ${title}`,
    leadRow.source_href ? `Origen: ${leadRow.source_href}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  await postToSlack(text);
}

async function pushToCrm(leadRow) {
  if (!CRM_LEADS_ENDPOINT) return;
  const payload = isRecord(leadRow?.payload)
    ? { hub_lead_id: String(leadRow.id), ...leadRow.payload }
    : { hub_lead_id: String(leadRow.id), payload: leadRow?.payload ?? null };
  const res = await fetch(CRM_LEADS_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(CRM_TOKEN ? { authorization: `Bearer ${CRM_TOKEN}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`crm_failed:${res.status}:${body.slice(0, 200)}`);
  }
}

app.get("/healthz", async (_req, res) => {
  try {
    await pool.query("select 1 as ok;");
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: String(error) });
  }
});

app.post("/v1/owners", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  if (!OWNER_CODE_SALT) {
    res.status(500).json({ ok: false, error: "owner_code_salt_missing" });
    return;
  }

  const name = normalize(req.body?.name);
  const contact = normalize(req.body?.contact);
  const code = normalize(req.body?.code);
  const listingIds = Array.isArray(req.body?.listing_ids) ? req.body.listing_ids : [];

  if (!code || listingIds.length === 0) {
    res.status(400).json({ ok: false, error: "missing_fields" });
    return;
  }

  const codeHash = hashOwnerCode(code);
  const insert = await pool.query(
    `
      insert into public.owners(name, contact, code_hash, listing_ids)
      values (nullif($1,''), nullif($2,''), $3, $4::jsonb)
      on conflict (code_hash) do update set
        name=excluded.name,
        contact=excluded.contact,
        listing_ids=excluded.listing_ids,
        status='active'
      returning id, created_at, name, contact, listing_ids, status;
    `,
    [name, contact, codeHash, JSON.stringify(listingIds)],
  );

  res.status(200).json({ ok: true, owner: insert.rows[0] });
});

app.post("/v1/owners/create_code", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  if (!OWNER_CODE_SALT) {
    res.status(500).json({ ok: false, error: "owner_code_salt_missing" });
    return;
  }

  const name = normalize(req.body?.name);
  const contact = normalize(req.body?.contact);
  const listingIds = Array.isArray(req.body?.listing_ids) ? req.body.listing_ids : [];
  if (listingIds.length === 0) {
    res.status(400).json({ ok: false, error: "missing_listing_ids" });
    return;
  }

  let code = "";
  let lastError = null;
  for (let i = 0; i < 6; i += 1) {
    code = generateOwnerCode();
    const codeHash = hashOwnerCode(code);
    try {
      const insert = await pool.query(
        `
          insert into public.owners(name, contact, code_hash, listing_ids)
          values (nullif($1,''), nullif($2,''), $3, $4::jsonb)
          on conflict (code_hash) do update set
            name=excluded.name,
            contact=excluded.contact,
            listing_ids=excluded.listing_ids,
            status='active'
          returning id, created_at, name, contact, listing_ids, status;
        `,
        [name, contact, codeHash, JSON.stringify(listingIds)],
      );
      res.status(200).json({ ok: true, code, owner: insert.rows[0] });
      return;
    } catch (err) {
      lastError = err;
    }
  }

  res.status(500).json({ ok: false, error: "code_generation_failed", details: String(lastError || "") });
});

app.post("/v1/owners/verify", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  if (!OWNER_CODE_SALT) {
    res.status(500).json({ ok: false, error: "owner_code_salt_missing" });
    return;
  }

  const code = normalize(req.body?.code);
  const codeHash = hashOwnerCode(code);
  if (!codeHash) {
    res.status(400).json({ ok: false, error: "missing_code" });
    return;
  }

  const owner = await pool.query(
    "select id, name, contact, listing_ids, status from public.owners where code_hash=$1 limit 1;",
    [codeHash],
  );
  const row = owner.rows[0];
  if (!row || row.status !== "active") {
    res.status(401).json({ ok: false, error: "invalid_code" });
    return;
  }

  res.status(200).json({ ok: true, owner: row });
});

app.get("/v1/metrics", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  const listingId = normalize(req.query.listing_id);
  if (!listingId) {
    res.status(400).json({ ok: false, error: "missing_listing_id" });
    return;
  }

  const metrics = await pool.query(
    "select listing_id, views, last_view_at from public.listing_metrics where listing_id=$1;",
    [listingId],
  );
  const row = metrics.rows[0] ?? { listing_id: listingId, views: 0, last_view_at: null };

  const counts = await pool.query(
    `
      select
        count(*)::int as leads_total,
        count(*) filter (where intent='info')::int as leads_info,
        count(*) filter (where intent='visita')::int as leads_visita
      from public.leads
      where listing_id=$1;
    `,
    [listingId],
  );

  res.status(200).json({ ok: true, metrics: row, counts: counts.rows[0] });
});

app.get("/v1/metrics/timeseries", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  const listingId = normalize(req.query.listing_id);
  if (!listingId) {
    res.status(400).json({ ok: false, error: "missing_listing_id" });
    return;
  }

  const daysRaw = normalize(req.query.days);
  const days = Math.min(90, Math.max(7, Number(daysRaw || "14") || 14));

  const rows = await pool.query(
    `
      with series as (
        select
          (current_date - (n * interval '1 day'))::date as day
        from generate_series(0, $2::int - 1) as n
      ),
      v as (
        select date_trunc('day', created_at)::date as day, count(*)::int as views
        from public.view_events
        where listing_id=$1 and created_at >= (current_date - (($2::int - 1) * interval '1 day'))
        group by 1
      ),
      l as (
        select
          date_trunc('day', created_at)::date as day,
          count(*)::int as leads,
          count(*) filter (where intent='visita')::int as visits,
          count(*) filter (where intent='info')::int as info
        from public.leads
        where listing_id=$1 and created_at >= (current_date - (($2::int - 1) * interval '1 day'))
        group by 1
      )
      select
        series.day::text as day,
        coalesce(v.views, 0)::int as views,
        coalesce(l.leads, 0)::int as leads,
        coalesce(l.visits, 0)::int as visits,
        coalesce(l.info, 0)::int as info
      from series
      left join v on v.day=series.day
      left join l on l.day=series.day
      order by series.day asc;
    `,
    [listingId, days],
  );

  res.status(200).json({
    ok: true,
    listing_id: listingId,
    days,
    points: rows.rows,
  });
});

app.post("/v1/events/view", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  if (!isRecord(req.body)) {
    res.status(400).json({ ok: false, error: "invalid_payload" });
    return;
  }

  const listingId = normalize(req.body.listing_id);
  if (!listingId) {
    res.status(400).json({ ok: false, error: "missing_listing_id" });
    return;
  }

  const updated = await pool.query(
    `
      insert into public.listing_metrics(listing_id, views, last_view_at)
      values ($1, 1, now())
      on conflict (listing_id)
      do update set views=public.listing_metrics.views + 1, last_view_at=now()
      returning listing_id, views, last_view_at;
    `,
    [listingId],
  );

  await pool.query(
    "insert into public.view_events(listing_id) values ($1);",
    [listingId],
  );

  res.status(200).json({ ok: true, metrics: updated.rows[0] });
});

app.get("/v1/leads/recent", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  const limitRaw = Number(req.query.limit || 20);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(50, limitRaw)) : 20;

  const query = await pool.query(
    `
      select
        id,
        created_at,
        persona,
        intent,
        contact,
        name,
        listing_id,
        listing_title,
        listing_city,
        crm_status,
        crm_error
      from public.leads
      order by id desc
      limit $1
    `,
    [limit],
  );

  res.status(200).json({ ok: true, leads: query.rows });
});

app.get("/v1/config", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  let slackHost = null;
  if (SLACK_WEBHOOK_URL) {
    try {
      slackHost = new URL(SLACK_WEBHOOK_URL).host;
    } catch {
      slackHost = "invalid_url";
    }
  }

  const slackEnvKeys = Object.keys(process.env).filter((key) =>
    key.toLowerCase().includes("slack"),
  );

  res.status(200).json({
    ok: true,
    hubConfigured: Boolean(HUB_TOKEN),
    slackConfigured: Boolean(SLACK_WEBHOOK_URL),
    slackWebhookHost: slackHost,
    slackWebhookLength: SLACK_WEBHOOK_URL.length,
    slackEnvKeys,
    ownerCodeConfigured: Boolean(OWNER_CODE_SALT),
    databaseConfigured: Boolean(DATABASE_URL),
    crmConfigured: Boolean(CRM_LEADS_ENDPOINT),
  });
});

app.get("/v1/leads/search", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  const listingId = normalize(req.query.listing_id);
  const intent = normalize(req.query.intent);
  const limitRaw = Number(req.query.limit || 50);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(100, limitRaw)) : 50;

  if (!listingId) {
    res.status(400).json({ ok: false, error: "missing_listing_id" });
    return;
  }

  const whereIntent = intent === "info" || intent === "visita" || intent === "contacto";
  const query = await pool.query(
    `
      select
        id,
        created_at,
        persona,
        intent,
        contact,
        name,
        note,
        listing_id,
        listing_title,
        listing_city,
        status,
        scheduled_at,
        outcome,
        outcome_note
      from public.leads
      where listing_id=$1
      ${whereIntent ? "and intent=$2" : ""}
      order by id desc
      limit ${whereIntent ? "$3" : "$2"}
    `,
    whereIntent ? [listingId, intent, limit] : [listingId, limit],
  );

  res.status(200).json({ ok: true, leads: query.rows });
});

app.post("/v1/leads/:id/status", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  const id = normalize(req.params.id);
  const status = normalize(req.body?.status);
  const outcome = normalize(req.body?.outcome);
  const outcomeNote = normalize(req.body?.outcome_note);
  const scheduledAt = normalize(req.body?.scheduled_at);

  const allowedStatus = new Set(["new", "contacted", "scheduled", "done", "rejected"]);
  if (!allowedStatus.has(status)) {
    res.status(400).json({ ok: false, error: "invalid_status" });
    return;
  }

  const updated = await pool.query(
    `
      update public.leads
      set
        status=$2,
        scheduled_at = case when $3 = '' then scheduled_at else $3::timestamptz end,
        outcome = nullif($4,''),
        outcome_note = nullif($5,'')
      where id=$1
      returning
        id, created_at, persona, intent, contact, name, note,
        listing_id, listing_title, listing_city, status, scheduled_at, outcome, outcome_note;
    `,
    [id, status, scheduledAt, outcome, outcomeNote],
  );

  if (!updated.rows[0]) {
    res.status(404).json({ ok: false, error: "not_found" });
    return;
  }

  res.status(200).json({ ok: true, lead: updated.rows[0] });
});

app.post("/v1/leads/:id/retry_crm", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  if (!CRM_LEADS_ENDPOINT) {
    res.status(500).json({ ok: false, error: "crm_not_configured" });
    return;
  }

  const id = normalize(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: "missing_id" });
    return;
  }

  const lead = await pool.query("select * from public.leads where id=$1 limit 1;", [id]);
  const row = lead.rows[0];
  if (!row) {
    res.status(404).json({ ok: false, error: "not_found" });
    return;
  }

  try {
    await pushToCrm(row);
    await pool.query("update public.leads set crm_status='sent', crm_error=null where id=$1;", [row.id]);
    res.status(200).json({ ok: true });
  } catch (error) {
    await pool.query("update public.leads set crm_status='error', crm_error=$2 where id=$1;", [
      row.id,
      String(error).slice(0, 500),
    ]);
    res.status(502).json({ ok: false, error: String(error) });
  }
});

app.get("/v1/documents", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  const listingId = normalize(req.query.listing_id);
  if (!listingId) {
    res.status(400).json({ ok: false, error: "missing_listing_id" });
    return;
  }

  const docs = await pool.query(
    `
      select id, created_at, updated_at, listing_id, title, status, note
      from public.documents
      where listing_id=$1
      order by id desc;
    `,
    [listingId],
  );
  res.status(200).json({ ok: true, documents: docs.rows });
});

app.post("/v1/documents", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  if (!isRecord(req.body)) {
    res.status(400).json({ ok: false, error: "invalid_payload" });
    return;
  }

  const listingId = normalize(req.body.listing_id);
  const title = normalize(req.body.title);
  const note = normalize(req.body.note);

  if (!listingId || !title) {
    res.status(400).json({ ok: false, error: "missing_fields" });
    return;
  }

  const doc = await pool.query(
    `
      insert into public.documents(listing_id, title, status, note)
      values ($1, $2, 'pending', nullif($3,''))
      returning id, created_at, updated_at, listing_id, title, status, note;
    `,
    [listingId, title, note],
  );

  res.status(200).json({ ok: true, document: doc.rows[0] });
});

app.patch("/v1/documents/:id", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  const id = normalize(req.params.id);
  const status = normalize(req.body?.status);
  const note = normalize(req.body?.note);

  const allowedStatus = new Set(["pending", "uploaded", "approved", "rejected"]);
  if (!allowedStatus.has(status)) {
    res.status(400).json({ ok: false, error: "invalid_status" });
    return;
  }

  const updated = await pool.query(
    `
      update public.documents
      set status=$2, note=nullif($3,''), updated_at=now()
      where id=$1
      returning id, created_at, updated_at, listing_id, title, status, note;
    `,
    [id, status, note],
  );

  if (!updated.rows[0]) {
    res.status(404).json({ ok: false, error: "not_found" });
    return;
  }

  res.status(200).json({ ok: true, document: updated.rows[0] });
});

app.get("/v1/milestones", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  const listingId = normalize(req.query.listing_id);
  if (!listingId) {
    res.status(400).json({ ok: false, error: "missing_listing_id" });
    return;
  }

  const milestones = await pool.query(
    `
      select id, created_at, updated_at, listing_id, key, title, status, due_at, completed_at, note
      from public.milestones
      where listing_id=$1
      order by id asc;
    `,
    [listingId],
  );
  res.status(200).json({ ok: true, milestones: milestones.rows });
});

app.post("/v1/milestones", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  const listingId = normalize(req.body?.listing_id);
  const key = normalize(req.body?.key);
  const title = normalize(req.body?.title);
  const dueAt = normalize(req.body?.due_at);
  const note = normalize(req.body?.note);

  if (!listingId || !key || !title) {
    res.status(400).json({ ok: false, error: "missing_fields" });
    return;
  }

  const inserted = await pool.query(
    `
      insert into public.milestones(listing_id, key, title, status, due_at, note)
      values ($1,$2,$3,'pending', nullif($4,'')::timestamptz, nullif($5,''))
      returning id, created_at, updated_at, listing_id, key, title, status, due_at, completed_at, note;
    `,
    [listingId, key, title, dueAt, note],
  );
  res.status(200).json({ ok: true, milestone: inserted.rows[0] });
});

app.patch("/v1/milestones/:id", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  const id = normalize(req.params.id);
  const status = normalize(req.body?.status);
  const note = normalize(req.body?.note);

  const allowedStatus = new Set(["pending", "in_progress", "done"]);
  if (!allowedStatus.has(status)) {
    res.status(400).json({ ok: false, error: "invalid_status" });
    return;
  }

  const updated = await pool.query(
    `
      update public.milestones
      set
        status=$2,
        note=nullif($3,''),
        updated_at=now(),
        completed_at = case when $2='done' then now() else null end
      where id=$1
      returning id, created_at, updated_at, listing_id, key, title, status, due_at, completed_at, note;
    `,
    [id, status, note],
  );

  if (!updated.rows[0]) {
    res.status(404).json({ ok: false, error: "not_found" });
    return;
  }

  res.status(200).json({ ok: true, milestone: updated.rows[0] });
});

app.get("/v1/signatures", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  const listingId = normalize(req.query.listing_id);
  if (!listingId) {
    res.status(400).json({ ok: false, error: "missing_listing_id" });
    return;
  }

  const signatures = await pool.query(
    `
      select id, created_at, updated_at, listing_id, title, status, provider, external_url, note
      from public.signature_requests
      where listing_id=$1
      order by id desc;
    `,
    [listingId],
  );
  res.status(200).json({ ok: true, signatures: signatures.rows });
});

app.post("/v1/signatures", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  const listingId = normalize(req.body?.listing_id);
  const title = normalize(req.body?.title);
  const note = normalize(req.body?.note);
  const provider = normalize(req.body?.provider) || "pending";

  if (!listingId || !title) {
    res.status(400).json({ ok: false, error: "missing_fields" });
    return;
  }

  const inserted = await pool.query(
    `
      insert into public.signature_requests(listing_id, title, status, provider, note)
      values ($1,$2,'draft',$3,nullif($4,''))
      returning id, created_at, updated_at, listing_id, title, status, provider, external_url, note;
    `,
    [listingId, title, provider, note],
  );

  try {
    await postToSlack(
      `Nueva solicitud de firma (beta)\nInmueble: ${listingId}\nDocumento: ${title}`,
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[lead-hub] Slack notify failed:", error);
  }

  res.status(200).json({ ok: true, signature: inserted.rows[0] });
});

app.patch("/v1/signatures/:id", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  const id = normalize(req.params.id);
  const status = normalize(req.body?.status);
  const externalUrl = normalize(req.body?.external_url);
  const note = normalize(req.body?.note);

  const allowedStatus = new Set(["draft", "sent", "signed", "failed"]);
  if (!allowedStatus.has(status)) {
    res.status(400).json({ ok: false, error: "invalid_status" });
    return;
  }

  const updated = await pool.query(
    `
      update public.signature_requests
      set
        status=$2,
        external_url=nullif($3,''),
        note=nullif($4,''),
        updated_at=now()
      where id=$1
      returning id, created_at, updated_at, listing_id, title, status, provider, external_url, note;
    `,
    [id, status, externalUrl, note],
  );

  if (!updated.rows[0]) {
    res.status(404).json({ ok: false, error: "not_found" });
    return;
  }
  res.status(200).json({ ok: true, signature: updated.rows[0] });
});

app.post("/v1/slack/test", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  if (!SLACK_WEBHOOK_URL) {
    res.status(500).json({ ok: false, error: "slack_not_configured" });
    return;
  }

  const text = normalize(req.body?.text) || "Test lead-hub → Slack (Verifika2)";
  try {
    await postToSlack(text);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(502).json({ ok: false, error: String(error) });
  }
});

app.post("/v1/leads", async (req, res) => {
  if (!HUB_TOKEN) {
    res.status(500).json({ ok: false, error: "hub_not_configured" });
    return;
  }

  const token = bearerToken(req);
  if (!token || !safeEqual(token, HUB_TOKEN)) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  if (!isRecord(req.body)) {
    res.status(400).json({ ok: false, error: "invalid_payload" });
    return;
  }

  const payload = req.body;
  const persona = normalize(payload.persona) === "propietario" ? "propietario" : "comprador";
  const intentRaw = normalize(payload.intent);
  const intent =
    intentRaw === "visita" ? "visita" : intentRaw === "contacto" ? "contacto" : "info";
  const contact = normalize(payload.contact);
  if (!contact) {
    res.status(400).json({ ok: false, error: "missing_contact" });
    return;
  }

  // eslint-disable-next-line no-console
  console.log(
    `[lead-hub] lead received intent=${intent} persona=${persona} contact=${contact}`,
  );

  const listing = isRecord(payload.listing) ? payload.listing : null;
  const listingId = listing ? normalize(listing.id) : "";
  const listingTitle = listing ? normalize(listing.title) : "";
  const listingCity = listing ? normalize(listing.city) : "";

  const source = isRecord(payload.source) ? payload.source : null;
  const sourcePath = source ? normalize(source.path) : "";
  const sourceHref = source ? normalize(source.href) : "";

  const envelope = {
    ...payload,
    receivedAt: new Date().toISOString(),
    userAgent: req.headers["user-agent"] || "",
    forwardedFor: req.headers["x-forwarded-for"] || "",
  };

  const insert = await pool.query(
    `
      insert into public.leads(
        persona, intent, contact, name, note,
        listing_id, listing_title, listing_city,
        source_path, source_href,
        user_agent, forwarded_for,
        payload
      )
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      returning *
    `,
    [
      persona,
      intent,
      contact,
      normalize(payload.name) || null,
      normalize(payload.note) || null,
      listingId || null,
      listingTitle || null,
      listingCity || null,
      sourcePath || null,
      sourceHref || null,
      req.headers["user-agent"] || "",
      req.headers["x-forwarded-for"] || "",
      envelope,
    ],
  );

  const leadRow = insert.rows[0];

  res.status(200).json({ ok: true, id: String(leadRow.id) });

  try {
    await notifySlack(leadRow);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[lead-hub] Slack notify failed:", error);
  }

  try {
    if (CRM_LEADS_ENDPOINT) {
      await pushToCrm(leadRow);
      await pool.query(
        "update public.leads set crm_status='sent', crm_error=null where id=$1;",
        [leadRow.id],
      );
    } else {
      await pool.query(
        "update public.leads set crm_status='skipped', crm_error=null where id=$1;",
        [leadRow.id],
      );
    }
  } catch (error) {
    await pool.query(
      "update public.leads set crm_status='error', crm_error=$2 where id=$1;",
      [leadRow.id, String(error).slice(0, 500)],
    );
  }

  // eslint-disable-next-line no-console
  console.log(`[lead-hub] lead saved id=${leadRow.id}`);
});

ensureSchema()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`[lead-hub] listening on :${PORT}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("[lead-hub] failed to start:", error);
    process.exit(1);
  });
