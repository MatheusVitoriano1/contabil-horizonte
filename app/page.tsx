import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import { servicos } from "@/lib/servicos";

const DIFERENCIAIS = [
  {
    titulo: "Atendimento 100% online",
    descricao: "Fale com seu contador por WhatsApp, e-mail ou chamada, de qualquer lugar do Brasil.",
  },
  {
    titulo: "Sem contabilês",
    descricao: "Explicamos tudo em português claro, sem termos difíceis e sem letras pequenas.",
  },
  {
    titulo: "Prazos sob controle",
    descricao: "Você recebe aviso antes de cada vencimento: DAS, impostos, declarações e obrigações.",
  },
];

const DEPOIMENTOS = [
  {
    nome: "Camila R.",
    papel: "MEI, loja de roupas online",
    texto:
      "Finalmente entendi como funciona o DAS e nunca mais perdi um prazo. O atendimento é super rápido pelo WhatsApp.",
  },
  {
    nome: "Diego A.",
    papel: "Sócio de uma empresa do Simples Nacional",
    texto:
      "Migramos de outra contabilidade e a diferença foi grande: relatórios claros e sempre um contador disponível para explicar.",
  },
  {
    nome: "Fernanda L.",
    papel: "Profissional liberal (Imposto de Renda)",
    texto:
      "Minha declaração sempre foi uma dor de cabeça. Com a Horizonte, mandei os documentos e tudo foi revisado por um contador antes de enviar.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-emerald-900 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:gap-12 lg:py-24">
          <div className="flex-1">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Contabilidade descomplicada para quem empreende
            </h1>
            <p className="mt-4 max-w-xl text-base text-emerald-100 sm:text-lg">
              Cuidamos da contabilidade do seu MEI, da sua empresa do Simples Nacional ou da sua
              declaração de Imposto de Renda, com atendimento humano e 100% online para todo o
              Brasil.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaButton
                href="/contato"
                ctaId="hero_fale_contador"
                ctaLocation="hero"
                label="Fale com um contador"
              />
              <CtaButton
                href="/servicos"
                ctaId="hero_ver_servicos"
                ctaLocation="hero"
                label="Ver serviços"
                variant="outline"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Nossos serviços</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicos.map((servico) => (
            <Link
              key={servico.slug}
              href={`/servicos/${servico.slug}`}
              className="group flex flex-col rounded-lg border border-slate-200 p-6 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-900">
                {servico.nome}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{servico.paraQuem}</p>
              <p className="mt-3 text-sm text-slate-600">{servico.resumo}</p>
              <span className="mt-4 text-sm font-semibold text-emerald-800">Saiba mais →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Por que escolher a Contábil Horizonte
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {DIFERENCIAIS.map((item) => (
              <div key={item.titulo} className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">{item.titulo}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">O que nossos clientes dizem</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {DEPOIMENTOS.map((depoimento) => (
            <figure key={depoimento.nome} className="rounded-lg border border-slate-200 p-6">
              <blockquote className="text-sm text-slate-700">“{depoimento.texto}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-slate-900">
                {depoimento.nome}
                <span className="block text-xs font-normal text-slate-500">{depoimento.papel}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-amber-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Guia gratuito: documentos para o Imposto de Renda 2027
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Baixe nosso checklist completo e chegue na hora da declaração com tudo organizado.
            </p>
          </div>
          <CtaButton
            href="/imposto-de-renda"
            ctaId="faixa_ir_baixar_guia"
            ctaLocation="faixa_ir"
            label="Quero o guia gratuito"
          />
        </div>
      </section>

      <section className="bg-emerald-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Pronto para simplificar sua contabilidade?
          </h2>
          <p className="max-w-xl text-sm text-emerald-100">
            Fale agora com um contador e receba um orçamento sem compromisso.
          </p>
          <CtaButton
            href="/contato"
            ctaId="cta_final_fale_contador"
            ctaLocation="cta_final"
            label="Fale com um contador"
          />
        </div>
      </section>
    </>
  );
}
