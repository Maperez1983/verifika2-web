import { NextResponse } from "next/server";
import { leadHubFetch } from "@/lib/leadHub";
import { publicOrigin } from "@/lib/http";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

function buildNote(parts: Array<string | null | undefined>) {
  const clean = (parts || [])
    .map((p) => normalize(p))
    .filter(Boolean);
  return clean.length ? clean.join("\n") : undefined;
}

export async function POST(request: Request) {
  const origin = publicOrigin(request);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.redirect(new URL("/publicar?error=invalid_form", origin), 302);
  }

  const name = normalize(form.get("nombre")) || undefined;
  const email = normalize(form.get("email")) || "";
  const phone = normalize(form.get("telefono")) || "";
  const city = normalize(form.get("ciudad")) || "";
  const operation = normalize(form.get("operacion")) || "";
  const message = normalize(form.get("mensaje")) || "";
  const consent = normalize(form.get("consent"));

  const contact = email || phone;
  if (!contact) return NextResponse.redirect(new URL("/publicar?error=missing_contact", origin), 302);
  if (consent !== "1") return NextResponse.redirect(new URL("/publicar?error=missing_consent", origin), 302);

  const note = buildNote([
    "Solicitud: Publicar inmueble",
    operation ? `Operación: ${operation}` : null,
    city ? `Ciudad: ${city}` : null,
    phone ? `Teléfono: ${phone}` : null,
    message ? `Mensaje: ${message}` : null,
  ]);

  const payload = {
    persona: "propietario",
    intent: "contacto",
    name,
    contact,
    note,
    source: {
      path: new URL(request.url).pathname,
      href: request.headers.get("referer") ?? "",
    },
  };

  try {
    const res = await leadHubFetch("/v1/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return NextResponse.redirect(new URL("/publicar?sent=0&error=hub_failed", origin), 302);
  } catch {
    return NextResponse.redirect(new URL("/publicar?sent=0&error=hub_not_configured", origin), 302);
  }

  return NextResponse.redirect(new URL("/publicar?sent=1", origin), 302);
}

