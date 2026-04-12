import { NextResponse } from "next/server";

type LeadIntent = "info" | "visita" | "contacto";
type Persona = "comprador" | "propietario";

type LeadPayload = {
  persona: Persona;
  intent: LeadIntent;
  name?: string;
  contact: string;
  note?: string;
  listing?: {
    id: string;
    title?: string;
    city?: string;
    operation?: "venta" | "alquiler";
    verifiedAt?: string;
    certified?: boolean;
  };
  source?: {
    path?: string;
    href?: string;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

function pickIntent(value: unknown): LeadIntent {
  const v = normalize(value);
  if (v === "visita") return "visita";
  if (v === "contacto") return "contacto";
  return "info";
}

function pickPersona(value: unknown): Persona {
  const v = normalize(value);
  return v === "propietario" ? "propietario" : "comprador";
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!isRecord(raw)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const payload = raw as Record<string, unknown>;
  const contact = normalize(payload.contact);
  if (!contact) {
    return NextResponse.json({ ok: false, error: "missing_contact" }, { status: 400 });
  }

  const lead: LeadPayload = {
    persona: pickPersona(payload.persona),
    intent: pickIntent(payload.intent),
    name: normalize(payload.name) || undefined,
    contact,
    note: normalize(payload.note) || undefined,
  };

  if (isRecord(payload.listing)) {
    const l = payload.listing;
    const id = normalize(l.id);
    if (id) {
      lead.listing = {
        id,
        title: normalize(l.title) || undefined,
        city: normalize(l.city) || undefined,
        operation: l.operation === "alquiler" ? "alquiler" : l.operation === "venta" ? "venta" : undefined,
        verifiedAt: normalize(l.verifiedAt) || undefined,
        certified: Boolean(l.certified),
      };
    }
  }

  if (isRecord(payload.source)) {
    lead.source = {
      path: normalize(payload.source.path) || undefined,
      href: normalize(payload.source.href) || undefined,
    };
  }

  const envelope = {
    ...lead,
    createdAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") ?? "",
    forwardedFor: request.headers.get("x-forwarded-for") ?? "",
  };

  const webhookUrl = process.env.LEADS_WEBHOOK_URL;
  const webhookToken = process.env.LEADS_WEBHOOK_TOKEN;

  if (webhookUrl) {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(webhookToken ? { authorization: `Bearer ${webhookToken}` } : {}),
      },
      body: JSON.stringify(envelope),
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "webhook_failed" }, { status: 502 });
    }
  } else {
    // Temporary fallback: visible in Render logs while CRM sink is not wired.
    console.log("[verifika2-web] lead", envelope);
  }

  return NextResponse.json({ ok: true });
}

