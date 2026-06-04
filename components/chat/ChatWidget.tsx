"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

type ChatRole = "bot" | "user";
type Persona = "comprador" | "propietario";
type LeadIntent = "info" | "visita" | "oferta" | "contacto";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

export type ChatListingContext = {
  id: string;
  title: string;
  city: string;
  operation: "venta" | "alquiler";
  verifiedAt: string;
  certified: boolean;
  priceLabel?: string;
  detailsShort?: string;
};

type Props = {
  listing?: ChatListingContext;
  defaultPersona?: Persona;
  scope?: string;
};

const uid = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

function readStored(key: string): {
  messages: ChatMessage[] | null;
  persona: Persona | null;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const storedMessages = Array.isArray(parsed?.messages)
      ? (parsed.messages as ChatMessage[])
      : null;
    const storedPersona =
      parsed?.persona === "comprador" || parsed?.persona === "propietario"
        ? (parsed.persona as Persona)
        : null;
    return { messages: storedMessages, persona: storedPersona };
  } catch {
    return null;
  }
}

function intentLabel(intent: LeadIntent) {
  if (intent === "visita") return "Pedir visita";
  if (intent === "oferta") return "Hacer oferta";
  if (intent === "contacto") return "Contacto";
  return "Solicitar información";
}

function botIntro(listing?: ChatListingContext) {
  if (!listing) {
    return "Hola. Soy el asistente de Verifika2. Puedo ayudarte a encontrar inmuebles, pedir visita, consultar verificación o dejar tus datos.";
  }
  return `Hola. Estoy viendo “${listing.title}”. Puedo resolver dudas del anuncio, explicarte la verificación o registrar visita/oferta.`;
}

export default function ChatWidget({ listing, defaultPersona, scope }: Props) {
  const storageScope = scope?.trim() ? scope.trim() : "portal";
  const storageKey = useMemo(
    () => `v2_portal_chat:${storageScope}:${listing?.id || "global"}`,
    [listing?.id, storageScope],
  );
  const defaultMessages = useMemo<ChatMessage[]>(
    () => [{ id: uid(), role: "bot", text: botIntro(listing) }],
    [listing],
  );
  const initialStored = useMemo(() => readStored(storageKey), [storageKey]);

  const [open, setOpen] = useState(false);
  const [persona, setPersona] = useState<Persona>(
    initialStored?.persona ?? defaultPersona ?? "comprador",
  );
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialStored?.messages ?? defaultMessages,
  );
  const [draft, setDraft] = useState("");
  const [leadIntent, setLeadIntent] = useState<LeadIntent | null>(null);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadUrgency, setLeadUrgency] = useState("");
  const [leadSchedule, setLeadSchedule] = useState("");
  const [leadBudget, setLeadBudget] = useState("");
  const [leadNote, setLeadNote] = useState("");
  const [sendingLead, setSendingLead] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ messages, persona }));
    } catch {}
  }, [messages, persona, storageKey]);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [open, messages.length, leadIntent]);

  const push = (role: ChatRole, text: string) => {
    setMessages((prev) => [...prev, { id: uid(), role, text }]);
  };

  const resetConversation = () => {
    const fresh = [{ id: uid(), role: "bot" as const, text: botIntro(listing) }];
    setMessages(fresh);
    setLeadIntent(null);
    setDraft("");
  };

  const describeListing = () => {
    if (!listing) {
      push(
        "bot",
        "Puedo ayudarte a filtrar por venta, alquiler, tipo de inmueble o ciudad. También puedo registrar tus datos para que el equipo te contacte.",
      );
      return;
    }
    const parts = [
      listing.priceLabel,
      listing.detailsShort,
      listing.city,
      listing.operation === "alquiler" ? "alquiler" : "venta",
    ].filter(Boolean);
    push("bot", `Resumen: ${parts.join(" · ")}.`);
  };

  const answerVerification = () => {
    const base =
      "Verificado significa que la información del anuncio se revisa antes de publicarse y que el interés queda trazado.";
    if (!listing) {
      push("bot", `${base} En cada ficha verás el estado concreto del inmueble.`);
      return;
    }
    push(
      "bot",
      `${base} Este inmueble figura revisado el ${listing.verifiedAt}. La documentación completa se confirma bajo solicitud comercial.`,
    );
  };

  const answerCertification = () => {
    if (listing?.certified) {
      push(
        "bot",
        "Este inmueble tiene certificación premium. Si quieres, puedo registrar una solicitud para ampliar alcance y documentación disponible.",
      );
      return;
    }
    push(
      "bot",
      "La certificación premium es una revisión reforzada. Si el inmueble solo está verificado, se puede solicitar más documentación antes de avanzar.",
    );
  };

  const answerPrice = () => {
    if (!listing?.priceLabel) {
      push(
        "bot",
        "El precio se confirma en la ficha o bajo solicitud. Puedo registrar tus datos para que Grupo Modernia te indique condiciones.",
      );
      return;
    }
    push(
      "bot",
      `El precio publicado es ${listing.priceLabel}. Puedo registrar una consulta sobre condiciones, disponibilidad, gastos u oferta.`,
    );
  };

  const answerLocation = () => {
    if (!listing) {
      push(
        "bot",
        "En el listado puedes filtrar por ciudad y tipo. En la ficha se muestra la zona pública disponible y la dirección exacta se confirma al gestionar la visita.",
      );
      return;
    }
    push(
      "bot",
      `El inmueble está en ${listing.city}. Por privacidad, la dirección exacta se confirma cuando se gestiona la visita.`,
    );
  };

  const ownerHelp = () => {
    setPersona("propietario");
    setLeadIntent(null);
    push(
      "bot",
      "Como propietario puedes consultar reportes de leads, citas, estado de clientes, documentación y el anuncio publicado desde tu área privada. Si no tienes acceso, deja tus datos y lo gestionan.",
    );
  };

  const ownerStatus = () => {
    setPersona("propietario");
    push(
      "bot",
      "En el dashboard de propietario se ven vistas del anuncio, leads, visitas, ofertas, clientes activos y próximos pasos. En cada inmueble hay pestañas de clientes, agenda y anuncio.",
    );
  };

  const ownerDocs = () => {
    setPersona("propietario");
    push(
      "bot",
      "La documentación se puede centralizar en el área privada: queda registrada, revisada y asociada al inmueble.",
    );
  };

  const startLead = (intent: LeadIntent) => {
    setLeadIntent(intent);
    push("user", intentLabel(intent));
    if (intent === "visita") {
      push(
        "bot",
        "Perfecto. Déjame teléfono, disponibilidad y prioridad para coordinar la visita.",
      );
      return;
    }
    if (intent === "oferta") {
      push(
        "bot",
        "Perfecto. Indica importe aproximado, teléfono y cualquier condición relevante para trasladarlo al equipo.",
      );
      return;
    }
    push(
      "bot",
      "Perfecto. Déjame tus datos y qué necesitas saber para que el equipo responda con contexto.",
    );
  };

  const handleQuick = (key: string) => {
    setLeadIntent(null);
    if (key === "resumen") return describeListing();
    if (key === "verificacion") return answerVerification();
    if (key === "certificacion") return answerCertification();
    if (key === "precio") return answerPrice();
    if (key === "ubicacion") return answerLocation();
    if (key === "visita") return startLead("visita");
    if (key === "info") return startLead("info");
    if (key === "oferta") return startLead("oferta");
    if (key === "propietario") return ownerHelp();
    if (key === "estado") return ownerStatus();
    if (key === "docs") return ownerDocs();
  };

  const clearLeadFields = () => {
    setLeadName("");
    setLeadPhone("");
    setLeadEmail("");
    setLeadUrgency("");
    setLeadSchedule("");
    setLeadBudget("");
    setLeadNote("");
  };

  const submitLead = async () => {
    if (sendingLead) return;
    const intent = leadIntent || "contacto";
    const safeName = leadName.trim();
    const safePhone = leadPhone.trim();
    const safeEmail = leadEmail.trim();
    const safeUrgency = leadUrgency.trim();
    const safeSchedule = leadSchedule.trim();
    const safeBudget = leadBudget.trim();
    const safeNote = leadNote.trim();
    const contact = safePhone || safeEmail;

    if (!contact) {
      push("bot", "Necesito teléfono o email para registrar la solicitud.");
      return;
    }
    if ((intent === "visita" || intent === "oferta") && !safePhone) {
      push("bot", "Para visita u oferta necesito teléfono para que el equipo pueda priorizar la respuesta.");
      return;
    }

    setSendingLead(true);
    const source =
      typeof window === "undefined"
        ? undefined
        : { path: window.location.pathname, href: window.location.href };
    const note = [
      `Motivo: ${intent}`,
      safeUrgency ? `Prioridad: ${safeUrgency}` : null,
      safeSchedule ? `Horario preferido: ${safeSchedule}` : null,
      safeBudget ? `Presupuesto/oferta: ${safeBudget}` : null,
      safePhone ? `Teléfono: ${safePhone}` : null,
      safeEmail ? `Email: ${safeEmail}` : null,
      safeNote ? `Mensaje: ${safeNote}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          persona,
          intent,
          name: safeName || undefined,
          contact,
          phone: safePhone || undefined,
          email: safeEmail || undefined,
          note,
          listing,
          source,
        }),
      });
      if (!res.ok) {
        push(
          "bot",
          "Ahora mismo no he podido registrar la solicitud. Inténtalo de nuevo en unos minutos.",
        );
        return;
      }
      const data = await res.json().catch(() => null);
      const buyerCode = typeof data?.buyerCode === "string" ? data.buyerCode.trim() : "";
      if (buyerCode) {
        push(
          "bot",
          `Código de área comprador: ${buyerCode}. Puedes entrar en /comprador con tu teléfono/email y este código.`,
        );
      }
    } catch {
      push(
        "bot",
        "Ahora mismo no he podido registrar la solicitud. Inténtalo de nuevo en unos minutos.",
      );
      return;
    } finally {
      setSendingLead(false);
    }

    push(
      "user",
      `${intentLabel(intent)} · ${safeName || "Sin nombre"} · ${contact}`,
    );
    push(
      "bot",
      "Listo. La solicitud queda registrada con el inmueble y el contexto comercial. Te contactarán lo antes posible.",
    );
    setLeadIntent(null);
    clearLeadFields();
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    push("user", text);

    const t = normalize(text);
    if (t.includes("oferta") || t.includes("reserv") || t.includes("senal")) return startLead("oferta");
    if (t.includes("visita") || t.includes("ver inmueble") || t.includes("ensen")) return startLead("visita");
    if (t.includes("precio") || t.includes("gasto") || t.includes("condicion")) return answerPrice();
    if (t.includes("ubic") || t.includes("direccion") || t.includes("zona")) return answerLocation();
    if (t.includes("verific")) return answerVerification();
    if (t.includes("certific") || t.includes("premium")) return answerCertification();
    if (t.includes("propiet")) return ownerHelp();
    if (t.includes("arras") || t.includes("notar") || t.includes("estado")) return ownerStatus();
    if (t.includes("document") || t.includes("nota simple")) return ownerDocs();
    if (t.includes("resumen") || t.includes("caracteristica")) return describeListing();
    startLead("info");
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open ? (
        <div className="w-[390px] max-w-[calc(100vw-40px)] overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
          <div className="flex items-center justify-between gap-4 border-b border-[color:var(--border)] px-5 py-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">
                Asistente Verifika2
              </p>
              <p className="truncate text-xs text-slate-600">
                {persona === "comprador"
                  ? "Comprador / inquilino"
                  : "Propietario"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setPersona((p) => (p === "comprador" ? "propietario" : "comprador"))
                }
                className="inline-flex h-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-xs font-medium hover:bg-[color:var(--surface-2)]"
              >
                Cambiar
              </button>
              <button
                type="button"
                onClick={resetConversation}
                className="inline-flex h-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-xs font-medium hover:bg-[color:var(--surface-2)]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-sm font-semibold hover:bg-[color:var(--surface-2)]"
                aria-label="Cerrar chat"
              >
                x
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="max-h-[470px] overflow-auto px-5 py-4">
            {listing ? (
              <div className="mb-4 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3">
                <p className="truncate text-sm font-semibold">{listing.title}</p>
                <p className="pt-1 text-xs leading-5 text-slate-600">
                  {[listing.priceLabel, listing.city, listing.detailsShort]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            ) : null}

            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[86%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-[#0B1D33] text-white"
                        : "border border-[color:var(--border)] bg-[color:var(--surface-2)] text-slate-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <div className="flex flex-wrap gap-2">
                {persona === "comprador" ? (
                  <>
                    <Quick onClick={() => handleQuick("resumen")}>Resumen</Quick>
                    <Quick onClick={() => handleQuick("precio")}>Precio</Quick>
                    <Quick onClick={() => handleQuick("ubicacion")}>Ubicación</Quick>
                    <Quick onClick={() => handleQuick("verificacion")}>Verificación</Quick>
                    <Quick onClick={() => handleQuick("visita")}>Visita</Quick>
                    <Quick onClick={() => handleQuick("oferta")}>Oferta</Quick>
                    <Quick onClick={() => handleQuick("info")}>Info</Quick>
                    <Quick onClick={() => handleQuick("propietario")}>Soy propietario</Quick>
                  </>
                ) : (
                  <>
                    <Quick onClick={() => handleQuick("estado")}>Estado</Quick>
                    <Quick onClick={() => handleQuick("docs")}>Documentación</Quick>
                    <Quick onClick={() => handleQuick("info")}>Contacto</Quick>
                    <Quick onClick={() => handleQuick("verificacion")}>Verificación</Quick>
                  </>
                )}
              </div>
              <div className="pt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                <Link className="hover:text-[color:var(--foreground)]" href="/verificacion">
                  Verificación
                </Link>
                <Link className="hover:text-[color:var(--foreground)]" href="/certificacion">
                  Premium
                </Link>
                <Link className="hover:text-[color:var(--foreground)]" href="/propietarios">
                  Propietarios
                </Link>
              </div>
            </div>

            {leadIntent ? (
              <div className="pt-5">
                <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                  <p className="text-sm font-semibold tracking-tight">
                    {intentLabel(leadIntent)}
                  </p>
                  <div className="pt-3 grid gap-2">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="Nombre"
                        className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                      />
                      <select
                        value={leadUrgency}
                        onChange={(e) => setLeadUrgency(e.target.value)}
                        className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                      >
                        <option value="">Prioridad</option>
                        <option value="hoy">Hoy</option>
                        <option value="48h">Próximas 48h</option>
                        <option value="semana">Esta semana</option>
                      </select>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="Teléfono"
                        className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                      />
                      <input
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                      />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        value={leadSchedule}
                        onChange={(e) => setLeadSchedule(e.target.value)}
                        placeholder="Horario preferido"
                        className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                      />
                      <input
                        value={leadBudget}
                        onChange={(e) => setLeadBudget(e.target.value)}
                        placeholder={leadIntent === "oferta" ? "Importe oferta" : "Presupuesto"}
                        className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                      />
                    </div>
                    <textarea
                      value={leadNote}
                      onChange={(e) => setLeadNote(e.target.value)}
                      rows={3}
                      placeholder="Mensaje o condiciones"
                      className="w-full resize-y rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                    />
                    <button
                      type="button"
                      onClick={submitLead}
                      disabled={sendingLead}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742] disabled:opacity-60"
                    >
                      {sendingLead ? "Enviando..." : "Enviar solicitud"}
                    </button>
                    <p className="text-xs leading-5 text-slate-600">
                      La solicitud se registra con página, inmueble y contexto para priorizar la respuesta comercial.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-[color:var(--border)] px-5 py-4">
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Escribe aquí..."
                className="h-11 flex-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm outline-none focus:border-slate-400"
              />
              <button
                type="button"
                onClick={handleSend}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
              >
                Enviar
              </button>
            </div>
            <p className="pt-2 text-[11px] leading-4 text-slate-500">
              Asistente comercial guiado. No sustituye asesoramiento legal ni confirmación documental final.
            </p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0B1D33] px-5 text-sm font-semibold text-white shadow-[0_16px_48px_rgba(11,29,51,0.34)] hover:bg-[#0F2742]"
          aria-label="Abrir chat"
        >
          Chat
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </button>
      )}
    </div>
  );
}

function Quick({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-xs font-medium text-slate-700 hover:bg-[color:var(--surface-2)]"
    >
      {children}
    </button>
  );
}
