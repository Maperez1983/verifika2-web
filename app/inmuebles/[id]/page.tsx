import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Listing = {
  id: string;
  title: string;
  location: string;
  price: string;
  details: string[];
  verified: boolean;
  description: string;
};

const mockListings: Record<string, Listing> = {
  "piso-centro-112m2": {
    id: "piso-centro-112m2",
    title: "Piso en el centro (112 m²)",
    location: "Madrid",
    price: "285.000 €",
    verified: true,
    details: ["3 habitaciones", "2 baños", "112 m²", "Terraza", "Garaje"],
    description:
      "Vivienda luminosa a pocos minutos de todo. Ejemplo de ficha pública con sello de verificación.",
  },
  "atico-luminoso-78m2": {
    id: "atico-luminoso-78m2",
    title: "Ático luminoso (78 m²)",
    location: "Valencia",
    price: "1.250 €/mes",
    verified: true,
    details: ["2 habitaciones", "1 baño", "78 m²", "Ascensor", "Balcón"],
    description:
      "Ático listo para entrar a vivir. Ejemplo de ficha de alquiler con documentación verificada.",
  },
  "chalet-familiar-210m2": {
    id: "chalet-familiar-210m2",
    title: "Chalet familiar (210 m²)",
    location: "Sevilla",
    price: "425.000 €",
    verified: false,
    details: ["4 habitaciones", "3 baños", "210 m²", "Jardín", "Piscina"],
    description:
      "Chalet amplio y cómodo. Ejemplo de ficha con verificación en revisión.",
  },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = mockListings[id];
  if (!listing) return { title: "Inmueble" };
  return {
    title: listing.title,
    description: `${listing.location} · ${listing.price} · ${
      listing.verified ? "Verificado" : "En revisión"
    }`,
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = mockListings[id];
  if (!listing) notFound();

  return (
    <div className="flex flex-1 flex-col bg-white text-zinc-950">
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex w-full max-w-6xl items-start justify-between gap-6 px-6 py-6">
          <div className="flex flex-col gap-2">
            <Link
              href="/inmuebles"
              className="w-fit text-sm font-medium text-zinc-600 hover:text-zinc-950"
            >
              ← Volver a inmuebles
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              {listing.title}
            </h1>
            <p className="text-sm text-zinc-600">{listing.location}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                listing.verified
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-amber-50 text-amber-800"
              }`}
            >
              {listing.verified ? "Verificado" : "En revisión"}
            </span>
            <a
              href="https://app.verifika2.com"
              className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Acceso
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <section className="md:col-span-2">
            <div className="rounded-3xl border border-zinc-200 p-6">
              <p className="text-3xl font-semibold tracking-tight">
                {listing.price}
              </p>
              <p className="pt-4 text-sm leading-6 text-zinc-700">
                {listing.description}
              </p>
              <div className="pt-6 grid gap-2 sm:grid-cols-2">
                {listing.details.map((detail) => (
                  <div
                    key={detail}
                    className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-800"
                  >
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="md:col-span-1">
            <div className="rounded-3xl border border-zinc-200 p-6">
              <p className="text-sm font-semibold">Sello Verifika2</p>
              <p className="pt-2 text-sm leading-6 text-zinc-600">
                Aquí mostraremos el estado de verificación por documento y la
                trazabilidad del anuncio.
              </p>
              <ul className="pt-4 space-y-2 text-sm text-zinc-700">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Titularidad / nota simple
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Certificado energético
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Datos básicos verificados
                </li>
              </ul>
              <div className="pt-6">
                <a
                  href="https://crm.verifika2.com"
                  className="inline-flex h-11 w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  Gestionar en el CRM
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

