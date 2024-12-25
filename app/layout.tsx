import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { ConfigProvider } from "@/contexts/ConfigContext";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import {Config} from "@/contexts/ConfigContext"

// Dynamic imports with loading states and chunking
const ScrollProgress = dynamic(
  () => import("@/components/ui/ScrollProgress"),
  {
    ssr: false,
    loading: () => <div className="h-1 bg-gray-200 animate-pulse" />
  }
);

const RootCanvasClient = dynamic(
  () => import("@/components/layout/RootCanvasClient"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
    )
  }
);

const NavigationSync = dynamic(
  () => import("@/components/layout/NavigationSync"),
  { 
    ssr: false,
    loading: () => null 
  }
);

const ThemeToggle = dynamic(
  () => import("@/components/ui/ThemeToggle"),
  {
    ssr: false,
    loading: () => <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
  }
);

// Optimized config fetching with edge caching
const CONFIG_CACHE_TIME = 3600;
let cachedConfig: Config | null = null;
let lastFetchTime = 0;

async function getConfig() {
  const now = Date.now();
  if (cachedConfig && now - lastFetchTime < CONFIG_CACHE_TIME * 1000) {
    return cachedConfig;
  }

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/config.json",
      { 
        next: { 
          revalidate: CONFIG_CACHE_TIME,
          tags: ['config']
        }
      }
    );
    if (!response.ok) throw new Error("Failed to load configuration");
    cachedConfig = await response.json();
    lastFetchTime = now;
    return cachedConfig as Config;
  } catch (error) {
    console.error('Config fetch error:', error);
    return {
      branding: {
        metadata: {
          title: "Portfolio",
          description: "Developer Portfolio",
        }
      }
    } as Config;
  }
}

// Metadata configuration
export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  
  return {
    title: {
      template: `%s | ${config.branding.metadata.title}`,
      default: config.branding.metadata.title,
    },
    description: config.branding.metadata.description,
    manifest: '/manifest.json',
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      title: config.branding.metadata.title,
      description: config.branding.metadata.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.branding.metadata.title,
      description: config.branding.metadata.description,
    },
  };
}

// Viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Template component for error boundaries
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  if (process.env.NODE_ENV === 'development') {
    return children;
  }

  return (
    <Suspense fallback={null}>
      {children}
    </Suspense>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className="antialiased"
    >
      <head />
      <body className="overflow-x-hidden">
        <ErrorBoundary>
          <ConfigProvider>
            <Providers>
              {/* Navigation and UI Elements */}
              <Suspense fallback={null}>
                <NavigationSync />
              </Suspense>
              
              <Suspense fallback={<div className="h-1 bg-gray-200 animate-pulse" />}>
                <ScrollProgress />
              </Suspense>
              
              <Suspense fallback={<div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />}>
                <ThemeToggle />
              </Suspense>

              <main className="relative w-full h-screen">
                {/* Content overlay with performance optimizations */}
                <div 
                  className="pointer-events-none absolute top-0 right-0 w-full h-full"
                  style={{ 
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <div
                    style={{ 
                      marginLeft: "50vw",
                      willChange: 'transform',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden'
                    }}
                    className="pointer-events-auto w-1/2 md:w-1/2 hidden md:block scroll-smooth"
                  >
                    <Suspense fallback={
                      <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
                    }>
                      {children}
                    </Suspense>
                  </div>
                </div>

                {/* Full screen canvas with optimizations */}
                <div 
                  className="fixed inset-0 w-full h-full"
                  style={{ 
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    containIntrinsicSize: '100vh',
                    contain: 'paint'
                  }}
                >
                  <Suspense fallback={
                    <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
                  }>
                    <RootCanvasClient />
                  </Suspense>
                </div>
              </main>
            </Providers>
          </ConfigProvider>
        </ErrorBoundary>

    
      </body>
    </html>
  );
}