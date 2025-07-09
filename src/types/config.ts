import type { IconName } from '@/components/ui/icons';

// Animation types
export interface FramerMotionConfig {
  duration?: number;
  ease?: number[];
  type?: string;
  stiffness?: number;
  damping?: number;
  delay?: number;
}

export interface ReactSpringConfig {
  mass?: number;
  tension?: number;
  friction?: number;
  duration?: number;
  delay?: number;
}

export interface FontConfig {
  family: string;
  url: string;
  weight?: number;
  style?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
  icon: IconName;
}

export interface Testimonial {
  content: string;
  author: string;
  role: string;
  company: string;
}

export interface ProjectMetrics {
  downloads: string;
  rating: string;
  users: string;
}

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
    subtitle: string;
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
  projects: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      tags: string[];
      github?: string;
      url?: string;
      metrics?: ProjectMetrics;
    }>;
  };
  skills: {
    title: string;
    description: string;
    categories: Array<{
      name: string;
      items: string[];
    }>;
  };
  blog: {
    title: string;
    posts: Array<{
      title: string;
      excerpt: string;
      date: string;
      readTime?: string;
      tags?: string[];
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
    availability?: string;
  };
  footer: {
    text: string;
  };
}
