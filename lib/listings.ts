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
  published?: boolean;
  photo?: string | null;
  photos?: string[];
  agencyName?: string;
  agencyLogo?: string | null;
  address?: string;
  zone?: string;
  province?: string;
  lat?: number | null;
  lon?: number | null;
  seoSlug?: string;
  verificationChecks?: Array<{
    label: string;
    status: "ok" | "review";
  }>;
};
