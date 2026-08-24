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
          DEFAULT: '#64748B',
          hover: '#475569',
          subtle: '#F1F5F9',
        },
        blue: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#64748B', // This maps bg-blue-600 to our new primary
          700: '#475569', // This maps bg-blue-700 to primary hover
          800: '#334155',
          900: '#0F172A',
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
