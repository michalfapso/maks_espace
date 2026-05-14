// src/i18n/index.ts
import type { TranslationSet } from './types';

export type Lang = 'sk' | 'en' | 'cs';

export const SUPPORTED_LANGS: Lang[] = ['en', 'sk', 'cs'];

export const LANG_META = {
  en: { label: 'English', flag: '🇬🇧', ogLocale: 'en_GB' },
  sk: { label: 'Slovenčina', flag: '🇸🇰', ogLocale: 'sk_SK' },
  cs: { label: 'Čeština', flag: '🇨🇿', ogLocale: 'cs_CZ' },
} as const;

// Import global translation strings
import sk from './sk';
import en from './en';
import cs from './cs';

const translations: Record<Lang, TranslationSet> = { sk, en, cs };

export function t(lang: Lang) {
  return translations[lang] || translations.sk;
}

// Get base URL from Astro config
const BASE_URL = import.meta.env.BASE_URL;

// Get language-specific URLs
export function getProductsPath(lang: Lang): string {
  return `${BASE_URL}${lang}/`;
}

export function getInvestorPath(lang: Lang): string {
  const investorPaths: Record<Lang, string> = {
    sk: `${BASE_URL}sk/pre-investorov/`,
    en: `${BASE_URL}en/for-investors/`,
    cs: `${BASE_URL}cs/pro-investory/`,
  };
  return investorPaths[lang];
}

export function getMaterialsPath(lang: Lang): string {
  const materialsPaths: Record<Lang, string> = {
    sk: `${BASE_URL}sk/materialy/`,
    en: `${BASE_URL}en/materials/`,
    cs: `${BASE_URL}cs/materialy/`,
  };
  return materialsPaths[lang];
}

export function getAboutPath(lang: Lang): string {
  const aboutPaths: Record<Lang, string> = {
    en: `${BASE_URL}en/about/`,
    sk: `${BASE_URL}sk/o-nas/`,
    cs: `${BASE_URL}cs/o-nas/`,
  };
  return aboutPaths[lang];
}

export function getLangURL(pathname: string, lang: Lang): string {
  const segments = new Set(pathname.split('/').filter(Boolean));
  if (segments.has('pre-investorov') || segments.has('for-investors') || segments.has('pro-investory')) {
    return getInvestorPath(lang);
  }
  if (segments.has('o-nas') || segments.has('about')) {
    return getAboutPath(lang);
  }
  if (segments.has('materialy') || segments.has('materials')) {
    return getMaterialsPath(lang);
  }
  return getProductsPath(lang);
}
