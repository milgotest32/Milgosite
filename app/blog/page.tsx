import type { Metadata } from 'next'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: 'Blog | milgo.',
  description: 'Milgo bloğu: çiğ süt faydaları, sağlıklı beslenme, tarifler ve çiftlik hayatından haberler. Doğal ve geleneksel gıda hakkında her şey.',
  openGraph: {
    title: 'Blog | milgo.',
    description: 'Çiğ süt, doğal beslenme ve çiftlik hayatından yazılar.',
  },
}

export default function BlogPage() {
  return <BlogClient />
}
