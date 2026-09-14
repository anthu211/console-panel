/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        shell: {
          bg: 'var(--shell-bg)',
          border: 'var(--shell-border)',
          text: 'var(--shell-text)',
          'text-2': 'var(--shell-text-2)',
          muted: 'var(--shell-text-muted)',
          hover: 'var(--shell-hover)',
          active: 'var(--shell-active)',
          raised: 'var(--shell-raised)',
          elevated: 'var(--shell-elevated)',
        },
        ctrl: {
          bg: 'var(--ctrl-bg)',
          border: 'var(--ctrl-border)',
          placeholder: 'var(--ctrl-placeholder)',
        },
        card: {
          bg: 'var(--card-bg)',
          border: 'var(--card-border)',
        },
        table: {
          'th-bg': 'var(--table-th-bg)',
          border: 'var(--table-border)',
        },
        accent: {
          DEFAULT: '#6360D8',
          dark: '#504bb8',
        },
        critical: '#D12329',
        high: '#E15252',
        medium: '#D98B1D',
        low: '#31A56D',
        success: '#31A56D',
        danger: '#dc2626',
      },
      borderRadius: {
        pill: '44px',
        card: '4px',
        modal: '12px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['SF Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'page-title': ['18px', { lineHeight: '24px', fontWeight: '700' }],
        'heading-md': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'body-md': ['12px', { lineHeight: '18px' }],
        'body-sm': ['11px', { lineHeight: '16px' }],
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
        'fade-in': 'fade-in 150ms ease-out',
        'slide-in-right': 'slide-in-right 200ms ease-out',
      },
    },
  },
  plugins: [],
}
