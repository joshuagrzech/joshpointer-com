'use client';

import { useEffect, useCallback } from 'react';

// Performance monitoring interface
interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fmp: number; // First Meaningful Paint
}

// User interaction tracking
interface UserInteraction {
  type: 'navigation' | 'app_open' | 'theme_change' | 'transparency_toggle' | 'scroll' | 'click';
  target?: string;
  value?: any;
  timestamp: number;
}

// Analytics configuration
interface AnalyticsConfig {
  enabled: boolean;
  trackPerformance: boolean;
  trackInteractions: boolean;
  trackErrors: boolean;
  sampleRate: number;
}

class Analytics {
  private config: AnalyticsConfig;
  private interactions: UserInteraction[] = [];
  private performanceMetrics: Partial<PerformanceMetrics> = {};

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.init();
  }

  private init() {
    if (!this.config.enabled) return;

    // Track performance metrics
    if (this.config.trackPerformance) {
      this.trackPerformance();
    }

    // Track user interactions
    if (this.config.trackInteractions) {
      this.trackInteractions();
    }

    // Track errors
    if (this.config.trackErrors) {
      this.trackErrors();
    }
  }

  private trackPerformance() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcp = entries[entries.length - 1];
      if (fcp) {
        this.performanceMetrics.fcp = fcp.startTime;
        this.log('Performance', 'FCP', fcp.startTime);
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lcp = entries[entries.length - 1];
      if (lcp) {
        this.performanceMetrics.lcp = lcp.startTime;
        this.log('Performance', 'LCP', lcp.startTime);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const firstInputEntry = entry as PerformanceEventTiming;
        if (firstInputEntry.processingStart && firstInputEntry.startTime) {
          const fid = firstInputEntry.processingStart - firstInputEntry.startTime;
          this.performanceMetrics.fid = fid;
          this.log('Performance', 'FID', fid);
        }
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let cls = 0;
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
      this.performanceMetrics.cls = cls;
      this.log('Performance', 'CLS', cls);
    }).observe({ entryTypes: ['layout-shift'] });

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      this.performanceMetrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      this.log('Performance', 'TTFB', this.performanceMetrics.ttfb);
    }
  }

  private trackInteractions() {
    // Track navigation changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.trackInteraction('navigation', window.location.pathname);
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.trackInteraction('navigation', window.location.pathname);
    };

    // Track clicks on important elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const className = target.className;
      const id = target.id;

      // Track specific interactions
      if (tagName === 'button' || tagName === 'a') {
        this.trackInteraction('click', `${tagName}:${className}:${id}`);
      }
    });

    // Track scroll events (throttled)
    let scrollTimeout: NodeJS.Timeout;
    document.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollDepth = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        this.trackInteraction('scroll', `depth:${scrollDepth}%`);
      }, 100);
    });
  }

  private trackErrors() {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.log('Error', 'JavaScript', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack,
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.log('Error', 'Promise Rejection', {
        reason: event.reason,
        promise: event.promise,
      });
    });
  }

  public trackInteraction(type: UserInteraction['type'], target?: string, value?: any) {
    if (!this.config.enabled || Math.random() > this.config.sampleRate) return;

    const interaction: UserInteraction = {
      type,
      target,
      value,
      timestamp: Date.now(),
    };

    this.interactions.push(interaction);
    this.log('Interaction', type, { target, value });
  }

  public trackCustomEvent(category: string, action: string, label?: string, value?: number) {
    if (!this.config.enabled) return;

    this.log('Custom Event', `${category}:${action}`, { label, value });
  }

  public getPerformanceMetrics(): Partial<PerformanceMetrics> {
    return { ...this.performanceMetrics };
  }

  public getInteractions(): UserInteraction[] {
    return [...this.interactions];
  }

  public clearInteractions() {
    this.interactions = [];
  }

  private log(category: string, action: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${category}: ${action}`, data);
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Google Analytics, Mixpanel, etc.
      // gtag('event', action, { category, ...data });
    }
  }
}

// Create analytics instance
export const analytics = new Analytics({
  enabled:
    process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
  trackPerformance: true,
  trackInteractions: true,
  trackErrors: true,
  sampleRate: 1.0, // Track 100% of events
});

// React hooks for analytics
export function useAnalytics() {
  const trackEvent = useCallback((type: UserInteraction['type'], target?: string, value?: any) => {
    analytics.trackInteraction(type, target, value);
  }, []);

  const trackCustomEvent = useCallback(
    (category: string, action: string, label?: string, value?: number) => {
      analytics.trackCustomEvent(category, action, label, value);
    },
    []
  );

  return { trackEvent, trackCustomEvent };
}

// Performance monitoring hook
export function usePerformanceMonitoring() {
  useEffect(() => {
    const metrics = analytics.getPerformanceMetrics();

    // Log performance metrics when they're available
    if (Object.keys(metrics).length > 0) {
      console.log('Performance Metrics:', metrics);
    }
  }, []);

  return analytics.getPerformanceMetrics();
}
