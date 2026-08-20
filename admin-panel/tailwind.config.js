/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        admin: {
          primary: '#FFB000',
          primaryHover: '#FFC34D',

          navy: '#071A2B',
          background: '#F7F9FC',
          surface: '#FFFFFF',

          text: '#152238',
          muted: '#718096',
          border: '#E6EBF2',

          success: '#1FAA59',
          warning: '#B8860B',
          danger: '#E5484D',
          info: '#2563EB',
        },
      },

      spacing: {
        'admin-xs': '4px',
        'admin-sm': '8px',
        'admin-md': '12px',
        'admin-lg': '16px',
        'admin-xl': '20px',
        'admin-2xl': '24px',
        'admin-3xl': '32px',
      },

      borderRadius: {
        'admin-sm': '8px',
        'admin-md': '12px',
        'admin-lg': '16px',
        'admin-xl': '20px',
        'admin-2xl': '24px',
      },

      height: {
        'admin-input': '40px',
        'admin-button-sm': '36px',
        'admin-button': '40px',
        'admin-button-lg': '44px',
      },

      fontSize: {
        'admin-xs': ['12px', { lineHeight: '16px' }],
        'admin-sm': ['14px', { lineHeight: '20px' }],
        'admin-md': ['16px', { lineHeight: '24px' }],
        'admin-lg': ['20px', { lineHeight: '28px' }],
        'admin-xl': ['24px', { lineHeight: '32px' }],
        'admin-2xl': ['28px', { lineHeight: '36px' }],
      },

      boxShadow: {
        'admin-card': '0 1px 3px rgba(15, 23, 42, 0.08)',
        'admin-card-hover': '0 8px 24px rgba(15, 23, 42, 0.10)',
        'admin-modal': '0 20px 50px rgba(15, 23, 42, 0.20)',
      },
    },
  },

  plugins: [],
}
