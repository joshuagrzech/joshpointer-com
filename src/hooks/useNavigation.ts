'use client';

import { create } from 'zustand'
import type { Route } from '@/types'
import { useEffect, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { persist } from 'zustand/middleware';

// Define route paths with type safety
const routePaths = {
  home: '/',
  about: '/about',
  projects: '/projects',
  skills: '/skills',
  contact: '/contact',
  blog: '/blog',
  links: '/links',
  admin: '/admin'
} as const;

// Create a type-safe mapping of paths to routes
const pathToRoute = Object.entries(routePaths).reduce<Record<string, Route>>(
  (acc, [route, path]) => ({
    ...acc,
    [path]: route as Route
  }), 
  {}
);

interface NavigationState {
  currentRoute: Route;
  currentPath: string;
  isReady: boolean;
  previousRoute: Route | null;
  setRoute: (route: Route) => void;
  setPath: (path: string) => void;
  setReady: (ready: boolean) => void;
  getPath: (route: Route) => string;
}

// Create a persisted store with type safety
export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      currentRoute: 'home',
      currentPath: '/',
      isReady: false,
      previousRoute: null,
      setRoute: (route) => set((state) => ({ 
        currentRoute: route,
        previousRoute: state.currentRoute
      })),
      setPath: (path) => set({ currentPath: path }),
      setReady: (ready) => set({ isReady: ready }),
      getPath: (route) => routePaths[route]
    }),
    {
      name: 'navigation-store',
      partialize: (state) => ({ 
        currentRoute: state.currentRoute,
        currentPath: state.currentPath,
        previousRoute: state.previousRoute
      })
    }
  )
);

export function useNavigation() {
  const store = useNavigationStore();
  const pathname = usePathname();
  
  // Memoize the navigation function
  const navigate = useCallback((route: Route) => {
    if (route === store.currentRoute) return;
    
    // Update route in store
    store.setRoute(route);
    
    // Update URL without triggering Next.js navigation
    const path = store.getPath(route);
    window.history.replaceState(null, '', path);
  }, [store]);

  // Handle initial path sync
  useEffect(() => {
    if (!pathname) return;

    const route = pathToRoute[pathname] || 'home';
    if (route !== store.currentRoute) {
      store.setRoute(route);
      store.setPath(pathname);
    }
    
    if (!store.isReady) {
      store.setReady(true);
    }
  }, [pathname, store]);

  // Memoize the return value
  const navigationState = useMemo(() => ({
    currentPath: store.currentPath,
    currentRoute: store.currentRoute,
    previousRoute: store.previousRoute,
    getPath: store.getPath,
    navigate,
    isReady: store.isReady
  }), [
    store.currentPath,
    store.currentRoute,
    store.previousRoute,
    store.getPath,
    store.isReady,
    navigate
  ]);

  return navigationState;
} 