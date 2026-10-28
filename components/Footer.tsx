"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { servicos } from "@/lib/servicos";
import { useCookieConsent } from "./CookieConsentContext";

const FALLBACK_YEAR = 2026;

export default function Footer() {
  const { openPreferences } = useCookieConsent();
  const [year, setYear] = useState(FALLBACK_YEAR);

  useEffect(() => {
    // `new Date()` não pode ser lido durante o pré-render estático (Cache Components);
    // por isso o ano real só é calculado no cliente, após a montagem.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-white">Contábil Horizonte</p>
          <p className="mt-2 text-sm">Contabilidade descomplicada para quem empreende.</p>
          <p className="mt-4 text-sm">São Paulo – SP · atendimento 100% online para todo o Brasil</p>
          <p className="mt-1 text-sm">contato@contabilhorizonte.exemplo</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Serviços</p>
          <ul className="mt-3 space-y-2 text-sm">
            {servicos.map((servico) => (
              <li key={servico.slug}>
                <Link href={`/servicos/${servico.slug}`} className="hover:text-white">
                  {servico.nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Institucional</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/imposto-de-renda" className="hover:text-white">
                Guia do Imposto de Renda
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-white">
                Fale com um contador
              </Link>
            </li>
            <li>
              <Link href="/politica-de-privacidade" className="hover:text-white">
                Política de privacidade
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Privacidade</p>
          <button
            type="button"
            id="footer_preferencias_cookies"
            data-cta="footer_preferencias_cookies"
            onClick={openPreferences}
            className="mt-3 text-sm underline hover:text-white"
          >
            Preferências de cookies
          </button>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-500 sm:px-6">
        © {year} Contábil Horizonte. Empresa fictícia criada para fins de
        estudo e portfólio.
      </div>
    </footer>
  );
}
