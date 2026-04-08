// src/i18n/cs.ts
import type { TranslationSet } from './types';

const cs = {
  nav: {
    products: 'Produkty',
    investors: 'Pro Investory',
    selectLanguage: 'Vyberte jazyk',
  },
  footer: {
    company: 'HPM company Slovakia',
    description: 'Prefabrikované zahradní kanceláře vyrobené z ekologických materiálů.',
    quickLinks: 'Rychlé odkazy',
    contact: 'Kontakt',
    home: 'Domov',
  },
  contact: {
    formLabel: 'Kontaktní Formulář',
    nameLabel: 'Jméno',
    emailLabel: 'Email',
    productLabel: 'Který produkt vás zajímá?',
    noteLabel: 'Zpráva',
    submitBtn: 'Odeslat',
    whatsappBtn: 'Nebo mi napište na WhatsApp',
    successMsg: 'Děkujeme! Brzy se vám ozveme.',
    errorMsg: 'Chyba při odesílání. Zkuste prosím znovu.',
    productOptions: ['Hay Office Solo', 'Hay Studio Duo', 'Nature Meeting Cube', 'Jiné'],
  },
} as const satisfies TranslationSet;

export default cs;
