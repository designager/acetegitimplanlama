/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-navy': '#1B2A6B',
        'navy-dark': '#111C4E',
        'navy-light': '#2E3F8F',
        'rose-gold': '#B76E79',
        'rose-gold-light': '#D4959E',
        'rose-gold-pale': '#F2E0E2',
        'cream': '#FAF7F5',
        'text-primary': '#1A1A2E',
        'text-muted': '#6B7280',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'premium': '0 4px 20px rgba(27, 42, 107, 0.08), 0 1px 3px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
