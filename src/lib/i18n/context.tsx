"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "./locales/en.json";
import si from "./locales/si.json";
import ta from "./locales/ta.json";

export type Locale = "en" | "si" | "ta";

type Translations = typeof en;

const dictionaries: Record<Locale, Translations> = {
  en,
  si: si as unknown as Translations,
  ta: ta as unknown as Translations,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("roame_lang") as Locale | null;
    if (saved && (saved === "en" || saved === "si" || saved === "ta")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("roame_lang", newLocale);
    document.cookie = `roame_lang=${newLocale}; path=/; max-age=31536000`;
  };

  // Nested property accessor e.g. "hero.titlePrefix"
  const t = (path: string): string => {
    const dict = dictionaries[locale] || dictionaries.en;
    const keys = path.split(".");
    let current: unknown = dict;

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        // Fallback to English if translation key is missing
        let fallback: unknown = dictionaries.en;
        for (const fbKey of keys) {
          if (fallback && typeof fallback === "object" && fbKey in fallback) {
            fallback = (fallback as Record<string, unknown>)[fbKey];
          } else {
            return path;
          }
        }
        return typeof fallback === "string" ? fallback : path;
      }
    }

    return typeof current === "string" ? current : path;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
