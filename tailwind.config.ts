import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['var(--font-syne)', 'Syne', 'system-ui', 'sans-serif'],
      },
      colors: {
        p: '#E8567A', p2: '#F4A7B9', p3: '#FEE8EF',
        b: '#5BA4CF', b2: '#A8D4F0', b3: '#EBF5FC',
        w: '#FDFBF9', d: '#1A0A12', g: '#7A6070',
      },
    },
  },
  plugins: [],
}
export default config
