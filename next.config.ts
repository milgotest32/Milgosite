import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ]
  },
  async redirects() {
    return [
    { source: '/products/milgo-cig-sut-2-lt', destination: '/urun/milgo-cig-sut-2l', permanent: true },
    { source: '/products/sade-tereyagi', destination: '/urun/sade-tereyagi', permanent: true },
    { source: '/products/sarimsakli-biberiyeli', destination: '/urun/sarimsakli-biberiyeli-tereyagi', permanent: true },
    { source: '/products/milgo-taze-surulebilir-laktozsuz', destination: '/urun/laktozsuz-peynir', permanent: true },
    { source: '/products/sade-peynir', destination: '/urun/sade-surullebilir-peynir', permanent: true },
    { source: '/products/milgo-pulbiberli-kekikli-tereyagi', destination: '/urun/sarimsakli-biberiyeli-tereyagi', permanent: true },
    { source: '/products/siyah-zeytinli-ve-kekikli', destination: '/urun/sade-surullebilir-peynir', permanent: true },
    { source: '/collections/all', destination: '/urunler', permanent: true },
    { source: '/collections/cig-sut', destination: '/kategoriler/cig-sut', permanent: true },
    { source: '/collections/peynir', destination: '/kategoriler/peynir', permanent: true },
    { source: '/collections/tereyagi', destination: '/kategoriler/tereyagi', permanent: true },
    { source: '/products/sarimsakli-kekikli', destination: '/urun/sade-surullebilir-peynir', permanent: true },
    ]
  },
}
export default nextConfig
