"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import enTranslations from "@/data/locales/en.json";
import hiTranslations from "@/data/locales/hi.json";

export type SupportedLanguage = "en" | "hi";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: enTranslations,
  hi: hiTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("hi");

  useEffect(() => {
    const saved = localStorage.getItem("shilpsutra_lang") as SupportedLanguage;
    if (saved && (saved === "en" || saved === "hi")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("shilpsutra_lang", lang);
    }
  };

  const t = (key: string): string => {
    const currentDict = translations[language] || translations.en;
    if (currentDict[key]) {
      return currentDict[key];
    }
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
