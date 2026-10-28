import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CtaButton from "@/components/CtaButton";
import WhatsAppLink from "@/components/WhatsAppLink";
import { getServicoBySlug, servicos } from "@/lib/servicos";

export function generateStaticParams() {
  return servicos.map((servico) => ({ slug: servico.slug }));
}

export async function generateMetadata(props: PageProps<"/servicos/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const servico = getServicoBySlug(slug);

  if (!servico) {
    return { title: "Serviço não encontrado" };
  }

  return {
    title: servico.nome,
    description: servico.resumo,
  };
}

export default async function ServicoPage(props: PageProps<"/servicos/[slug]">) {
  const { slug } = await props.params;
  const servico = getServicoBySlug(slug);

  if (!servico) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
        {servico.paraQuem}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{servico.nome}</h1>
      <p className="mt-4 text-lg text-slate-600">{servico.resumo}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <CtaButton
          href="/contato"
          ctaId={`servico_${slug}_fale_contador`}
          ctaLocation="servico"
          label="Pedir orçamento"
        />
        <WhatsAppLink
          location="servico"
          label="Falar no WhatsApp"
          id={`servico_${slug}_whatsapp`}
          className="inline-flex items-center justify-center rounded-md border border-[#25D366] px-5 py-3 text-sm font-semibold text-[#128C7E] hover:bg-[#25D366]/10"
        />
      </div>

      <div className="mt-10 space-y-4 text-slate-700">
        {servico.descricao.map((paragrafo, index) => (
          <p key={index}>{paragrafo}</p>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">O que está incluído</h2>
        <ul className="mt-4 space-y-2">
          {servico.beneficios.map((beneficio) => (
            <li key={beneficio} className="flex items-start gap-2 text-slate-700">
              <span aria-hidden className="mt-1 text-emerald-700">
                ✓
              </span>
              {beneficio}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 rounded-lg bg-emerald-900 p-8 text-center">
        <p className="text-lg font-semibold text-white">
          Quer saber como contratar o serviço de {servico.nome.toLowerCase()}?
        </p>
        <div className="mt-4 flex justify-center">
          <CtaButton
            href="/contato"
            ctaId={`servico_${slug}_cta_final`}
            ctaLocation="servico"
            label="Fale com um contador"
          />
        </div>
      </div>
    </div>
  );
}
