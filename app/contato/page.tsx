import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";
import WhatsAppLink from "@/components/WhatsAppLink";
import { getServicoBySlug } from "@/lib/servicos";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com um contador da Contábil Horizonte e peça um orçamento sem compromisso.",
};

async function ContatoFormulario(props: PageProps<"/contato">) {
  const searchParams = await props.searchParams;
  const servicoParam = typeof searchParams.servico === "string" ? searchParams.servico : undefined;
  const servicoInicial = servicoParam && getServicoBySlug(servicoParam) ? servicoParam : undefined;

  return <ContactForm servicoInicial={servicoInicial} />;
}

export default function ContatoPage(props: PageProps<"/contato">) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Fale com um contador</h1>
      <p className="mt-3 text-slate-600">
        Conte um pouco sobre o seu negócio e retornamos com um orçamento sem compromisso.
      </p>

      <div className="mt-8 rounded-lg border border-slate-200 p-6 shadow-sm">
        <Suspense fallback={<ContactForm />}>
          <ContatoFormulario {...props} />
        </Suspense>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        Prefere falar agora?{" "}
        <WhatsAppLink
          location="contato"
          label="Chame no WhatsApp"
          id="contato_whatsapp"
          className="font-semibold text-emerald-800 underline hover:text-emerald-900"
        />
      </p>
    </div>
  );
}
