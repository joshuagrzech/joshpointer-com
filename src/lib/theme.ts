import type { Config } from "@/contexts/ConfigContext";

export function initializeTheme(config: Config) {
  const root = document.documentElement;
  const isDark = document.documentElement.classList.contains('dark');
  const colors = isDark ? config.theme.colors.dark : config.theme.colors.light;

  // Set color variables
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Set chart colors
  Object.entries(config.theme.colors.chart).forEach(([key, value]) => {
    root.style.setProperty(`--chart-${key}`, value);
  });

  // Set radius
  Object.entries(config.theme.radius).forEach(([key, value]) => {
    if (key === 'default') {
      root.style.setProperty('--radius', value);
    } else {
      root.style.setProperty(`--radius-${key}`, value);
    }
  });
}

export function updateThemeMode(config: Config, isDark: boolean) {
  const root = document.documentElement;
  const colors = isDark ? config.theme.colors.dark : config.theme.colors.light;

  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

export function loadFonts(fonts: Array<{ family: string; url: string; weight?: number; style?: string }>) {
  const fontFaces = fonts.map(({ family, url, weight = 400, style = 'normal' }) => {
    return `@font-face {
      font-family: '${family}';
      src: url('${url}') format('woff2');
      font-weight: ${weight};
      font-style: ${style};
      font-display: swap;
    }`;
  });

  const style = document.createElement('style');
  style.textContent = fontFaces.join('\n');
  document.head.appendChild(style);
}

export function applyFontVariables(fonts: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(fonts).forEach(([key, value]) => {
    root.style.setProperty(`--font-${key}`, value);
  });
} 