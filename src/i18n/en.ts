// src/i18n/en.ts
import type { TranslationSet } from './types';

const en = {
  nav: {
    products: 'Products',
    materials: 'Materials',
    investors: 'For Investors',
    selectLanguage: 'Select Language',
  },
  footer: {
    company: 'HPM company Slovakia',
    description: 'Prefabricated garden offices made from ecological materials.',
    quickLinks: 'Quick Links',
    contact: 'Contact',
    home: 'Home',
    copyright: '© 2026 HPM company Slovakia. All rights reserved.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    cookieSettings: 'Cookie Settings',
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
    selectProductLabel: '-- Select product --',
    whatsappTemplate: 'Hello, my name is {name} and I am interested in {product}.',
  },
} as const satisfies TranslationSet;

export default en;
