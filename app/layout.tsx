import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import dynamic from 'next/dynamic';

const ScrollProgress = dynamic(() => import("@/components/ui/ScrollProgress"), { ssr: false });
const RootCanvasClient = dynamic(() => import("@/components/layout/RootCanvasClient"), { 
  ssr: false,
});
const NavigationSync = dynamic(() => import("@/components/layout/NavigationSync"), { ssr: false });

export const metadata: Metadata = {
  title: "Mobile Software Engineer Portfolio",
  description: "React Native & iOS Developer Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NavigationSync />
          <ScrollProgress />
          <main className="relative w-full h-screen">
          
            {/* Content overlay */}
            <div className="pointer-events-none absolute top-0 right-0 w-full h-full">
              <div style={{marginLeft: '50vw'}} className="pointer-events-auto w-1/2 md:w-1/2 hidden md:block">
                {children}
              </div>
            </div>
              {/* Full screen canvas */}
              <div className="fixed inset-0 w-full h-full">
              <RootCanvasClient />
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
} 