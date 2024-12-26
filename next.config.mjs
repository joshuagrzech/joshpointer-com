/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Disable production source maps for better performance
  productionBrowserSourceMaps: false,
  // Optimize packages by enabling modularizeImports
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
      preventFullImport: true,
    },
  },
  // Enable experimental features for better performance
  experimental: {
    // Enable optimizeCss for better CSS optimization
    optimizeCss: true,
    // Enable modern optimizations
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // Improved bundling
    serverActions: {
      bodySizeLimit: '2mb'
    },
    // Enable modern JavaScript features
    serverComponentsExternalPackages: ['sharp'],
    // Optimize fonts
    fontLoaders: [
      { loader: '@next/font/google' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Headers for better security and performance
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains'
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
          value: 'strict-origin-when-cross-origin'
        },
      ],
    },
  ],
  // Compression for better performance
  compress: true,
  // Powered by header for better security
  poweredByHeader: false,
};

export default nextConfig;
