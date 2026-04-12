import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inmuebles",
  description:
    "Explora inmuebles publicados en Verifika2. Próximamente con filtros, mapa y sello de verificación por anuncio.",
};

type Listing = {
  id: string;
  title: string;
  location: string;
  price: string;
  details: string;
  verified: boolean;
};

const mockListings: Listing[] = [
  {
    id: "piso-centro-112m2",
    title: "Piso en el centro (112 m²)",
    location: "Madrid",
    price: "285.000 €",
    details: "3 hab · 2 baños · Terraza · Garaje",
    verified: true,
  },
  {
    id: "atico-luminoso-78m2",
    title: "Ático luminoso (78 m²)",
    location: "Valencia",
    price: "1.250 €/mes",
    details: "2 hab · 1 baño · Ascensor · Balcón",
    verified: true,
  },
  {
    id: "chalet-familiar-210m2",
    title: "Chalet familiar (210 m²)",
    location: "Sevilla",
    price: "425.000 €",
    details: "4 hab · 3 baños · Jardín · Piscina",
    verified: false,
  },
];

export default function ListingsPage() {
  return (
    <div className="flex flex-1 flex-col bg-white text-zinc-950">
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Inmuebles</h1>
            <p className="pt-1 text-sm text-zinc-600">
              Demo de portal. En la siguiente fase conectamos con la API pública
              de inmuebles publicados del CRM.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Volver
            </Link>
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
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-200 p-5 md:col-span-1">
            <p className="text-sm font-semibold">Filtros (próximamente)</p>
            <div className="pt-4 space-y-3 text-sm text-zinc-700">
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="font-medium">Tipo</p>
                <p className="pt-1 text-zinc-600">Piso · Casa · Local</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="font-medium">Operación</p>
                <p className="pt-1 text-zinc-600">Venta · Alquiler</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="font-medium">Verificación</p>
                <p className="pt-1 text-zinc-600">Con sello · En revisión</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {mockListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/inmuebles/${listing.id}`}
                  className="group rounded-3xl border border-zinc-200 p-5 hover:border-zinc-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold tracking-tight">
                      {listing.title}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                        listing.verified
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {listing.verified ? "Verificado" : "En revisión"}
                    </span>
                  </div>
                  <p className="pt-2 text-sm text-zinc-600">
                    {listing.location}
                  </p>
                  <p className="pt-3 text-xl font-semibold tracking-tight">
                    {listing.price}
                  </p>
                  <p className="pt-2 text-sm text-zinc-600">
                    {listing.details}
                  </p>
                  <p className="pt-4 text-sm font-medium text-zinc-900 group-hover:underline">
                    Ver ficha
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

