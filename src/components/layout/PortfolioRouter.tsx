'use client';

import { useEffect, useState } from 'react';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useIsMobile } from '@/hooks/useIsMobile';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone } from 'lucide-react';

const RootCanvasClient = dynamic(() => import('@/components/layout/RootCanvasClient'), {
  ssr: false,
});

const MobilePortfolio = dynamic(() => import('@/components/layout/MobilePortfolio'), {
  ssr: false,
});

export default function PortfolioRouter() {
  const { width, height } = useWindowSize();
  const isMobile = useIsMobile();
  const [forceDesktop, setForceDesktop] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  
  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setHasWebGL(!!gl);
  }, []);

  const isPortrait = height > width;
  const shouldUseMobile = (isMobile || isPortrait || !hasWebGL) && !forceDesktop;

  // If mobile/portrait or no WebGL, show mobile version by default
  // if (shouldUseMobile) {
  //   return (
  //     <div className="relative">
  //       <MobilePortfolio />
        
  //       {/* Option to switch to desktop mode */}
  //       {hasWebGL && (
  //         <Button
  //           onClick={() => setForceDesktop(true)}
  //           variant="outline"
  //           size="sm"
  //           className="fixed bottom-20 right-4 z-50 bg-background/80 backdrop-blur-sm"
  //         >
  //           <Monitor size={16} className="mr-2" />
  //           Desktop View
  //         </Button>
  //       )}
  //     </div>
  //   );
  // }

  // Desktop/landscape with WebGL support
  return (
    <div className="relative">
      <RootCanvasClient />
      
      {/* Option to switch to mobile mode */}
      <Button
        onClick={() => setForceDesktop(false)}
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
      >
        <Smartphone size={16} className="mr-2" />
        Mobile View
      </Button>
    </div>
  );
} 