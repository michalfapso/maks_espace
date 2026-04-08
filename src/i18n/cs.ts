// src/i18n/cs.ts
import type { TranslationSet } from './types';

const cs = {
  nav: {
    products: 'Produkty',
    investors: 'Pro Investory',
  },
  footer: {
    company: 'HPM company Slovakia',
    contact: 'Kontakt',
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
