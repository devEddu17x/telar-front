import type { NextConfig } from 'next'

const assetsHostname = process.env.ASSETS_HOSTNAME

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com'
      },
      ...(assetsHostname
        ? [
            {
              protocol: 'https' as const,
              hostname: assetsHostname
            }
          ]
        : [])
    ]
  }
}

export default nextConfig
