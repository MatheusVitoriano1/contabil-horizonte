export type CtaLocation =
  | "header"
  | "hero"
  | "servico"
  | "faixa_ir"
  | "cta_final"
  | "footer";

export type WhatsAppLocation =
  | "flutuante"
  | "header"
  | "servico"
  | "contato"
  | "obrigado";

export type PorteEmpresa = "nao_tenho_empresa" | "mei" | "me" | "epp" | "outro";

export type FormSubmitErrorType = "validacao" | "api";

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

/**
 * Centraliza todo dataLayer.push do site. Nunca passar PII
 * (nome, e-mail, telefone, mensagem) em `params`.
 */
export function pushEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export function trackVirtualPageView(params: {
  page_path: string;
  page_location: string;
  page_title: string;
  page_type: string;
  servico?: string;
}) {
  pushEvent("virtual_page_view", params);
}

export function trackCtaClick(params: {
  cta_id: string;
  cta_text: string;
  cta_location: CtaLocation;
  cta_destination: string;
}) {
  pushEvent("cta_click", params);
}

export function trackWhatsappClick(params: {
  cta_location: WhatsAppLocation;
  page_type: string;
  servico?: string;
}) {
  pushEvent("whatsapp_click", params);
}

export function trackFormStart(params: { form_id: string; form_name: string }) {
  pushEvent("form_start", params);
}

export function trackFormSubmitError(params: {
  form_id: string;
  error_type: FormSubmitErrorType;
  error_fields: string;
}) {
  pushEvent("form_submit_error", params);
}

export function trackGenerateLeadOrcamento(params: {
  servico_interesse: string;
  porte_empresa: PorteEmpresa;
  value: number;
}) {
  pushEvent("generate_lead", {
    form_id: "contato_orcamento",
    form_name: "Formulário de contato e orçamento",
    lead_type: "orcamento",
    servico_interesse: params.servico_interesse,
    porte_empresa: params.porte_empresa,
    value: params.value,
    currency: "BRL",
  });
}

export function trackGenerateLeadGuiaIr(params: {
  declara_ir_todo_ano: "sim" | "nao";
}) {
  pushEvent("generate_lead", {
    form_id: "guia_ir",
    form_name: "Formulário do guia de Imposto de Renda",
    lead_type: "material_rico",
    declara_ir_todo_ano: params.declara_ir_todo_ano,
    value: 20,
    currency: "BRL",
  });
}

export function trackGuiaIrDownload(params: { link_url: string }) {
  pushEvent("guia_ir_download", {
    file_name: "guia-documentos-imposto-de-renda-2027",
    file_extension: "pdf",
    link_url: params.link_url,
  });
}
