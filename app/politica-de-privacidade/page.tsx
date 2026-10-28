import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de privacidade e cookies da Contábil Horizonte.",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Política de privacidade e cookies</h1>
      <p className="mt-2 text-sm text-slate-500">
        Última atualização: outubro de 2026. Este site é um projeto fictício criado para fins de
        estudo e portfólio; nenhum dado enviado aqui é usado para fins comerciais reais.
      </p>

      <div className="mt-8 space-y-8 text-slate-700">
        <section>
          <h2 className="text-xl font-semibold text-slate-900">1. Quais dados coletamos</h2>
          <p className="mt-2">
            Coletamos os dados que você nos envia voluntariamente pelos formulários do site (nome,
            e-mail, telefone e, quando aplicável, informações sobre a sua empresa), além de dados
            de navegação coletados por cookies, conforme detalhado abaixo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">2. Como usamos seus dados</h2>
          <p className="mt-2">
            Usamos os dados dos formulários apenas para responder à sua solicitação de orçamento
            ou enviar o material que você pediu. Não vendemos nem compartilhamos seus dados
            pessoais com terceiros para fins de marketing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">3. Cookies</h2>
          <p className="mt-2">
            Usamos cookies essenciais (necessários para o funcionamento do site), cookies de
            análise (para entender como o site é usado, via Google Analytics) e cookies de
            marketing (para personalização de anúncios). Você pode gerenciar suas preferências a
            qualquer momento pelo link “Preferências de cookies” no rodapé do site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">4. Seus direitos</h2>
          <p className="mt-2">
            Você pode solicitar a qualquer momento a exclusão, correção ou exportação dos seus
            dados, entrando em contato pelo e-mail contato@contabilhorizonte.exemplo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">5. Contato</h2>
          <p className="mt-2">
            Em caso de dúvidas sobre esta política, entre em contato pelo e-mail
            contato@contabilhorizonte.exemplo.
          </p>
        </section>
      </div>
    </div>
  );
}
