import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets-dumi-dev.edducode.me'
      }
    ]
  }
}

export default nextConfig
