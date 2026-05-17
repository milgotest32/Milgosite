import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pembe: { DEFAULT: '#F4A7B9', koy: '#E07090', acik: '#FEF0F4' },
        mavi: { DEFAULT: '#7EC8E3', koy: '#3B9FCC', acik: '#EBF7FC' },
        lav: '#F0EEF8',
        metin: { DEFAULT: '#1C1B2E', '2': '#6B7280' },
        sinir: '#F0ECF5',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
