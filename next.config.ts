import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  async rewrites() {
    return [
      // robots.txt → API route (sitemap.xml için rewrite YOK - route.ts kendisi halleder)
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ]
  },
}
export default nextConfig
