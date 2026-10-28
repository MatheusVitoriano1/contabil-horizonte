import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GtmScript from "@/components/GtmScript";
import RouteChangeTracker from "@/components/RouteChangeTracker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CookieBanner from "@/components/CookieBanner";
import CookiePreferences from "@/components/CookiePreferences";
import { CookieConsentProvider } from "@/components/CookieConsentContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Contábil Horizonte | Contabilidade descomplicada para quem empreende",
    template: "%s | Contábil Horizonte",
  },
  description:
    "Contabilidade online para MEIs, pequenas empresas do Simples Nacional, profissionais liberais e Imposto de Renda pessoa física. Atendimento 100% online para todo o Brasil.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <GtmScript />
        <RouteChangeTracker />
        <CookieConsentProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <CookieBanner />
          <CookiePreferences />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
