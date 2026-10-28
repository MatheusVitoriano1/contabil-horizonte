"use client";

import { useEffect, useRef } from "react";
import { pushEvent } from "@/lib/tracking";

const THRESHOLDS = [25, 50, 75, 90];

/** Dispara `scroll_depth` uma vez para cada marco (25/50/75/90%) de rolagem da página. */
export default function ScrollDepthTracker() {
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    function handleScroll() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = Math.round((window.scrollY / docHeight) * 100);

      for (const threshold of THRESHOLDS) {
        if (percent >= threshold && !firedRef.current.has(threshold)) {
          firedRef.current.add(threshold);
          pushEvent("scroll_depth", { percent_scrolled: threshold });
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}
