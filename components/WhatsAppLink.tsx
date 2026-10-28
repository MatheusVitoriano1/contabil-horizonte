"use client";

import { usePathname } from "next/navigation";
import type { WhatsAppLocation } from "@/lib/tracking";
import { trackWhatsappClick } from "@/lib/tracking";
import { getPageMeta } from "@/lib/page-meta";

interface WhatsAppLinkProps {
  location: WhatsAppLocation;
  label: string;
  className?: string;
  /** Sobrescreve o `servico` detectado automaticamente pela rota (ex.: na /obrigado). */
  servico?: string;
  id?: string;
}

const DEFAULT_MESSAGE =
  "Olá! Vim pelo site da Contábil Horizonte e gostaria de falar com um contador.";

/**
 * Link de WhatsApp reutilizável. Dispara `whatsapp_click` (nunca `cta_click`).
 * Todo elemento clicável tem `id`/`data-cta` para acionadores de clique nativo do GTM.
 */
export default function WhatsAppLink({
  location,
  label,
  className = "",
  servico,
  id,
}: WhatsAppLinkProps) {
  const pathname = usePathname();
  const { pageType, servico: servicoDaRota } = getPageMeta(pathname);
  const servicoFinal = servico ?? servicoDaRota;

  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const href = `https://wa.me/${numero}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
  const dataCta = id ?? `whatsapp_${location}`;

  function handleClick() {
    trackWhatsappClick({
      cta_location: location,
      page_type: pageType,
      servico: servicoFinal,
    });
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      id={dataCta}
      data-cta={dataCta}
      onClick={handleClick}
      className={className}
    >
      {label}
    </a>
  );
}
