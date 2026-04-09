import { useEffect, useMemo, useState } from "react";

export type UILanguage = "en" | "hi";

const STORAGE_KEY = "legal_ai_language";
const LANGUAGE_EVENT = "legal-ai-language-changed";

export function getStoredLanguage(): UILanguage {
  if (typeof window === "undefined") return "en";
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "hi" ? "hi" : "en";
}

export function setStoredLanguage(language: UILanguage) {
  window.localStorage.setItem(STORAGE_KEY, language);
  window.dispatchEvent(new Event(LANGUAGE_EVENT));
}

export function useLanguage() {
  const [language, setLanguage] = useState<UILanguage>(() => getStoredLanguage());

  useEffect(() => {
    const sync = () => setLanguage(getStoredLanguage());
    window.addEventListener(LANGUAGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(LANGUAGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const value = useMemo(
    () => ({
      language,
      isHindi: language === "hi",
      setLanguage,
      toggleLanguage: () => setStoredLanguage(language === "en" ? "hi" : "en"),
    }),
    [language]
  );

  return value;
}
