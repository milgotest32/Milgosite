import { Nunito } from 'next/font/google'

const nunito = Nunito({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-nunito',
  display: 'swap',
})

export default function KategorilerLayout({ children }: { children: React.ReactNode }) {
  return <div className={nunito.variable}>{children}</div>
}
