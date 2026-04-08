// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://espace-gardens.com',
  base: '/',
  output: 'static',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  vite: {
    ssr: {
      external: ['glightbox'],
    },
  },
  env: {
    schema: {
      PUBLIC_SITE_URL: 'string',
      PUBLIC_GA_ID: 'string',
    },
  },
});
