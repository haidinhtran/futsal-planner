/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. TYPOGRAPHY DESIGN TOKENS
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        '3xs': ['0.53125rem', { lineHeight: '0.75rem' }], // 8.5px (Mini Badge Labels)
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }], // 10px (Sub-labels / Metadata)
        'xs': ['0.75rem', { lineHeight: '1rem' }],        // 12px (Default UI Compact)
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],    // 14px (Base Text Standard)
        'base': ['1rem', { lineHeight: '1.5rem' }],       // 16px (Body Regular)
      },

      // 2. COLOR PALETTE DESIGN TOKENS (Semantic Brand & Position Roles)
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb', // Primary App Blue
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        position: {
          fixo: { DEFAULT: '#7e22ce', bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff' }, // FIXO Purple
          ala: { DEFAULT: '#0284c7', bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },  // ALA Blue
          pivot: { DEFAULT: '#ea580c', bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' },// PIVOT Orange
          gk: { DEFAULT: '#16a34a', bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },   // GK Green
        },
        surface: {
          app: '#f1f5f9',      // Main App Background
          card: '#ffffff',     // Card & Modal Surface
          subtle: '#f8fafc',   // Secondary Subtle Panel
          border: '#e2e8f0',   // Component Border Color
        }
      },

      // 3. SPACING & DIMENSION TOKENS
      spacing: {
        'header-h': '3.25rem',        // 52px (Topbar / Sidebar Header)
        'sidebar-w': '16rem',         // 256px (Expanded Sidebar)
        'sidebar-collapsed': '4rem',  // 64px (Collapsed Sidebar)
        'pitch-slot-min': '7.8125rem',// 125px (Slot Card Min Width)
      },

      // 4. BORDER RADIUS TOKENS
      borderRadius: {
        'btn': '0.6875rem',     // 11px (Smooth rounded corners for buttons/inputs)
        'btn-sm': '0.5rem',     // 8px (Smooth rounded for small buttons/badges)
        '2xl': '1rem',          // 16px
        '3xl': '1.5rem',        // 24px
      },

      // 5. BOX SHADOW TOKENS
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'pitch-card': '0 4px 12px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
};
