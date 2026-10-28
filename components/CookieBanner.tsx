"use client";

import { useCookieConsent } from "./CookieConsentContext";

export default function CookieBanner() {
  const { isBannerVisible, acceptAll, rejectAll, openPreferences } = useCookieConsent();

  if (!isBannerVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      aria-describedby="cookie-banner-texto"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-200 bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] sm:p-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="cookie-banner-texto" className="text-sm text-slate-700">
          Usamos cookies para analisar o uso do site e melhorar sua experiência. Você pode
          aceitar todos, rejeitar ou personalizar suas preferências. Veja nossa{" "}
          <a href="/politica-de-privacidade" className="font-medium text-emerald-800 underline">
            política de privacidade
          </a>
          .
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            id="cookie_personalizar"
            data-cta="cookie_personalizar"
            onClick={openPreferences}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Personalizar
          </button>
          <button
            type="button"
            id="cookie_rejeitar"
            data-cta="cookie_rejeitar"
            onClick={rejectAll}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Rejeitar
          </button>
          <button
            type="button"
            id="cookie_aceitar_todos"
            data-cta="cookie_aceitar_todos"
            onClick={acceptAll}
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}
