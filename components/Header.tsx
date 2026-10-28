import Link from "next/link";
import CtaButton from "./CtaButton";
import WhatsAppLink from "./WhatsAppLink";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/servicos", label: "Serviços" },
  { href: "/imposto-de-renda", label: "Imposto de Renda" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-emerald-900"
          data-cta="header_logo"
        >
          Contábil Horizonte
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 hover:text-emerald-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <WhatsAppLink
            location="header"
            label="WhatsApp"
            id="header_whatsapp"
            className="hidden text-sm font-semibold text-emerald-800 hover:text-emerald-900 sm:inline"
          />
          <CtaButton
            href="/contato"
            ctaId="header_fale_contador"
            ctaLocation="header"
            label="Fale com um contador"
            className="text-xs sm:text-sm"
          />
        </div>
      </div>

      <nav
        aria-label="Navegação principal (mobile)"
        className="flex items-center justify-center gap-4 border-t border-slate-100 px-4 py-2 md:hidden"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs font-medium text-slate-700 hover:text-emerald-800"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
