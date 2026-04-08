import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        wood: '#3a2f29',      // Dark wood brown
        cream: '#f5f1ed',     // Off-white / cream
        amber: '#c19a6b',     // Warm amber accent
        gray: {
          800: '#333',        // Dark text
          600: '#666',        // Medium text
          100: '#f0f0f0',     // Light backgrounds
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '4xl': ['36px', '40px'],
        '5xl': ['48px', '48px'],
        '6xl': ['60px', '60px'],
      },
      spacing: {
        'section-padding': '2rem', // Responsive via @apply
      },
    },
  },
  plugins: [],
};
