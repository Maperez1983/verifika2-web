export type Listing = {
  id: string;
  title: string;
  city: string;
  operation: "venta" | "alquiler";
  propertyType: "piso" | "casa" | "ático" | "local";
  priceLabel: string;
  priceValue: number;
  detailsShort: string;
  details: string[];
  description: string;
  verifiedAt: string;
  certified: boolean;
};

export const mockListings: Listing[] = [
  {
    id: "piso-centro-112m2",
    title: "Piso en el centro (112 m²)",
    city: "Madrid",
    operation: "venta",
    propertyType: "piso",
    priceLabel: "285.000 €",
    priceValue: 285000,
    detailsShort: "3 hab · 2 baños · Terraza · Garaje",
    details: ["3 habitaciones", "2 baños", "112 m²", "Terraza", "Garaje"],
    description:
      "Vivienda luminosa a pocos minutos de todo. Publicación con evidencias y trazabilidad.",
    verifiedAt: "2026-04-08",
    certified: true,
  },
  {
    id: "atico-luminoso-78m2",
    title: "Ático luminoso (78 m²)",
    city: "Valencia",
    operation: "alquiler",
    propertyType: "ático",
    priceLabel: "1.250 €/mes",
    priceValue: 1250,
    detailsShort: "2 hab · 1 baño · Ascensor · Balcón",
    details: ["2 habitaciones", "1 baño", "78 m²", "Ascensor", "Balcón"],
    description:
      "Ático listo para entrar a vivir. Operación clara con documentación revisada.",
    verifiedAt: "2026-04-10",
    certified: false,
  },
  {
    id: "casa-jardin-190m2",
    title: "Casa con jardín (190 m²)",
    city: "Sevilla",
    operation: "venta",
    propertyType: "casa",
    priceLabel: "425.000 €",
    priceValue: 425000,
    detailsShort: "4 hab · 3 baños · Jardín · Piscina",
    details: ["4 habitaciones", "3 baños", "190 m²", "Jardín", "Piscina"],
    description:
      "Casa amplia y cómoda. Ejemplo de publicación certificada para máxima confianza.",
    verifiedAt: "2026-04-06",
    certified: true,
  },
  {
    id: "piso-obra-nueva-95m2",
    title: "Piso obra nueva (95 m²)",
    city: "Málaga",
    operation: "venta",
    propertyType: "piso",
    priceLabel: "315.000 €",
    priceValue: 315000,
    detailsShort: "3 hab · 2 baños · Garaje · Trastero",
    details: ["3 habitaciones", "2 baños", "95 m²", "Garaje", "Trastero"],
    description:
      "Obra nueva con alta demanda. Publicación verificada con estado documental visible.",
    verifiedAt: "2026-04-07",
    certified: false,
  },
  {
    id: "local-comercial-140m2",
    title: "Local comercial (140 m²)",
    city: "Barcelona",
    operation: "alquiler",
    propertyType: "local",
    priceLabel: "2.100 €/mes",
    priceValue: 2100,
    detailsShort: "Escaparate · Zona tránsito · Buena visibilidad",
    details: ["140 m²", "Escaparate", "Zona tránsito", "Buena visibilidad"],
    description:
      "Local en zona de paso. Información estructurada y evidencias para reducir sorpresas.",
    verifiedAt: "2026-04-09",
    certified: false,
  },
  {
    id: "atico-terraza-120m2",
    title: "Ático con terraza (120 m²)",
    city: "Bilbao",
    operation: "venta",
    propertyType: "ático",
    priceLabel: "540.000 €",
    priceValue: 540000,
    detailsShort: "3 hab · 2 baños · Terraza · Vistas",
    details: ["3 habitaciones", "2 baños", "120 m²", "Terraza", "Vistas"],
    description:
      "Ático con terraza y luz. Publicación certificada para compradores exigentes.",
    verifiedAt: "2026-04-05",
    certified: true,
  },
];

export const mockListingsById = Object.fromEntries(
  mockListings.map((listing) => [listing.id, listing]),
) as Record<string, Listing>;

