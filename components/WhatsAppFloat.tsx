"use client";

import WhatsAppLink from "./WhatsAppLink";
import { useCookieConsent } from "./CookieConsentContext";

/** Botão flutuante de WhatsApp, visível em todas as páginas. */
export default function WhatsAppFloat() {
  const { isBannerVisible } = useCookieConsent();

  return (
    <WhatsAppLink
      location="flutuante"
      label="Falar no WhatsApp"
      id="whatsapp_flutuante"
      className={`fixed right-5 z-50 flex items-center gap-2 whitespace-nowrap rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${
        isBannerVisible ? "bottom-28 sm:bottom-24" : "bottom-5"
      }`}
    />
  );
}
