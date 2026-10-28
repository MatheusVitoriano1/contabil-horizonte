/**
 * Carrega, nesta ordem, logo no início do <body>:
 * 1. Consent Mode v2 com os defaults (tudo negado, exceto o funcional/segurança)
 *    e, se já houver escolha salva, o update correspondente.
 * 2. O snippet do GTM: inicializa o dataLayer/gtag e injeta o gtm.js do
 *    container via JavaScript (sem `<script src>` declarativo no JSX).
 *
 * As duas tags são `<script>` inline nativas (Server Component), para
 * aparecerem como texto literal no HTML, na ordem exata em que estão aqui.
 * Um `<script src="...gtm.js">` declarativo foi evitado de propósito: o
 * React/Next promove (hoisting) tags `<script src>` para o `<head>` de forma
 * assíncrona e desacoplada da posição no JSX, o que já quebrou a garantia de
 * que o Consent Mode roda antes do GTM. Carregando o gtm.js via
 * `document.createElement` dentro do próprio script inline, a ordem de
 * execução passa a ser a ordem real do documento, sem hoisting.
 *
 * O <noscript> com o iframe (fallback sem JS) fica logo em seguida, ainda no
 * início do <body>.
 *
 * Nada aqui é configurado dentro do GTM/GA4: isso fica para o dono do projeto.
 */
export default function GtmScript() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  const consentDefaultScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      wait_for_update: 500
    });
    (function () {
      try {
        var saved = localStorage.getItem('cookie_consent');
        if (!saved) return;
        var choice = JSON.parse(saved);
        if (!choice || !choice.analytics || !choice.marketing) return;
        gtag('consent', 'update', {
          ad_storage: choice.marketing,
          ad_user_data: choice.marketing,
          ad_personalization: choice.marketing,
          analytics_storage: choice.analytics
        });
      } catch (e) {}
    })();
  `;

  const gtmScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    (function () {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtm.js?id=${gtmId}';
      document.head.appendChild(s);
    })();
  `;

  return (
    <>
      <script id="consent-default" dangerouslySetInnerHTML={{ __html: consentDefaultScript }} />
      <script id="gtm-script" dangerouslySetInnerHTML={{ __html: gtmScript }} />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="gtm-noscript"
        />
      </noscript>
    </>
  );
}
