// src/i18n/index.ts
export type Lang = 'sk' | 'en' | 'cs';

export const SUPPORTED_LANGS: Lang[] = ['sk', 'en', 'cs'];

export const LANG_META = {
  sk: { label: 'Slovenčina', flag: '🇸🇰', ogLocale: 'sk_SK' },
  en: { label: 'English', flag: '🇬🇧', ogLocale: 'en_GB' },
  cs: { label: 'Čeština', flag: '🇨🇿', ogLocale: 'cs_CZ' },
} as const;

// Import global translation strings
import sk from './sk';
import en from './en';
import cs from './cs';

const translations: Record<Lang, typeof sk> = { sk, en, cs };

export function t(lang: Lang) {
  return translations[lang] || translations.sk;
}

// Get base URL from Astro config
const BASE_URL = import.meta.env.BASE_URL || '/';

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

export function getLangURL(pathname: string, lang: Lang): string {
  if (pathname.includes('investorov') || pathname.includes('investors') || pathname.includes('investory')) {
    return getInvestorPath(lang);
  }
  return getProductsPath(lang);
}
