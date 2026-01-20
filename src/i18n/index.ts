import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import zh from "./locales/zh.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";

export const SUPPORTED_LANGUAGES = {
  auto: "auto",
  en: "en",
  zh: "zh",
  ja: "ja",
  ko: "ko",
  fr: "fr",
  es: "es",
} as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[keyof typeof SUPPORTED_LANGUAGES];

// Language names for UI display
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  [SUPPORTED_LANGUAGES.auto]: "Auto / Follow System",
  [SUPPORTED_LANGUAGES.en]: "English",
  [SUPPORTED_LANGUAGES.zh]: "简体中文",
  [SUPPORTED_LANGUAGES.ja]: "日本語",
  [SUPPORTED_LANGUAGES.ko]: "한국어",
  [SUPPORTED_LANGUAGES.fr]: "Français",
  [SUPPORTED_LANGUAGES.es]: "Español",
};

const resources = {
  en: { translation: en },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  fr: { translation: fr },
  es: { translation: es },
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: {
      default: ["en"],
      zh: ["zh", "en"],
      ja: ["ja", "en"],
      ko: ["ko", "en"],
      fr: ["fr", "en"],
      es: ["es", "en"],
    },
    supportedLngs: ["en", "zh", "ja", "ko", "fr", "es"],
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    detection: {
      order: ["navigator", "htmlTag"],
      caches: [],
    },
  });

export default i18n;

/**
 * Get the effective language for a given setting
 * @param languageSetting - The language setting from plugin settings
 * @returns The effective language code ('en' or 'zh')
 */
export function getEffectiveLanguage(languageSetting: SupportedLanguage): string {
  if (languageSetting === SUPPORTED_LANGUAGES.auto) {
    // If auto-detect, use i18next's detected language or fallback to English
    return i18n.language || "en";
  }
  return languageSetting;
}

/**
 * Change the current language
 * @param lang - The language code to switch to
 */
export function changeLanguage(lang: SupportedLanguage): void {
  const effectiveLang = lang === SUPPORTED_LANGUAGES.auto ? "en" : lang;
  i18n.changeLanguage(effectiveLang);
}

/**
 * Translate a message key with optional interpolation values
 * @param key - The translation key (e.g., 'loading.readingFiles')
 * @param values - Optional values for interpolation
 * @returns The translated string, or the key if not found
 */
export function t(key: string, values?: Record<string, string | number>): string {
  if (key.startsWith("loading.")) {
    return i18n.t(key, values) || key;
  }
  return i18n.t(key, values);
}
