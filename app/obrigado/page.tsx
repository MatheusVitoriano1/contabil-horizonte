import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import WhatsAppLink from "@/components/WhatsAppLink";
import { getServicoBySlug, slugParaSnakeCase } from "@/lib/servicos";

export const metadata: Metadata = {
  title: "Obrigado",
  description: "Recebemos sua solicitação de orçamento.",
};

async function ObrigadoConteudo(props: PageProps<"/obrigado">) {
  const searchParams = await props.searchParams;
  const servicoParam = typeof searchParams.servico === "string" ? searchParams.servico : undefined;
  const servico = servicoParam ? getServicoBySlug(servicoParam) : undefined;

  return (
    <>
      <p className="mt-4 text-slate-600">
        {servico
          ? `Em breve, um contador vai te chamar para falar sobre ${servico.nome.toLowerCase()}.`
          : "Em breve, um contador vai entrar em contato com você."}
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <WhatsAppLink
          location="obrigado"
          label="Falar agora no WhatsApp"
          id="obrigado_whatsapp"
          servico={servico ? slugParaSnakeCase(servico.slug) : undefined}
          className="inline-flex items-center justify-center rounded-md bg-[#25D366] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
        />
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Voltar para o início
        </Link>
      </div>
    </>
  );
}

export default function ObrigadoPage(props: PageProps<"/obrigado">) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
        Solicitação enviada
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
        Obrigado! Recebemos seu pedido.
      </h1>

      <Suspense
        fallback={<p className="mt-4 text-slate-600">Em breve, um contador vai entrar em contato com você.</p>}
      >
        <ObrigadoConteudo {...props} />
      </Suspense>
    </div>
  );
}
