import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pembe: '#f2a8bc',
        'pembe-koy': '#e07898',
        'pembe-acik': '#fce8ef',
        mavi: '#7ab8e8',
        'mavi-koy': '#4a90c4',
        'mavi-acik': '#e8f4fd',
        metin: '#1a1a2e',
        'metin-ac': '#6b7280',
        sinir: '#f0e8f0',
        acik: '#f8f5ff',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'float': 'float 4s ease-in-out infinite',
        'ticker': 'ticker 22s linear infinite',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        ticker: { to: { transform: 'translateX(-50%)' } },
      }
    },
  },
  plugins: [],
}
export default config
