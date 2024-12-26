import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { getBrandingConfig } from "@/lib/config";

// Dynamic imports with loading states and chunking
const ScrollProgress = dynamic(
  () =>
    import("@/components/ui/ScrollProgress").then((mod) => ({
      default: mod.ScrollProgress,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-1 bg-gray-200 animate-pulse"
        aria-label="Loading scroll progress"
      />
    ),
  }
);

const RootCanvasClient = dynamic(
  () => import("@/components/layout/RootCanvasClient"),
  {
    ssr: false,
    loading: () => (
      <div
        className="fixed inset-0 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse"
        aria-label="Loading canvas"
      />
    ),
  }
);

const NavigationSync = dynamic(
  () => import("@/components/layout/NavigationSync"),
  {
    ssr: false,
    loading: () => null,
  }
);

const ThemeToggle = dynamic(() => import("@/components/ui/ThemeToggle"), {
  ssr: false,
  loading: () => (
    <div
      className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"
      aria-label="Loading theme toggle"
    />
  ),
});

// Metadata configuration with improved SEO
export function generateMetadata(): Metadata {
  const branding = getBrandingConfig();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | ${branding.metadata.title}`,
      default: branding.metadata.title,
    },
    description: branding.metadata.description,
    manifest: "/manifest.json",
    applicationName: branding.name,
    keywords: ["portfolio", "developer", "web development"],
    authors: [{ name: branding.name }],
    creator: branding.name,
    publisher: branding.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    openGraph: {
      title: branding.metadata.title,
      description: branding.metadata.description,
      type: "website",
      siteName: branding.metadata.title,
      locale: "en_US",
      url: baseUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: branding.metadata.title,
      description: branding.metadata.description,
      creator: "@yourtwitterhandle",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}

// Viewport configuration with improved mobile support
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  colorScheme: "light dark",
};

// Server Component for loading states
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse" role="status" aria-label="Loading">
        Loading...
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="antialiased scroll-smooth"
    >
      <head />
      <body className="overflow-x-hidden">
        <Suspense fallback={<LoadingFallback />}>
          <Providers>
            {/* Navigation and UI Elements with improved loading states */}
            <Suspense fallback={null}>
              <NavigationSync />
            </Suspense>

            <Suspense
              fallback={
                <div
                  className="h-1 bg-gray-200 animate-pulse"
                  role="progressbar"
                />
              }
            >
              <ScrollProgress />
            </Suspense>

            <Suspense
              fallback={
                <div
                  className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"
                  role="status"
                />
              }
            >
              <ThemeToggle />
            </Suspense>

            <main className="relative w-full h-screen">
              {/* Full screen canvas with GPU acceleration */}
              <div
                className="fixed inset-0 w-full h-full"
                style={{ zIndex: 0 }}
              >
                <Suspense
                  fallback={
                    <div
                      className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse"
                      role="status"
                      aria-label="Loading canvas"
                    />
                  }
                >
                  <RootCanvasClient>{children}</RootCanvasClient>
                </Suspense>
              </div>
            </main>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
