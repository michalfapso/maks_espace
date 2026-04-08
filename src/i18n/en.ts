// src/i18n/en.ts
import type { TranslationSet } from './types';

const en = {
  nav: {
    products: 'Products',
    investors: 'For Investors',
  },
  footer: {
    company: 'HPM company Slovakia',
    contact: 'Contact',
  },
  contact: {
    formLabel: 'Contact Form',
    nameLabel: 'Name',
    emailLabel: 'Email',
    productLabel: 'Which product interests you?',
    noteLabel: 'Message',
    submitBtn: 'Send',
    whatsappBtn: 'Or message me on WhatsApp',
    successMsg: 'Thank you! We\'ll be in touch soon.',
    errorMsg: 'Error sending message. Please try again.',
    productOptions: ['Hay Office Solo', 'Hay Studio Duo', 'Nature Meeting Cube', 'Other'],
  },
} as const satisfies TranslationSet;

export default en;
