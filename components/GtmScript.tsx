import Script from "next/script";

/**
 * Carrega, nesta ordem, dentro do <head> (o Next injeta scripts
 * beforeInteractive no head independente de onde o componente é renderizado):
 * 1. Consent Mode v2 com os defaults (tudo negado, exceto o funcional/segurança)
 *    e, se já houver escolha salva, o update correspondente.
 * 2. O snippet do GTM.
 * O <noscript> com o iframe fica logo após a abertura do <body>.
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
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', '${gtmId}');
  `;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- padrão oficial do App Router para o root layout */}
      <Script
        id="consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: consentDefaultScript }}
      />
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- padrão oficial do App Router para o root layout */}
      <Script
        id="gtm-script"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: gtmScript }}
      />
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
