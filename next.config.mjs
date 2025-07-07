/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
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
    '@react-three/drei': {
      transform: '@react-three/drei/{{member}}',
      preventFullImport: true,
    },
    'framer-motion': {
      transform: 'framer-motion/{{member}}',
      preventFullImport: true,
    },
  },
  // Enable experimental features for better performance
  experimental: {
    // Enable optimizeCss for better CSS optimization
    optimizeCss: true,
    // Enable modern optimizations
    optimizePackageImports: ['lucide-react', 'framer-motion', '@react-three/drei'],
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
    // Enable webpack optimizations
    webpackBuildWorker: true,
    // Enable turbo for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
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
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        },
        // Performance headers
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        },
      ],
    },
    // Cache static assets
    {
      source: '/fonts/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ],
    },
    {
      source: '/public/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ],
    },
  ],
  // Compression for better performance
  compress: true,
  // Powered by header for better security
  poweredByHeader: false,
  // Optimize bundle size
  swcMinify: true,
  // Enable webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize for production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: 'three',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;
