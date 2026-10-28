"use client";

import { useState } from "react";
import { useCookieConsent } from "./CookieConsentContext";
import type { ConsentStatus } from "@/lib/consent";

export default function CookiePreferences() {
  const { isModalOpen, closePreferences, consent, savePreferences, acceptAll } =
    useCookieConsent();

  const [analytics, setAnalytics] = useState<ConsentStatus>("denied");
  const [marketing, setMarketing] = useState<ConsentStatus>("denied");

  // Ajusta o estado local durante a renderização (em vez de um efeito) sempre que
  // o modal é reaberto, para refletir a última escolha salva de consentimento.
  const [wasOpen, setWasOpen] = useState(false);
  if (isModalOpen && !wasOpen) {
    setWasOpen(true);
    setAnalytics(consent?.analytics ?? "denied");
    setMarketing(consent?.marketing ?? "denied");
  } else if (!isModalOpen && wasOpen) {
    setWasOpen(false);
  }

  if (!isModalOpen) return null;

  function handleSave() {
    savePreferences({ analytics, marketing });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-titulo"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 id="cookie-modal-titulo" className="text-lg font-bold text-slate-900">
          Preferências de cookies
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Escolha quais categorias de cookies você permite. Cookies essenciais sempre ficam
          ativos para o site funcionar.
        </p>

        <div className="mt-5 space-y-4">
          <label className="flex items-start justify-between gap-4 rounded-md border border-slate-200 p-3">
            <span>
              <span className="block text-sm font-semibold text-slate-800">Análise</span>
              <span className="block text-xs text-slate-500">
                Ajuda a entender como você usa o site (Google Analytics).
              </span>
            </span>
            <input
              type="checkbox"
              id="cookie_pref_analytics"
              checked={analytics === "granted"}
              onChange={(e) => setAnalytics(e.target.checked ? "granted" : "denied")}
              className="mt-1 h-5 w-5 accent-emerald-700"
            />
          </label>

          <label className="flex items-start justify-between gap-4 rounded-md border border-slate-200 p-3">
            <span>
              <span className="block text-sm font-semibold text-slate-800">Marketing</span>
              <span className="block text-xs text-slate-500">
                Usado para anúncios e personalização.
              </span>
            </span>
            <input
              type="checkbox"
              id="cookie_pref_marketing"
              checked={marketing === "granted"}
              onChange={(e) => setMarketing(e.target.checked ? "granted" : "denied")}
              className="mt-1 h-5 w-5 accent-emerald-700"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            id="cookie_modal_fechar"
            data-cta="cookie_modal_fechar"
            onClick={closePreferences}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            id="cookie_modal_aceitar_todos"
            data-cta="cookie_modal_aceitar_todos"
            onClick={acceptAll}
            className="rounded-md border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
          >
            Aceitar todos
          </button>
          <button
            type="button"
            id="cookie_modal_salvar"
            data-cta="cookie_modal_salvar"
            onClick={handleSave}
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Salvar preferências
          </button>
        </div>
      </div>
    </div>
  );
}
