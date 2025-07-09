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
  title: branding.metadata.title,
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
  ],
  authors: [{ name: branding.name }],
  creator: branding.name,
  publisher: branding.name,
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
    title: branding.metadata.title,
    description: branding.metadata.description,
    url: 'https://joshpointer.com',
    siteName: branding.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${branding.name} - ${branding.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: branding.metadata.title,
    description: branding.metadata.description,
    creator: '@joshpointer',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://joshpointer.com',
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
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
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

              <Suspense fallback={<div />}>
                <ScrollProgress />
              </Suspense>

              <Suspense fallback={<div />}>
                <ThemeToggle route={'home'} />
              </Suspense>

              <Suspense fallback={<div />}>
                <TransparencyToggle route={'home'} />
              </Suspense>

              <main className="relative w-full h-screen">
                {/* Responsive portfolio with progressive enhancement */}
                <div
                  className="fixed inset-0 w-full h-full"
                  style={{ zIndex: 0 }}
                  aria-hidden="true"
                >
                  <Suspense fallback={<div />}>
                    <PortfolioRouter />
                  </Suspense>
                </div>
              </main>
            </Providers>
          </TransparencyProvider>
        </Suspense>
      </body>
    </html>
  );
}
