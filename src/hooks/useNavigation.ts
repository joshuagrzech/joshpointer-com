'use client';

import { create } from 'zustand'
import type { Route } from '@/types'

const routePaths: Record<Route, string> = {
  home: '/',
  about: '/about',
  projects: '/projects',
  skills: '/skills',
  contact: '/contact',
  blog: '/blog',
  links: '/links'
}

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
  const store = useNavigationStore()
  
  const navigate = (route: Route) => {
    store.setRoute(route)
    const path = store.getPath(route)
    window.history.pushState({}, '', path)
  }

  return {
    currentPath: store.currentPath,
    currentRoute: store.currentRoute,
    getPath: store.getPath,
    navigate,
    isReady: store.isReady
  }
} 