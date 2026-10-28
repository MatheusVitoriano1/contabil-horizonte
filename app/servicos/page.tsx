import type { Metadata } from "next";
import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import { servicos } from "@/lib/servicos";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Conheça os serviços da Contábil Horizonte: abertura de empresa, contabilidade para MEI, Simples Nacional, Imposto de Renda e BPO financeiro.",
};

export default function ServicosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Nossos serviços</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Da abertura da empresa ao dia a dia financeiro, cuidamos da contabilidade para você focar
        no que importa: o seu negócio.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {servicos.map((servico) => (
          <div
            key={servico.slug}
            className="flex flex-col rounded-lg border border-slate-200 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900">{servico.nome}</h2>
            <p className="mt-1 text-sm text-slate-500">{servico.paraQuem}</p>
            <p className="mt-3 flex-1 text-sm text-slate-600">{servico.resumo}</p>
            <Link
              href={`/servicos/${servico.slug}`}
              className="mt-4 text-sm font-semibold text-emerald-800 hover:text-emerald-900"
            >
              Ver detalhes →
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <CtaButton
          href="/contato"
          ctaId="servicos_fale_contador"
          ctaLocation="cta_final"
          label="Fale com um contador"
        />
      </div>
    </div>
  );
}
