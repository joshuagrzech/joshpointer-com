"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { IconName } from '@/components/ui/icons';

// Animation types
interface FramerMotionConfig {
  duration?: number;
  ease?: number[];
  type?: string;
  stiffness?: number;
  damping?: number;
  delay?: number;
}

interface ReactSpringConfig {
  mass?: number;
  tension?: number;
  friction?: number;
  duration?: number;
  delay?: number;
}

interface FontConfig {
  family: string;
  url: string;
  weight?: number;
  style?: string;
}

interface ProcessStep {
  title: string;
  description: string;
  icon: IconName;
}

interface Testimonial {
  content: string;
  author: string;
  role: string;
  company: string;
}

// Define the configuration type based on our config.json structure
export interface Config {
  theme: {
    colors: {
      light: Record<string, string>;
      dark: Record<string, string>;
      chart: Record<string, string>;
    };
    radius: Record<string, string>;
    animation: {
      framerMotion: {
        default: FramerMotionConfig;
        slow: FramerMotionConfig;
        spring: FramerMotionConfig;
      };
      reactSpring: {
        default: ReactSpringConfig;
        slow: ReactSpringConfig;
      };
      timing: Record<string, number>;
      easings: Record<string, number[]>;
    };
    fonts: {
      custom: FontConfig[];
      variables: Record<string, string>;
    };
  };
  branding: {
    name: string;
    tagline: string;
    description: string;
    logo: string;
    favicon: string;
    metadata: {
      title: string;
      description: string;
      language: string;
    };
  };
  ui: {
    buttons: {
      variants: Record<string, string>;
      sizes: Record<string, string>;
    };
    badges: {
      variants: Record<string, string>;
    };
  };
  navigation: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
  hero: {
    title: string;
    description: string;
    cta: {
      label: string;
      url: string;
    };
  };
  about: {
    title: string;
    content: string;
  };
  process: {
    title: string;
    steps: ProcessStep[];
  };
  testimonials: {
    title: string;
    items: Testimonial[];
  };
  projects: Array<{
    title: string;
    description: string;
    tech: string;
    image: string;
    github: string;
    demo: string;
  }>;
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    databases: string[];
  };
  blog: {
    title: string;
    posts: Array<{
      title: string;
      excerpt: string;
      date: string;
    }>;
  };
  links: Array<{
    title: string;
    url: string;
    icon: string;
  }>;
  contact: {
    title: string;
    description: string;
    email: string;
  };
  footer: {
    copyright: string;
  };
}

interface ConfigContextType {
  config: Config | null;
  isLoading: boolean;
  error: Error | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfigContextType>({
    config: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    
    async function loadConfig() {
      try {
        const response = await fetch('/config.json');
        if (!response.ok) {
          throw new Error('Failed to load configuration');
        }
        const config = await response.json();
        if (mounted) {
          setState({ config, isLoading: false, error: null });
        }
      } catch (error) {
        console.error('Error loading config:', error);
        if (mounted) {
          setState({ config: null, isLoading: false, error: error as Error });
        }
      }
    }

    loadConfig();
    return () => {
      mounted = false;
    };
  }, []);

  const value = React.useMemo(() => state, [state]);

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
} 