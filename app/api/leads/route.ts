import { NextResponse } from "next/server";
import { leadHubFetch } from "@/lib/leadHub";

type LeadIntent = "info" | "visita" | "oferta" | "contacto";
type Persona = "comprador" | "propietario";

type LeadPayload = {
  persona: Persona;
  intent: LeadIntent;
  name?: string;
  contact: string;
  phone?: string;
  email?: string;
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
  if (v === "oferta") return "oferta";
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
    phone: normalize(payload.phone) || undefined,
    email: normalize(payload.email) || undefined,
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

  let buyerCode = "";
  try {
    const res = await leadHubFetch("/v1/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(envelope),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return NextResponse.json(
        { ok: false, error: "lead_hub_failed", detail: body.slice(0, 160) },
        { status: 502 },
      );
    }
    const data = await res.json().catch(() => null);
    buyerCode = String(data?.buyer_code ?? "").trim();
  } catch {
    // Temporary fallback: visible in Render logs while lead hub is not wired.
    console.log("[verifika2-web] lead", envelope);
  }

  return NextResponse.json({ ok: true, buyerCode: buyerCode || undefined });
}
