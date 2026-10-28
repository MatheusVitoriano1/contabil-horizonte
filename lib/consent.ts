import { pushEvent } from "./tracking";

export const CONSENT_STORAGE_KEY = "cookie_consent";

export type ConsentStatus = "granted" | "denied";

export type ConsentMethod = "aceitar_todos" | "rejeitar_todos" | "personalizado";

export interface ConsentChoice {
  analytics: ConsentStatus;
  marketing: ConsentStatus;
}

/** Lê a escolha de consentimento salva no navegador. Retorna null se nunca escolheu. */
export function getStoredConsent(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    if (parsed.analytics && parsed.marketing) {
      return { analytics: parsed.analytics, marketing: parsed.marketing };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: ConsentChoice): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(choice));
  } catch {
    // localStorage indisponível (modo privado etc.): seguimos sem persistir.
  }
}

/** Mesmo "gtag" shim usado no script inline de consentimento padrão, para que
 * as mesmas entradas do dataLayer (arrays com a assinatura do gtag.js) sejam
 * usadas tanto no carregamento inicial quanto nas atualizações feitas em React. */
function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export function applyConsentUpdate(choice: ConsentChoice): void {
  gtag("consent", "update", {
    ad_storage: choice.marketing,
    ad_user_data: choice.marketing,
    ad_personalization: choice.marketing,
    analytics_storage: choice.analytics,
  });
}

export function applyAndTrackConsent(choice: ConsentChoice, method: ConsentMethod): void {
  saveConsent(choice);
  applyConsentUpdate(choice);
  pushEvent("consent_update", {
    consent_analytics: choice.analytics,
    consent_marketing: choice.marketing,
    consent_method: method,
  });
}
