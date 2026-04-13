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
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || "";
const CRM_LEADS_ENDPOINT = process.env.CRM_LEADS_ENDPOINT || "";
const CRM_TOKEN = process.env.CRM_TOKEN || "";

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
  await pool.query(
    "create index if not exists leads_created_at_idx on public.leads(created_at desc);",
  );
  await pool.query(
    "create index if not exists leads_listing_id_idx on public.leads(listing_id);",
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

async function pushToCrm(leadRow) {
  if (!CRM_LEADS_ENDPOINT) return;
  const res = await fetch(CRM_LEADS_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(CRM_TOKEN ? { authorization: `Bearer ${CRM_TOKEN}` } : {}),
    },
    body: JSON.stringify(leadRow.payload),
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
    await pushToCrm(leadRow);
    await pool.query("update public.leads set crm_status='sent', crm_error=null where id=$1;", [
      leadRow.id,
    ]);
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
