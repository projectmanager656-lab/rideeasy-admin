/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  /*
   * Tailwind dark mode is controlled by the `.dark` class.
   * The CSS design tokens also support `[data-theme="dark"]`.
   */
  darkMode: 'class',

  theme: {
    extend: {
      /*
       * =====================================================
       * RideEasy Admin - Colors
       * Single source of truth:
       * src/styles/design-tokens.css
       * =====================================================
       */
      colors: {
        admin: {
          primary: 'var(--color-primary)',
          primaryHover: 'var(--color-primary-hover)',
          primarySoft: 'var(--color-primary-soft)',

          background: 'var(--color-background)',
          surface: 'var(--color-surface)',
          surfaceMuted: 'var(--color-surface-muted)',

          text: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          inverse: 'var(--color-text-inverse)',

          border: 'var(--color-border)',
          borderStrong: 'var(--color-border-strong)',

          navy: 'var(--color-sidebar)',
          sidebar: 'var(--color-sidebar)',
          sidebarText: 'var(--color-sidebar-text)',
          sidebarActive: 'var(--color-sidebar-active)',

          success: 'var(--color-success)',
          successSoft: 'var(--color-success-soft)',

          warning: 'var(--color-warning)',
          warningSoft: 'var(--color-warning-soft)',

          danger: 'var(--color-danger)',
          dangerHover: 'var(--color-danger-hover)',
          dangerSoft: 'var(--color-danger-soft)',

          info: 'var(--color-info)',
          infoSoft: 'var(--color-info-soft)',
        },
      },

      /*
       * =====================================================
       * Spacing
       * =====================================================
       */
      spacing: {
        'admin-xs': 'var(--space-1)',
        'admin-sm': 'var(--space-2)',
        'admin-md': 'var(--space-3)',
        'admin-lg': 'var(--space-4)',
        'admin-xl': 'var(--space-5)',
        'admin-2xl': 'var(--space-6)',
        'admin-3xl': 'var(--space-8)',
      },

      /*
       * =====================================================
       * Border Radius
       * =====================================================
       */
      borderRadius: {
        'admin-sm': 'var(--radius-sm)',
        'admin-md': 'var(--radius-md)',
        'admin-lg': 'var(--radius-lg)',
        'admin-xl': 'var(--radius-xl)',
        'admin-2xl': 'var(--radius-2xl)',
        'admin-full': 'var(--radius-full)',
      },

      /*
       * =====================================================
       * Component Heights
       * =====================================================
       */
      height: {
        'admin-input': 'var(--height-input)',
        'admin-button-sm': 'var(--height-button-sm)',
        'admin-button': 'var(--height-button-md)',
        'admin-button-lg': 'var(--height-button-lg)',
      },

      /*
       * =====================================================
       * Typography
       * =====================================================
       */
      fontFamily: {
        admin: 'var(--font-family-base)',
      },

      fontSize: {
        'admin-xs': 'var(--font-size-xs)',
        'admin-sm': 'var(--font-size-sm)',
        'admin-md': 'var(--font-size-md)',
        'admin-lg': 'var(--font-size-lg)',
        'admin-xl': 'var(--font-size-xl)',
        'admin-2xl': 'var(--font-size-2xl)',
      },

      fontWeight: {
        'admin-normal': 'var(--font-weight-normal)',
        'admin-medium': 'var(--font-weight-medium)',
        'admin-semibold': 'var(--font-weight-semibold)',
        'admin-bold': 'var(--font-weight-bold)',
      },

      /*
       * =====================================================
       * Card Padding
       * =====================================================
       */
      padding: {
        'admin-card-sm': 'var(--card-padding-sm)',
        'admin-card-md': 'var(--card-padding-md)',
        'admin-card-lg': 'var(--card-padding-lg)',
      },

      /*
       * =====================================================
       * Layout
       * =====================================================
       */
      width: {
        'admin-sidebar': 'var(--sidebar-width)',
      },

      minWidth: {
        'admin-sidebar': 'var(--sidebar-width)',
      },

      height: {
        'admin-header': 'var(--header-height)',
        'admin-input': 'var(--height-input)',
        'admin-button-sm': 'var(--height-button-sm)',
        'admin-button': 'var(--height-button-md)',
        'admin-button-lg': 'var(--height-button-lg)',
      },

      /*
       * =====================================================
       * Shadows
       * =====================================================
       */
      boxShadow: {
        'admin-card': 'var(--shadow-card)',
        'admin-card-hover': 'var(--shadow-card-hover)',
        'admin-modal': '0 20px 50px rgba(15, 23, 42, 0.20)',
      },
    },
  },

  plugins: [],
}
