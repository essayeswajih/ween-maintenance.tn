/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'backend',
        port: '8005',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '8005',
        pathname: '/images/**',
      },
    ],
  },
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ]
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:8005/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'http://backend:8005/auth/:path*',
      },
      {
        source: '/vetrine/:path*',
        destination: 'http://backend:8005/vetrine/:path*',
      },
      {
        source: '/service/:path*',
        destination: 'http://backend:8005/service/:path*',
      },
      {
        source: '/rating/:path*',
        destination: 'http://backend:8005/rating/:path*',
      },
      {
        source: '/site/:path*',
        destination: 'http://backend:8005/site/:path*',
      },
      {
        source: '/fournisseur/:path*',
        destination: 'http://backend:8005/fournisseur/:path*',
      },
      {
        source: '/freelancers/:path*',
        destination: 'http://backend:8005/freelancers/:path*',
      },
      {
        source: '/quotations/:path*',
        destination: 'http://backend:8005/quotations/:path*',
      },
      {
        source: '/settings/:path*',
        destination: 'http://backend:8005/settings/:path*',
      },
      {
        source: '/upload',
        destination: 'http://backend:8005/upload',
      },
      {
        source: '/images',
        destination: 'http://backend:8005/images',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://backend:8005/uploads/:path*',
      },
    ]
  },
}

export default nextConfig
