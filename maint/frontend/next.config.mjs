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
        hostname: 'ween-maintenance-backend',
        port: '8005',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'ween-maintenance-backend',
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


      // Root endpoints
      { source: '/api/service', destination: 'http://ween-maintenance-backend:8005/service/' },
      { source: '/api/vetrine', destination: 'http://ween-maintenance-backend:8005/vetrine/' },
      { source: '/api/rating', destination: 'http://ween-maintenance-backend:8005/rating/' },
      { source: '/api/site', destination: 'http://ween-maintenance-backend:8005/site/' },
      { source: '/api/fournisseur', destination: 'http://ween-maintenance-backend:8005/fournisseur/' },
      { source: '/api/freelancers', destination: 'http://ween-maintenance-backend:8005/freelancers/' },
      { source: '/api/quotations', destination: 'http://ween-maintenance-backend:8005/quotations/' },
      { source: '/api/settings', destination: 'http://ween-maintenance-backend:8005/settings/' },
      { source: '/api/blogs', destination: 'http://ween-maintenance-backend:8005/blogs/' },


      // Existing path-based rewrites
      { source: '/service/:path*', destination: 'http://ween-maintenance-backend:8005/service/:path*' },
      { source: '/vetrine/:path*', destination: 'http://ween-maintenance-backend:8005/vetrine/:path*' },
      { source: '/rating/:path*', destination: 'http://ween-maintenance-backend:8005/rating/:path*' },
      { source: '/site/:path*', destination: 'http://ween-maintenance-backend:8005/site/:path*' },
      { source: '/fournisseur/:path*', destination: 'http://ween-maintenance-backend:8005/fournisseur/:path*' },
      { source: '/freelancers/:path*', destination: 'http://ween-maintenance-backend:8005/freelancers/:path*' },
      { source: '/quotations/:path*', destination: 'http://ween-maintenance-backend:8005/quotations/:path*' },
      { source: '/settings/:path*', destination: 'http://ween-maintenance-backend:8005/settings/:path*' },
      { source: '/blogs/:path*', destination: 'http://ween-maintenance-backend:8005/blogs/:path*' },

      // Uploads & images
      { source: '/upload', destination: 'http://ween-maintenance-backend:8005/upload' },
      { source: '/images', destination: 'http://ween-maintenance-backend:8005/images' },
      { source: '/uploads/:path*', destination: 'http://ween-maintenance-backend:8005/uploads/:path*' },
      {
        source: '/api/:path*',
        destination: 'http://ween-maintenance-backend:8005/:path*',
      },
    ]
  }
  ,
}

export default nextConfig
