"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  applyAndTrackConsent,
  getStoredConsent,
  type ConsentChoice,
} from "@/lib/consent";

interface CookieConsentContextValue {
  consent: ConsentChoice | null;
  isBannerVisible: boolean;
  isModalOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (choice: ConsentChoice) => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentChoice | null>(null);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Leitura do localStorage só é segura no cliente, após a montagem (SSR não tem storage).
    const stored = getStoredConsent();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(stored);
    setIsBannerVisible(!stored);
  }, []);

  const applyChoice = useCallback(
    (choice: ConsentChoice, method: "aceitar_todos" | "rejeitar_todos" | "personalizado") => {
      applyAndTrackConsent(choice, method);
      setConsent(choice);
      setIsBannerVisible(false);
      setIsModalOpen(false);
    },
    []
  );

  const acceptAll = useCallback(
    () => applyChoice({ analytics: "granted", marketing: "granted" }, "aceitar_todos"),
    [applyChoice]
  );

  const rejectAll = useCallback(
    () => applyChoice({ analytics: "denied", marketing: "denied" }, "rejeitar_todos"),
    [applyChoice]
  );

  const savePreferences = useCallback(
    (choice: ConsentChoice) => applyChoice(choice, "personalizado"),
    [applyChoice]
  );

  const openPreferences = useCallback(() => setIsModalOpen(true), []);
  const closePreferences = useCallback(() => setIsModalOpen(false), []);

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        isBannerVisible,
        isModalOpen,
        openPreferences,
        closePreferences,
        acceptAll,
        rejectAll,
        savePreferences,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent deve ser usado dentro de CookieConsentProvider");
  }
  return ctx;
}
