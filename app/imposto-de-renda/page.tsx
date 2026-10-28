import type { Metadata } from "next";
import GuiaIrForm from "@/components/GuiaIrForm";
import ScrollDepthTracker from "@/components/ScrollDepthTracker";

export const metadata: Metadata = {
  title: "Guia do Imposto de Renda 2027",
  description:
    "Baixe gratuitamente o checklist de documentos necessários para a Declaração de Imposto de Renda 2027.",
};

const CHECKLIST = [
  "Documentos pessoais e de dependentes",
  "Informes de rendimentos (empregador, bancos, corretoras, INSS)",
  "Despesas médicas e de educação",
  "Previdência privada",
  "Bens e direitos (imóveis, veículos)",
  "Dívidas e ônus",
  "Aluguéis recebidos e pagos",
  "Recibo da declaração do ano anterior",
];

export default function ImpostoDeRendaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <ScrollDepthTracker />

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Material gratuito
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Documentos necessários para o Imposto de Renda 2027
          </h1>
          <p className="mt-4 text-slate-600">
            Preencha o formulário e receba acesso imediato ao checklist completo, com tudo que
            você precisa separar antes de declarar.
          </p>

          <ul className="mt-6 space-y-2">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                <span aria-hidden className="mt-0.5 text-emerald-700">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs text-slate-400">
            Conteúdo ilustrativo, elaborado para fins de estudo. Não substitui orientação de um
            contador para o seu caso específico.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Quero receber o guia em PDF
          </h2>
          <div className="mt-4">
            <GuiaIrForm />
          </div>
        </div>
      </div>
    </div>
  );
}
