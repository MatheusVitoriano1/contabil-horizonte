import { slugParaSnakeCase } from "./servicos";

export type PageType =
  | "home"
  | "servicos"
  | "servico"
  | "landing_ir"
  | "contato"
  | "obrigado"
  | "institucional";

export interface PageMeta {
  pageType: PageType;
  servico?: string;
}

/** Deriva page_type (e, quando houver, servico) a partir do pathname da rota. */
export function getPageMeta(pathname: string): PageMeta {
  if (pathname === "/") return { pageType: "home" };
  if (pathname === "/servicos") return { pageType: "servicos" };
  if (pathname.startsWith("/servicos/")) {
    const slug = pathname.split("/")[2] ?? "";
    return { pageType: "servico", servico: slugParaSnakeCase(slug) };
  }
  if (pathname === "/imposto-de-renda") return { pageType: "landing_ir" };
  if (pathname === "/contato") return { pageType: "contato" };
  if (pathname === "/obrigado") return { pageType: "obrigado" };
  if (pathname === "/politica-de-privacidade") return { pageType: "institucional" };
  return { pageType: "home" };
}
