'use client';

import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useEffect, useCallback, memo } from 'react';
import { getThemeConfig } from '@/lib/config';
import { initializeTheme, updateThemeMode, loadFonts } from '@/lib/theme';

// Memoized theme observer component for better performance
const ThemeObserver = memo(() => {
  const theme = getThemeConfig();

  const handleThemeChange = useCallback((mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const isDark = document.documentElement.classList.contains('dark');
        updateThemeMode(isDark);
      }
    });
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(handleThemeChange);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Initialize theme and fonts
    initializeTheme();
    if (theme.fonts.custom.length > 0) {
      loadFonts(theme.fonts.custom);
    }

    return () => observer.disconnect();
  }, [handleThemeChange, theme.fonts.custom]);

  return null;
});

ThemeObserver.displayName = 'ThemeObserver';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <ThemeObserver />
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
