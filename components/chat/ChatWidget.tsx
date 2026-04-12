"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type ChatRole = "bot" | "user";

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
};

type Props = {
  listing?: ChatListingContext;
  defaultPersona?: "comprador" | "propietario";
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
  persona: "comprador" | "propietario" | null;
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
        ? (parsed.persona as "comprador" | "propietario")
        : null;
    return { messages: storedMessages, persona: storedPersona };
  } catch {
    return null;
  }
}

export default function ChatWidget({ listing, defaultPersona, scope }: Props) {
  const storageScope = scope?.trim() ? scope.trim() : "portal";
  const storageKey = useMemo(
    () => `v2_portal_chat:${storageScope}:${listing?.id || "global"}`,
    [listing?.id, storageScope],
  );

  const defaultMessages = useMemo<ChatMessage[]>(
    () => [
      {
        id: uid(),
        role: "bot",
        text: listing
          ? `Hola. Soy el asistente de Verifika2 para “${listing.title}”. ¿Qué necesitas?`
          : "Hola. Soy el asistente de Verifika2. ¿Qué necesitas?",
      },
    ],
    [listing],
  );

  const initialStored = useMemo(() => readStored(storageKey), [storageKey]);

  const [open, setOpen] = useState(false);
  const [persona, setPersona] = useState<"comprador" | "propietario">(
    initialStored?.persona ?? defaultPersona ?? "comprador",
  );
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialStored?.messages ?? defaultMessages,
  );
  const [draft, setDraft] = useState("");
  const [showLeadForm, setShowLeadForm] = useState<null | "info" | "visita">(
    null,
  );
  const [leadName, setLeadName] = useState("");
  const [leadContact, setLeadContact] = useState("");
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
  }, [open, messages.length]);

  const push = (role: ChatRole, text: string) => {
    setMessages((prev) => [...prev, { id: uid(), role, text }]);
  };

  const answerVerification = () => {
    const base =
      "En Verifika2, “verificado” significa que el anuncio tiene evidencias y trazabilidad (no es un claim).";
    if (!listing) {
      push("bot", `${base} Mira la explicación completa en “Verificación”.`);
      return;
    }
    push(
      "bot",
      `${base} Este inmueble está verificado (última revisión: ${listing.verifiedAt}).`,
    );
  };

  const answerCertification = () => {
    if (!listing) {
      push(
        "bot",
        "La “certificación” es un servicio premium emitido por Verifika2 tras analizar documentación (alcance y límites definidos).",
      );
      return;
    }
    if (listing.certified) {
      push(
        "bot",
        "Este inmueble está *certificado* (premium). En la ficha podrás ver el sello y el alcance cuando lo habilitemos.",
      );
      return;
    }
    push(
      "bot",
      "Este inmueble está verificado. Si quieres un nivel extra, puedes solicitar certificación premium (idoneidad) emitida por Verifika2.",
    );
  };

  const startInfo = () => {
    setShowLeadForm("info");
    push(
      "bot",
      "Perfecto. Dime qué información necesitas y déjame un contacto (email o teléfono).",
    );
  };

  const startVisit = () => {
    setShowLeadForm("visita");
    push(
      "bot",
      "Perfecto. ¿Qué día/hora te encaja para una visita? Déjame un contacto (email o teléfono).",
    );
  };

  const ownerHelp = () => {
    setPersona("propietario");
    setShowLeadForm(null);
    push(
      "bot",
      "Si eres propietario, puedes seguir el estado de la operación y la documentación desde tu área privada. Necesitarás acceso habilitado por tu inmobiliaria.",
    );
  };

  const ownerStatus = () => {
    setPersona("propietario");
    push(
      "bot",
      "En tu portal de propietario verás el estado, hitos (reserva/arras/notaría…) y qué documentación falta. Si no tienes acceso aún, pídeselo a tu inmobiliaria.",
    );
  };

  const ownerDocs = () => {
    setPersona("propietario");
    push(
      "bot",
      "Puedes subir documentación desde tu área privada (según lo que te solicite tu inmobiliaria). Queda registrada y en revisión, con trazabilidad.",
    );
  };

  const handleQuick = (key: string) => {
    setShowLeadForm(null);
    if (key === "verificacion") {
      push("user", "¿Está verificado? ¿Qué significa?");
      answerVerification();
      return;
    }
    if (key === "certificacion") {
      push("user", "¿Qué es la certificación premium?");
      answerCertification();
      return;
    }
    if (key === "visita") {
      push("user", "Quiero pedir visita");
      startVisit();
      return;
    }
    if (key === "info") {
      push("user", "Quiero más información");
      startInfo();
      return;
    }
    if (key === "propietario") {
      push("user", "Soy propietario");
      ownerHelp();
      return;
    }
    if (key === "estado") {
      push("user", "Quiero ver el estado de mi operación");
      ownerStatus();
      return;
    }
    if (key === "docs") {
      push("user", "Quiero subir documentación");
      ownerDocs();
      return;
    }
  };

  const submitLead = async () => {
    if (sendingLead) return;
    const type = showLeadForm || "contacto";
    const safeName = leadName.trim();
    const safeContact = leadContact.trim();
    const safeNote = leadNote.trim();
    if (!safeContact) {
      push("bot", "Necesito al menos un contacto (email o teléfono).");
      return;
    }

    setSendingLead(true);
    const source =
      typeof window === "undefined"
        ? undefined
        : { path: window.location.pathname, href: window.location.href };
    const payload = {
      persona,
      intent: type,
      name: safeName || undefined,
      contact: safeContact,
      note: safeNote || undefined,
      listing,
      source,
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        push(
          "bot",
          "Ahora mismo no he podido registrar la solicitud. Inténtalo de nuevo en unos minutos.",
        );
        return;
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
      `${type === "visita" ? "Solicitud de visita" : "Solicitud de info"} · ${safeName || "Sin nombre"} · ${safeContact}`,
    );
    if (safeNote) push("user", safeNote);
    push(
      "bot",
      "Listo. Hemos registrado tu interés. Te contactarán lo antes posible.",
    );
    setShowLeadForm(null);
    setLeadName("");
    setLeadContact("");
    setLeadNote("");
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    push("user", text);

    const t = normalize(text);
    if (t.includes("verific")) {
      answerVerification();
      return;
    }
    if (t.includes("certific") || t.includes("premium")) {
      answerCertification();
      return;
    }
    if (t.includes("visita") || t.includes("ver")) {
      startVisit();
      return;
    }
    if (t.includes("propiet")) {
      ownerHelp();
      return;
    }
    if (t.includes("arras") || t.includes("notar") || t.includes("estado")) {
      ownerStatus();
      return;
    }
    if (t.includes("document") || t.includes("nota simple")) {
      ownerDocs();
      return;
    }
    push(
      "bot",
      "Te ayudo. Elige una opción rápida (verificación, visita, info) o dime qué necesitas y lo registramos.",
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open ? (
        <div className="w-[360px] max-w-[calc(100vw-40px)] overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
          <div className="flex items-center justify-between gap-4 border-b border-[color:var(--border)] px-5 py-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">
                Asistente Verifika2
              </p>
              <p className="truncate text-xs text-slate-600">
                {persona === "comprador"
                  ? "Comprador / inquilino"
                  : "Propietario (área privada)"}
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
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-sm font-semibold hover:bg-[color:var(--surface-2)]"
                aria-label="Cerrar chat"
              >
                ×
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="max-h-[360px] overflow-auto px-5 py-4"
          >
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
                    <Quick onClick={() => handleQuick("verificacion")}>
                      Verificación
                    </Quick>
                    <Quick onClick={() => handleQuick("visita")}>Visita</Quick>
                    <Quick onClick={() => handleQuick("info")}>Info</Quick>
                    <Quick onClick={() => handleQuick("certificacion")}>
                      Premium
                    </Quick>
                    <Quick onClick={() => handleQuick("propietario")}>
                      Soy propietario
                    </Quick>
                  </>
                ) : (
                  <>
                    <Quick onClick={() => handleQuick("estado")}>Estado</Quick>
                    <Quick onClick={() => handleQuick("docs")}>
                      Documentación
                    </Quick>
                    <Quick onClick={() => handleQuick("info")}>Contacto</Quick>
                    <Quick onClick={() => handleQuick("verificacion")}>
                      Verificación
                    </Quick>
                  </>
                )}
              </div>
              <div className="pt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                <Link className="hover:text-[color:var(--foreground)]" href="/verificacion">
                  Qué significa “verificado”
                </Link>
                <Link className="hover:text-[color:var(--foreground)]" href="/certificacion">
                  Certificación premium
                </Link>
                <Link className="hover:text-[color:var(--foreground)]" href="/propietarios">
                  Portal propietario
                </Link>
              </div>
            </div>

            {showLeadForm ? (
              <div className="pt-5">
                <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                  <p className="text-sm font-semibold tracking-tight">
                    {showLeadForm === "visita"
                      ? "Pedir visita"
                      : "Solicitar información"}
                  </p>
                  <div className="pt-3 grid gap-2">
                    <input
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Nombre (opcional)"
                      className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                    />
                    <input
                      value={leadContact}
                      onChange={(e) => setLeadContact(e.target.value)}
                      placeholder="Email o teléfono"
                      className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                    />
                    <textarea
                      value={leadNote}
                      onChange={(e) => setLeadNote(e.target.value)}
                      rows={3}
                      placeholder={
                        showLeadForm === "visita"
                          ? "Disponibilidad (día/hora) + comentarios"
                          : "Tu pregunta (opcional)"
                      }
                      className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                    />
                    <button
                      type="button"
                      onClick={submitLead}
                      disabled={sendingLead}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                    >
                      {sendingLead ? "Enviando…" : "Enviar"}
                    </button>
                    <p className="text-xs leading-5 text-slate-600">
                      Esto registra tu solicitud. En la siguiente fase, se
                      conectará con trazabilidad completa en el CRM.
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
                placeholder="Escribe aquí…"
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
              El asistente responde con información del anuncio y de Verifika2.
              No sustituye asesoramiento legal.
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
  children: React.ReactNode;
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
