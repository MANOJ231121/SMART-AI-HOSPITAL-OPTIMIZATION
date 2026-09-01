import React, { createContext, useContext, useState, useEffect } from "react";
import { TRANSLATIONS, DEFAULT_LANG } from "../data/translations";

const LanguageContext = createContext(null);

// Maps the app language code to the TTS speech language tag.
export function langToSpeech(lang) {
  return lang === "en" ? "en-IN" : "hi-IN";
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("smartcare_lang") || DEFAULT_LANG;
    } catch {
      return DEFAULT_LANG;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("smartcare_lang", lang);
    } catch {}
  }, [lang]);

  const t = (key, vars = {}) => {
    const entry = TRANSLATIONS[key];
    const text = entry ? entry[lang] || entry["en"] || key : key;
    return Object.keys(vars).reduce(
      (acc, k) => acc.replace(new RegExp(`\\{${k}\\}`, "g"), vars[k]),
      text
    );
  };

  const toggleLang = () => setLang((prev) => (prev === "en" ? "hi" : "en"));

  const value = {
    lang,
    setLang,
    toggleLang,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
};
