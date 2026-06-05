import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.verifika2.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Verifika2 — Portal inmobiliario verificado",
    template: "%s — Verifika2",
  },
  description:
    "Portal inmobiliario con anuncios verificados documentalmente, CRM inmobiliario, áreas privadas para comprador y propietario, y trazabilidad comercial.",
  applicationName: "Verifika2",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Verifika2",
    title: "Verifika2 — Portal inmobiliario verificado",
    description:
      "Anuncios verificados documentalmente, gestión desde CRM y seguimiento privado para compradores, propietarios e inmobiliarias.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
