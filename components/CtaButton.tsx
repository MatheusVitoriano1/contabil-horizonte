"use client";

import Link from "next/link";
import type { CtaLocation } from "@/lib/tracking";
import { trackCtaClick } from "@/lib/tracking";

type Variant = "primary" | "secondary" | "outline";

interface CtaButtonProps {
  href: string;
  ctaId: string;
  ctaLocation: CtaLocation;
  label: string;
  variant?: Variant;
  className?: string;
  external?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:outline-emerald-700",
  secondary:
    "bg-white text-emerald-800 border border-emerald-700 hover:bg-emerald-50 focus-visible:outline-emerald-700",
  outline:
    "bg-transparent text-white border border-white hover:bg-white/10 focus-visible:outline-white",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * Botão de CTA reutilizável. Dispara `cta_click` para qualquer destino,
 * EXCETO links de WhatsApp (use `WhatsAppLink` para esses).
 */
export default function CtaButton({
  href,
  ctaId,
  ctaLocation,
  label,
  variant = "primary",
  className = "",
  external = false,
}: CtaButtonProps) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`;

  function handleClick() {
    trackCtaClick({
      cta_id: ctaId,
      cta_text: label,
      cta_location: ctaLocation,
      cta_destination: href,
    });
  }

  const sharedProps = {
    id: ctaId,
    "data-cta": ctaId,
    onClick: handleClick,
    className: classes,
  };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...sharedProps}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} {...sharedProps}>
      {label}
    </Link>
  );
}
