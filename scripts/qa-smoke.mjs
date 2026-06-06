import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import net from "node:net";

const listingId = "qa-listing-001";
const adminPassword = "Chapapote_10";
const portalPassword = "Chapapote_10";
const sessionSecret = "qa_session_secret_32_chars_minimum";
const hubToken = "qa-token";

const listing = {
  id: listingId,
  titulo: "Piso QA verificado",
  direccion: "Calle QA 10",
  poblacion: "Málaga",
  provincia: "Málaga",
  zona: "Centro",
  tipo_operacion: "venta",
  tipo_inmueble: "piso",
  precio: 245000,
  habitaciones: 3,
  banos: 2,
  m2: 120,
  descripcion: "Inmueble QA con documentación revisada y seguimiento trazable.",
  publicado_at: "2026-06-05T10:00:00Z",
  certificado: 1,
  lat: 36.7213,
  lon: -4.4214,
};

const captured = {
  leads: [],
  buyerVerify: [],
  ownerVerify: [],
  consents: [],
  operationServices: [],
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function json(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : null;
}

function createMockServer() {
  return createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://mock.local");
    const auth = req.headers.authorization || "";

    if (url.pathname.startsWith("/v1/") && auth !== `Bearer ${hubToken}`) {
      return json(res, 401, { ok: false, error: "unauthorized" });
    }

    if (url.pathname === "/api/portal_inmuebles") {
      return json(res, 200, { listings: [listing] });
    }

    if (url.pathname === "/api/portal_inmueble") {
      const id = url.searchParams.get("id");
      return json(res, id === listingId ? 200 : 404, id === listingId ? { listing } : { error: "not_found" });
    }

    if (url.pathname === "/v1/leads" && req.method === "POST") {
      const body = await readJson(req);
      captured.leads.push(body);
      return json(res, 200, { ok: true, buyer_code: "CB-QA-2026" });
    }

    if (url.pathname === "/v1/buyers/verify" && req.method === "POST") {
      const body = await readJson(req);
      captured.buyerVerify.push(body);
      const ok = body?.contact === "buyer@example.com" && body?.code === "CB-QA-2026";
      return json(res, ok ? 200 : 403, ok ? { buyer: { id: "buyer-qa", contact: "buyer@example.com", services: [] } } : { error: "invalid" });
    }

    if (url.pathname === "/v1/buyers/leads") {
      return json(res, 200, {
        leads: [
          {
            id: "lead-qa",
            created_at: "2026-06-05T10:00:00Z",
            intent: "info",
            contact: "buyer@example.com",
            name: "Buyer QA",
            note: "Motivo: documentacion",
            listing_id: listingId,
            listing_title: listing.titulo,
            listing_city: listing.poblacion,
            status: "contacted",
            scheduled_at: null,
            outcome: null,
            outcome_note: null,
          },
        ],
      });
    }

    if (url.pathname === "/v1/buyers") {
      return json(res, 200, {
        buyers: [
          {
            id: "buyer-qa",
            created_at: "2026-06-05T10:00:00Z",
            updated_at: "2026-06-05T10:00:00Z",
            name: "Buyer QA",
            contact: "buyer@example.com",
            services: [],
            status: "active",
          },
        ],
      });
    }

    if (url.pathname === "/v1/owners/verify" && req.method === "POST") {
      const body = await readJson(req);
      captured.ownerVerify.push(body);
      const ok = body?.code === "V2-QA-2026";
      return json(res, ok ? 200 : 403, ok ? { owner: { id: "owner-qa", listing_ids: [listingId], services: [] } } : { error: "invalid" });
    }

    if (url.pathname === "/v1/owners") {
      return json(res, 200, {
        owners: [
          {
            id: "owner-qa",
            created_at: "2026-06-05T10:00:00Z",
            name: "Owner QA",
            contact: "owner@example.com",
            listing_ids: [listingId],
            services: [],
            status: "active",
          },
        ],
      });
    }

    if (url.pathname === "/v1/consents/status") {
      const persona = url.searchParams.get("persona");
      const subjectId = url.searchParams.get("subject_id");
      const accepted = captured.consents.some((item) => item?.persona === persona && item?.subject_id === subjectId);
      return json(res, 200, { ok: true, accepted, consent: accepted ? { id: "consent-qa" } : null });
    }

    if (url.pathname === "/v1/consents" && req.method === "POST") {
      const body = await readJson(req);
      captured.consents.push(body);
      return json(res, 200, { ok: true, consent: { id: `consent-${captured.consents.length}`, ...body } });
    }

    if (url.pathname === "/v1/operation_services" && req.method === "GET") {
      const listing = url.searchParams.get("listing_id");
      const subjectType = url.searchParams.get("subject_type");
      const subjectContact = url.searchParams.get("subject_contact");
      const status = url.searchParams.get("status");
      const serviceName = url.searchParams.get("service");
      const services = captured.operationServices.filter((service) => {
        if (listing && service.listing_id !== listing) return false;
        if (subjectType && service.subject_type !== subjectType) return false;
        if (subjectContact && service.subject_contact !== subjectContact) return false;
        if (status && service.status !== status) return false;
        if (serviceName && service.service !== serviceName) return false;
        return true;
      });
      return json(res, 200, { ok: true, services });
    }

    if (url.pathname === "/v1/operation_services/summary") {
      const open = captured.operationServices.filter((service) => ["active", "in_review", "requested"].includes(service.status));
      return json(res, 200, {
        ok: true,
        summary: {
          total: captured.operationServices.length,
          open: open.length,
          tracking_open: open.filter((service) => service.service === "purchase_tracking").length,
          verification_open: open.filter((service) => String(service.service).startsWith("document_verification")).length,
          buyer_open: open.filter((service) => service.subject_type === "buyer").length,
          owner_open: open.filter((service) => service.subject_type === "owner").length,
        },
        by_status: [],
      });
    }

    if (url.pathname === "/v1/operation_services" && req.method === "POST") {
      const body = await readJson(req);
      captured.operationServices = captured.operationServices.filter(
        (service) =>
          !(
            service.listing_id === body?.listing_id &&
            service.subject_type === body?.subject_type &&
            service.subject_contact === body?.subject_contact &&
            service.service === body?.service
          ),
      );
      captured.operationServices.push({
        id: `svc-${captured.operationServices.length + 1}`,
        created_at: "2026-06-05T10:00:00Z",
        updated_at: "2026-06-05T10:00:00Z",
        ...body,
      });
      return json(res, 200, { ok: true, service: captured.operationServices.at(-1) });
    }

    if (url.pathname === "/v1/service_audit") {
      return json(res, 200, {
        ok: true,
        audit: captured.operationServices.map((service, index) => ({
          id: `audit-${index + 1}`,
          created_at: "2026-06-05T10:00:00Z",
          listing_id: service.listing_id,
          subject_type: service.subject_type,
          subject_contact: service.subject_contact,
          service: service.service,
          action: "service_status",
          status: service.status,
          actor: "admin",
          note: service.note || null,
        })),
      });
    }

    if (url.pathname === "/v1/qa/summary") {
      return json(res, 200, {
        ok: true,
        summary: {
          leads: captured.leads.length,
          buyers: 1,
          owners: 1,
          operation_services: captured.operationServices.length,
          consents: captured.consents.length,
        },
      });
    }

    if (url.pathname === "/v1/qa/archive" && req.method === "POST") {
      const body = await readJson(req);
      if (body?.confirm !== "ARCHIVE_QA") return json(res, 400, { ok: false, error: "missing_confirmation" });
      const services = captured.operationServices.length;
      captured.operationServices = captured.operationServices.map((service) => ({ ...service, status: "cancelled", note: "Archivado QA" }));
      return json(res, 200, {
        ok: true,
        archived: {
          operation_services: services,
          buyers: 1,
          owners: 1,
          leads: captured.leads.length,
        },
      });
    }

    if (url.pathname === "/v1/metrics") {
      return json(res, 200, {
        ok: true,
        metrics: { views: 12, last_view_at: "2026-06-05T10:00:00Z" },
        counts: { leads_total: 3, leads_info: 1, leads_visita: 1, leads_oferta: 1 },
      });
    }

    if (url.pathname === "/v1/metrics/timeseries") {
      return json(res, 200, {
        points: Array.from({ length: 14 }, (_, i) => ({
          day: `2026-05-${String(22 + i).padStart(2, "0")}`,
          views: i + 1,
          leads: i % 2,
          visits: i % 3 === 0 ? 1 : 0,
          info: i % 2,
          offers: i % 7 === 0 ? 1 : 0,
        })),
      });
    }

    if (url.pathname === "/v1/config") {
      return json(res, 200, {
        ok: true,
        hubConfigured: true,
        slackConfigured: true,
        databaseConfigured: true,
        crmConfigured: true,
      });
    }

    if (url.pathname === "/v1/documents" || url.pathname === "/v1/milestones" || url.pathname === "/v1/signatures") {
      return json(res, 200, { documents: [], milestones: [], signatures: [] });
    }

    return json(res, 404, { error: "not_found", path: url.pathname });
  });
}

async function freePort() {
  const server = net.createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  server.close();
  await once(server, "close");
  return port;
}

async function waitFor(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await delay(500);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function cookieFrom(response, name) {
  const raw = response.headers.get("set-cookie") || "";
  const match = raw.match(new RegExp(`${name}=([^;]+)`));
  return match ? `${name}=${match[1]}` : "";
}

async function get(baseUrl, path, cookie = "") {
  return fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    headers: cookie ? { cookie } : undefined,
  });
}

async function postForm(baseUrl, path, fields, cookie = "") {
  return fetch(`${baseUrl}${path}`, {
    method: "POST",
    redirect: "manual",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      ...(cookie ? { cookie } : {}),
    },
    body: new URLSearchParams(fields),
  });
}

async function main() {
  const mockServer = createMockServer();
  mockServer.listen(0, "127.0.0.1");
  await once(mockServer, "listening");
  const mockPort = mockServer.address().port;
  const mockOrigin = `http://127.0.0.1:${mockPort}`;
  const appPort = await freePort();
  const baseUrl = `http://127.0.0.1:${appPort}`;

  const child = spawn("npm", ["run", "start", "--", "--hostname", "127.0.0.1", "--port", String(appPort)], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: "development",
      NEXT_PUBLIC_SITE_URL: baseUrl,
      CRM_ORIGIN: mockOrigin,
      CRM_PORTAL_ORIGIN: mockOrigin,
      LEAD_HUB_URL: mockOrigin,
      LEAD_HUB_TOKEN: hubToken,
      LEADS_WEBHOOK_URL: mockOrigin,
      LEADS_WEBHOOK_TOKEN: hubToken,
      PORTAL_PASSWORD: portalPassword,
      PORTAL_AUTH_SECRET: sessionSecret,
      ADMIN_PASSWORD: adminPassword,
      ADMIN_AUTH_SECRET: sessionSecret,
      OWNER_SESSION_SECRET: sessionSecret,
      BUYER_SESSION_SECRET: sessionSecret,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  try {
    await waitFor(`${baseUrl}/healthz`);

    const publicRoutes = [
      ["/", "Portal inmobiliario premium"],
      ["/como-funciona", "Del CRM a la venta"],
      ["/seguridad-juridica", "Menos incertidumbre documental"],
      ["/compradores", "Experiencia comprador"],
      ["/propietarios", "Control 360"],
      ["/profesionales", "Para inmobiliarias"],
    ];

    for (const [path, expected] of publicRoutes) {
      const res = await get(baseUrl, path);
      const html = await res.text();
      assert(res.status === 200, `${path} should return 200, got ${res.status}`);
      assert(html.includes(expected), `${path} should include "${expected}"`);
    }

    const protectedRes = await get(baseUrl, "/inmuebles");
    assert(protectedRes.status === 302, "/inmuebles should redirect to access when portal password is configured");
    assert((protectedRes.headers.get("location") || "").includes("/acceso"), "/inmuebles should redirect to /acceso");

    const authRes = await postForm(baseUrl, "/api/portal-auth", {
      password: ` ${portalPassword}\u200B `,
      next: "/inmuebles",
    });
    assert(authRes.status === 302, "portal auth should redirect after success");
    const portalCookie = cookieFrom(authRes, "v2_portal_auth");
    assert(portalCookie, "portal auth should set v2_portal_auth cookie");

    const listingsRes = await get(baseUrl, "/inmuebles", portalCookie);
    const listingsHtml = await listingsRes.text();
    assert(listingsRes.status === 200, `/inmuebles authenticated should return 200, got ${listingsRes.status}`);
    assert(listingsHtml.includes("Piso QA verificado"), "/inmuebles should render CRM listing");
    assert(listingsHtml.includes("Grupo Modernia"), "/inmuebles should show publisher");

    const publishPage = await get(baseUrl, "/publicar", portalCookie);
    const publishHtml = await publishPage.text();
    assert(publishPage.status === 200, "/publicar authenticated should return 200");
    assert(publishHtml.includes("Portal inmobiliario verificado"), "/publicar should render product landing");

    const detailRes = await get(baseUrl, `/inmuebles/${listingId}`, portalCookie);
    const detailHtml = await detailRes.text();
    assert(detailRes.status === 200, "listing detail should return 200");
    assert(detailHtml.includes("Piso QA verificado"), "listing detail should render title");
    assert(detailHtml.includes("Qué quieres hacer"), "listing detail should render guided actions");

    const interestPage = await get(baseUrl, `/interes?listing=${listingId}&tipo=info&motivo=documentacion&next=/inmuebles/${listingId}`, portalCookie);
    const interestHtml = await interestPage.text();
    assert(interestPage.status === 200, "/interes should return 200");
    assert(interestHtml.includes("Pedir documentación"), "/interes should reflect guided motive");
    assert(interestHtml.includes("Resumen de la solicitud"), "/interes should render summary");

    const leadRes = await postForm(baseUrl, "/api/interes", {
      listing: listingId,
      tipo: "info",
      motivo: "documentacion",
      nombre: "Buyer QA",
      telefono: "600000000",
      email: "buyer@example.com",
      mensaje: "Necesito nota simple",
      consent: "1",
      next: `/inmuebles/${listingId}`,
    }, portalCookie);
    assert(leadRes.status === 302, "interest POST should redirect");
    const leadLocation = leadRes.headers.get("location") || "";
    assert(leadLocation.includes("sent=1"), "interest POST should redirect with sent=1");
    assert(leadLocation.includes("buyer_code=CB-QA-2026"), "interest POST should expose buyer code");
    assert(captured.leads.some((lead) => lead?.persona === "comprador" && lead?.listing?.id === listingId && String(lead?.note || "").includes("Motivo: documentacion")), "interest POST should send buyer lead to Lead Hub");

    const publishRes = await postForm(baseUrl, "/api/publicar", {
      nombre: "Owner QA",
      telefono: "600111222",
      email: "owner@example.com",
      ciudad: "Málaga",
      operacion: "venta",
      mensaje: "Quiero publicar mi inmueble",
      consent: "1",
    }, portalCookie);
    assert(publishRes.status === 302, "publish POST should redirect");
    assert((publishRes.headers.get("location") || "").includes("sent=1"), "publish POST should redirect with sent=1");
    assert(captured.leads.some((lead) => lead?.persona === "propietario" && String(lead?.note || "").includes("Solicitud: Publicar inmueble")), "publish POST should create owner lead");

    const buyerAuth = await postForm(baseUrl, "/api/buyer-auth", {
      contact: "buyer@example.com",
      code: "CB-QA-2026",
      next: "/comprador",
    });
    assert(buyerAuth.status === 302, "buyer auth should redirect");
    const buyerCookie = cookieFrom(buyerAuth, "v2_buyer_session");
    assert(buyerCookie, "buyer auth should set buyer session cookie");
    assert((buyerAuth.headers.get("location") || "").includes("/comprador/tratamiento-datos"), "buyer auth should require consent first");
    const buyerConsent = await postForm(baseUrl, "/api/buyer-consent", {
      signer_name: "Buyer QA",
      signer_id_doc: "00000000T",
      signature_text: "Buyer QA",
      accepted_privacy: "1",
      accepted_operations: "1",
      accepted_rights: "1",
      accepted_marketing: "1",
      next: "/comprador",
    }, buyerCookie);
    assert(buyerConsent.status === 302, "buyer consent should redirect");
    const buyerArea = await get(baseUrl, "/comprador", buyerCookie);
    const buyerHtml = await buyerArea.text();
    assert(buyerArea.status === 200, "buyer area should return 200 with session");
    assert(buyerHtml.includes("Seguimiento privado de tu búsqueda"), "buyer area should render dashboard");

    const ownerAuth = await postForm(baseUrl, "/api/owner-auth", {
      code: "V2-QA-2026",
      next: "/owner",
    });
    assert(ownerAuth.status === 302, "owner auth should redirect");
    const ownerCookie = cookieFrom(ownerAuth, "v2_owner_session");
    assert(ownerCookie, "owner auth should set owner session cookie");
    assert((ownerAuth.headers.get("location") || "").includes("/owner/tratamiento-datos"), "owner auth should require consent first");
    const ownerConsent = await postForm(baseUrl, "/api/owner-consent", {
      signer_name: "Owner QA",
      signer_id_doc: "11111111H",
      signature_text: "Owner QA",
      accepted_privacy: "1",
      accepted_operations: "1",
      accepted_rights: "1",
      next: "/owner",
    }, ownerCookie);
    assert(ownerConsent.status === 302, "owner consent should redirect");
    const ownerArea = await get(baseUrl, "/owner", ownerCookie);
    const ownerHtml = await ownerArea.text();
    assert(ownerArea.status === 200, "owner area should return 200 with session");
    assert(ownerHtml.includes("Control comercial y documental"), "owner area should render dashboard");

    const adminAuth = await postForm(baseUrl, "/api/admin-auth", {
      password: adminPassword,
      next: "/admin",
    });
    assert(adminAuth.status === 302, "admin auth should redirect");
    const adminCookie = cookieFrom(adminAuth, "v2_admin_auth");
    assert(adminCookie, "admin auth should set admin cookie");

    const adminBuyers = await get(baseUrl, "/admin/buyers", adminCookie);
    const adminBuyersHtml = await adminBuyers.text();
    assert(adminBuyers.status === 200, "admin buyers should return 200");
    assert(adminBuyersHtml.includes("Compradores existentes"), "admin buyers should list existing buyers");

    const activateService = await postForm(baseUrl, "/api/admin/services/activate", {
      return_to: "/admin/buyers",
      listing_id: listingId,
      subject_type: "buyer",
      subject_contact: "buyer@example.com",
      subject_id: "buyer-qa",
      service: "purchase_tracking",
      status: "active",
      note: "QA tracking",
    }, adminCookie);
    assert(activateService.status === 303, "service activation should redirect");
    assert(captured.operationServices.some((service) => service.listing_id === listingId && service.subject_contact === "buyer@example.com" && service.service === "purchase_tracking"), "service activation should persist operation service");

    const buyerAreaWithService = await get(baseUrl, "/comprador", buyerCookie);
    const buyerServiceHtml = await buyerAreaWithService.text();
    assert(buyerServiceHtml.includes("Tracking activo"), "buyer area should show operation tracking when admin enables it");

    const adminListing = await get(baseUrl, `/admin/listings/${listingId}`, adminCookie);
    const adminListingHtml = await adminListing.text();
    assert(adminListing.status === 200, "admin listing should return 200");
    assert(adminListingHtml.includes("Servicios de operación"), "admin listing should show operation services");
    assert(adminListingHtml.includes("Auditoría de servicios"), "admin listing should show service audit");

    const operationsPage = await get(baseUrl, "/admin/operations", adminCookie);
    const operationsHtml = await operationsPage.text();
    assert(operationsPage.status === 200, "admin operations should return 200");
    assert(operationsHtml.includes("Operaciones y servicios"), "admin operations should render title");
    assert(operationsHtml.includes("Tracking de compraventa"), "admin operations should list active tracking");
    assert(operationsHtml.includes("Archivo QA"), "admin operations should expose QA archive tool");

    const qaArchive = await postForm(baseUrl, "/api/admin/qa/archive", {
      return_to: "/admin/operations",
      confirm: "ARCHIVE_QA",
    }, adminCookie);
    assert(qaArchive.status === 303, "QA archive should redirect");
    assert((qaArchive.headers.get("location") || "").includes("qa_archived=1"), "QA archive should report success");

    console.log("QA smoke passed");
    console.log(`Validated ${publicRoutes.length + 22} critical checks against mocked CRM/Lead Hub`);
  } finally {
    child.kill("SIGINT");
    mockServer.close();
    await Promise.race([once(child, "exit"), delay(5000)]);
    await Promise.race([once(mockServer, "close"), delay(1000)]).catch(() => {});
    if (child.exitCode && child.exitCode !== 0 && !output.includes("Ready")) {
      console.error(output);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
