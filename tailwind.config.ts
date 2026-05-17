import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gece: '#080f22',
        lacivert: '#0d1b3e',
        mavi: '#1e3a6e',
        pembe: '#e8a4b8',
        'pembe-ac': '#f5c8d8',
        'pembe-koy': '#c4768e',
        lila: '#b8a4d8',
        'lila-ac': '#d4c8f0',
        beyaz: '#f8f4ff',
        gri: '#8a92a8',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
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
