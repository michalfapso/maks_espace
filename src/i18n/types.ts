// src/i18n/types.ts
export interface TranslationSet {
  nav: {
    products: string;
    materials: string;
    investors: string;
    selectLanguage?: string;
  };
  footer: {
    company: string;
    contact: string;
    description?: string;
    quickLinks?: string;
    home?: string;
    copyright?: string;
    privacyPolicy?: string;
    termsOfService?: string;
    cookieSettings?: string;
  };
  contact: {
    formLabel: string;
    nameLabel: string;
    emailLabel: string;
    productLabel: string;
    noteLabel: string;
    submitBtn: string;
    whatsappBtn: string;
    successMsg: string;
    errorMsg: string;
    productOptions: [string, string, string, string]; // 4 options: 3 products + Other
    selectProductLabel?: string;
    whatsappTemplate?: string;
  };
}
