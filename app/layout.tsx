import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { getBrandingConfig } from '@/lib/config';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { TransparencyProvider } from '@/components/ui/TransparencyToggle';

// Dynamic imports with loading states and chunking
const ScrollProgress = dynamic(
  () =>
    import('@/components/ui/ScrollProgress').then((mod) => ({
      default: mod.ScrollProgress,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-1 bg-gray-200 animate-pulse" aria-label="Loading scroll progress" />
    ),
  }
);

const RootCanvasClient = dynamic(() => import('@/components/layout/RootCanvasClient'), {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse"
      aria-label="Loading canvas"
    />
  ),
});

const PortfolioRouter = dynamic(() => import('@/components/layout/PortfolioRouter'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">Loading portfolio...</div>
    </div>
  ),
});

const NavigationSync = dynamic(() => import('@/components/layout/NavigationSync'), {
  ssr: false,
  loading: () => null,
});

const ThemeToggle = dynamic(() => import('@/components/ui/ThemeToggle'), {
  ssr: false,
  loading: () => (
    <div
      className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"
      aria-label="Loading theme toggle"
    />
  ),
});

const TransparencyToggle = dynamic(() => import('@/components/ui/TransparencyToggle'), {
  ssr: false,
  loading: () => (
    <div
      className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"
      aria-label="Loading transparency toggle"
    />
  ),
});

// Enhanced metadata for better SEO
const branding = getBrandingConfig();

export const metadata: Metadata = {
  metadataBase: new URL('https://joshpointer.com'),
  title: {
    default: branding.metadata.title,
    template: `%s | ${branding.name}`,
  },
  description: branding.metadata.description,
  keywords: [
    'mobile developer',
    'react native',
    'ios developer',
    'portfolio',
    'software engineer',
    'javascript',
    'typescript',
    'swift',
    'mobile apps',
    'three.js',
    'webgl',
    '3d graphics',
    'interactive portfolio',
    'frontend developer',
    'full stack developer',
  ],
  authors: [{ name: branding.name, url: 'https://joshpointer.com' }],
  creator: branding.name,
  publisher: branding.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://joshpointer.com',
    title: branding.metadata.title,
    description: branding.metadata.description,
    siteName: branding.name,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${branding.name} - ${branding.tagline}`,
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 600,
        height: 600,
        alt: `${branding.name} - ${branding.tagline}`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@joshpointer',
    creator: '@joshpointer',
    title: branding.metadata.title,
    description: branding.metadata.description,
    images: ['/og-image.png'],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://joshpointer.com',
    languages: {
      'en-US': '/en-US',
    },
  },
  category: 'technology',
  classification: 'portfolio',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': branding.name,
    'application-name': branding.name,
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
  },
};

// Enhanced viewport configuration with improved mobile support
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  colorScheme: 'light dark',
};

// Enhanced loading fallback with better accessibility
function LoadingFallback() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading portfolio...</p>
      </div>
    </div>
  );
}

export default function RootLayout() {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased scroll-smooth">
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/Inter-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Inter-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Inter-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//vercel.live" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Manifest and icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: branding.name,
              jobTitle: branding.tagline,
              description: branding.description,
              url: 'https://joshpointer.com',
              sameAs: [
                'https://github.com/joshpointer',
                'https://linkedin.com/in/joshpointer',
                'https://twitter.com/joshpointer',
              ],
              knowsAbout: [
                'React Native',
                'iOS Development',
                'JavaScript',
                'TypeScript',
                'Three.js',
                'WebGL',
              ],
            }),
          }}
        />
      </head>
      <Analytics />
      <SpeedInsights />
      <body className="overflow-x-hidden">
        <Suspense fallback={<LoadingFallback />}>
          <TransparencyProvider>
            <Providers>
              {/* Navigation and UI Elements with improved loading states */}
              <Suspense fallback={null}>
                <NavigationSync />
              </Suspense>

              {/* Main content with error boundary */}
              <Suspense fallback={<LoadingFallback />}>
                <PortfolioRouter />
              </Suspense>

              {/* UI Controls */}
              <Suspense fallback={null}>
                <div className="fixed top-4 right-4 z-50 flex gap-2">
                  <ThemeToggle />
                  <TransparencyToggle />
                </div>
              </Suspense>

              {/* Scroll progress indicator */}
              <Suspense fallback={null}>
                <ScrollProgress />
              </Suspense>
            </Providers>
          </TransparencyProvider>
        </Suspense>
      </body>
    </html>
  );
}
