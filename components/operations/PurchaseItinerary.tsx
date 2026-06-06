export type ItineraryStepStatus = "done" | "active" | "pending" | "blocked";

export type ItineraryStep = {
  key: string;
  title: string;
  desc: string;
  status: ItineraryStepStatus;
  detail?: string;
};

const statusClass: Record<ItineraryStepStatus, string> = {
  done: "border-emerald-200 bg-emerald-50 text-emerald-900",
  active: "border-[#0B1D33] bg-[#0B1D33] text-white",
  pending: "border-[color:var(--border)] bg-[color:var(--surface-2)] text-slate-600",
  blocked: "border-amber-200 bg-amber-50 text-amber-900",
};

const dotClass: Record<ItineraryStepStatus, string> = {
  done: "bg-emerald-500",
  active: "bg-[#F2C14E]",
  pending: "bg-slate-300",
  blocked: "bg-amber-500",
};

function statusLabel(status: ItineraryStepStatus) {
  if (status === "done") return "Completado";
  if (status === "active") return "En curso";
  if (status === "blocked") return "Revisar";
  return "Pendiente";
}

export function progressFromSteps(steps: ItineraryStep[]) {
  if (!steps.length) return 0;
  const done = steps.filter((step) => step.status === "done").length;
  const active = steps.some((step) => step.status === "active") ? 0.5 : 0;
  return Math.min(100, Math.round(((done + active) / steps.length) * 100));
}

export default function PurchaseItinerary({
  title = "Itinerario de compraventa",
  subtitle = "Seguimiento desde interés hasta firma y entrega.",
  steps,
  nextAction,
  compact = false,
}: {
  title?: string;
  subtitle?: string;
  steps: ItineraryStep[];
  nextAction?: string;
  compact?: boolean;
}) {
  const progress = progressFromSteps(steps);
  const activeStep = steps.find((step) => step.status === "active") ?? steps.find((step) => step.status === "blocked") ?? steps.find((step) => step.status === "pending");

  return (
    <section className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {title}
          </p>
          <h3 className="pt-2 text-lg font-semibold tracking-tight">
            {activeStep ? activeStep.title : "Operación pendiente"}
          </h3>
          <p className="pt-2 max-w-2xl text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>
        <div className="min-w-[120px] rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-right">
          <p className="text-xs font-medium text-slate-600">Progreso</p>
          <p className="pt-1 text-2xl font-semibold tracking-tight">{progress}%</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[#0B1D33]" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <MiniMetric label="Fase actual" value={activeStep?.title ?? "Pendiente"} />
          <MiniMetric label="Estado" value={activeStep ? statusLabel(activeStep.status) : "Pendiente"} />
          <MiniMetric label="Siguiente paso" value={nextAction || activeStep?.detail || "Actualizar expediente"} />
        </div>
      </div>

      <div className={`mt-5 grid gap-3 ${compact ? "sm:grid-cols-3" : "md:grid-cols-3"}`}>
        {steps.map((step, index) => (
          <div key={step.key} className={`rounded-3xl border p-4 ${statusClass[step.status]}`}>
            <div className="flex items-start gap-3">
              <span className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold text-white ${dotClass[step.status]}`}>
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold tracking-tight">{step.title}</p>
                <p className={`pt-1 text-xs leading-5 ${step.status === "active" ? "text-white/72" : "text-current opacity-72"}`}>
                  {step.desc}
                </p>
                {step.detail ? (
                  <p className={`pt-2 text-xs font-medium ${step.status === "active" ? "text-white" : "text-current"}`}>
                    {step.detail}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
      <p className="text-xs font-medium text-slate-600">{label}</p>
      <p className="pt-1 text-sm font-semibold leading-5 text-[color:var(--foreground)]">{value}</p>
    </div>
  );
}
