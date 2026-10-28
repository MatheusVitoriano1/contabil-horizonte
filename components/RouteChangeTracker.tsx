"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackVirtualPageView } from "@/lib/tracking";
import { getPageMeta } from "@/lib/page-meta";

function RouteChangeTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const { pageType, servico } = getPageMeta(pathname);
    const servicoFromQuery = searchParams.get("servico");

    trackVirtualPageView({
      page_path: query ? `${pathname}?${query}` : pathname,
      page_location: window.location.href,
      page_title: document.title,
      page_type: pageType,
      servico: servico ?? servicoFromQuery ?? undefined,
    });
  }, [pathname, searchParams]);

  return null;
}

/**
 * Dispara `virtual_page_view` no primeiro carregamento e em toda troca de rota
 * da SPA (o GTM só vê a primeira carga de página). useSearchParams precisa de
 * um Suspense boundary para não forçar toda a árvore a renderização dinâmica.
 */
export default function RouteChangeTracker() {
  return (
    <Suspense fallback={null}>
      <RouteChangeTrackerInner />
    </Suspense>
  );
}
