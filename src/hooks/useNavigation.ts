'use client';

import { create } from 'zustand'
import type { Route } from '@/types'
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const routePaths: Record<Route, string> = {
  home: '/',
  about: '/about',
  projects: '/projects',
  skills: '/skills',
  contact: '/contact',
  blog: '/blog',
  links: '/links'
}

const pathToRoute: Record<string, Route> = Object.entries(routePaths).reduce((acc, [route, path]) => ({
  ...acc,
  [path]: route as Route
}), {} as Record<string, Route>)

interface NavigationState {
  currentRoute: Route;
  currentPath: string;
  isReady: boolean;
  setRoute: (route: Route) => void;
  setPath: (path: string) => void;
  setReady: (ready: boolean) => void;
  getPath: (route: Route) => string;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentRoute: 'home',
  currentPath: '/',
  isReady: false,
  setRoute: (route) => set({ currentRoute: route }),
  setPath: (path) => set({ currentPath: path }),
  setReady: (ready) => set({ isReady: ready }),
  getPath: (route) => routePaths[route]
}))

export function useNavigation() {
  const store = useNavigationStore();
  const pathname = usePathname();
  
  useEffect(() => {
    if (pathname) {
      const route = pathToRoute[pathname] || 'home';
      store.setRoute(route);
      store.setPath(pathname);
      store.setReady(true);
    }
  }, [pathname]);

  const navigate = (route: Route) => {
    store.setRoute(route);
    const path = store.getPath(route);
    window.history.pushState({}, '', path);
  }

  return {
    currentPath: store.currentPath,
    currentRoute: store.currentRoute,
    getPath: store.getPath,
    navigate,
    isReady: store.isReady
  }
} 