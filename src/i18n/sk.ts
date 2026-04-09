// src/i18n/sk.ts
import type { TranslationSet } from './types';

const sk = {
  nav: {
    products: 'Produkty',
    investors: 'Pre Investorov',
    selectLanguage: 'Vyber jazyk',
  },
  footer: {
    company: 'HPM company Slovakia',
    description: 'Prefabrikované záhradné kancelárie z ekologických materiálov.',
    quickLinks: 'Rýchle odkazy',
    contact: 'Kontakt',
    home: 'Domov',
    copyright: '© 2026 HPM company Slovakia. Všetky práva vyhradené.',
    privacyPolicy: 'Ochrana osobných údajov',
    termsOfService: 'Podmienky používania',
    cookieSettings: 'Nastavenia cookies',
  },
  contact: {
    formLabel: 'Kontaktný Formulár',
    nameLabel: 'Meno',
    emailLabel: 'Email',
    productLabel: 'Ktorý produkt vás zaujíma?',
    noteLabel: 'Poznámka',
    submitBtn: 'Odoslať',
    whatsappBtn: 'Alebo napíš mi na WhatsApp',
    successMsg: 'Ďakujeme! Čoskoro sa vám ozývame.',
    errorMsg: 'Chyba pri odoslaní. Skúste znova.',
    productOptions: ['Hay Office Solo', 'Hay Studio Duo', 'Nature Meeting Cube', 'Iné'],
  },
} as const satisfies TranslationSet;

export default sk;
