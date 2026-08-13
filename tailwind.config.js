/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '2xl': '1536px',
        '3xl': '1760px',
      },
      fontSize: {
        '3xs': ['0.5rem', { lineHeight: '0.75rem' }],
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          subtle: '#EFF6FF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          hover: '#F1F5F9',
        },
        border: {
          DEFAULT: '#E2E8F0',
          subtle: '#EEF2F6',
        },
        text: {
          primary: '#172554',
          secondary: '#334155',
          muted: '#94A3B8',
        },
        success: '#059669',
        warning: '#D97706',
        danger: '#DC2626',
      },
      borderRadius: {
        'btn': '0.5rem',
        'ui': '0.5rem',
        'card': '0.5rem',
      },
    },
  },
  plugins: [],
}
