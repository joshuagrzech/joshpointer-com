'use client';

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useConfig } from "@/contexts/ConfigContext";
import { useEffect } from "react";
import { initializeTheme, updateThemeMode, loadFonts, applyFontVariables } from "@/lib/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  const { config, isLoading } = useConfig();

  useEffect(() => {
    if (!isLoading && config) {
      initializeTheme(config);

      if (config.theme.fonts?.custom) {
        loadFonts(config.theme.fonts.custom);
      }

      if (config.theme.fonts?.variables) {
        applyFontVariables(config.theme.fonts.variables);
      }
    }
  }, [config, isLoading]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class' &&
          config
        ) {
          const isDark = document.documentElement.classList.contains('dark');
          updateThemeMode(config, isDark);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [config]);

  if (isLoading || !config) {
    return null;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
