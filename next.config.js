/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force no static export
  trailingSlash: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip admin routes during static generation
  exportPathMap: function () {
    return {
      '/': { page: '/' },
      '/products': { page: '/products' },
      '/recipes': { page: '/recipes' },
      '/our-story': { page: '/our-story' },
      '/sustainability': { page: '/sustainability' },
      '/contact': { page: '/contact' },
    };
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'ove-foods.firebasestorage.app',
      },
    ],
  },
}

module.exports = nextConfig
