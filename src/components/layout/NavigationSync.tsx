'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useNavigationStore } from '@/hooks/useNavigation';
import { Route } from '@/types';

const pathToRoute: Record<string, Route> = {
  '/': 'home',
  '/about': 'about',
  '/projects': 'projects',
  '/skills': 'skills',
  '/contact': 'contact',
  '/blog': 'blog',
  '/links': 'links'
};

export default function NavigationSync() {
  const pathname = usePathname();
  const { setPath, setReady, setRoute } = useNavigationStore();

  // Sync path and route when pathname changes
  useEffect(() => {
    const path = pathname ?? '/';
    setPath(path);
    const route = pathToRoute[path] || 'home';
    setRoute(route);
  }, [pathname, setPath, setRoute]);

  // Set ready state once mounted
  useEffect(() => {
    setReady(true);
    return () => setReady(false);
  }, [setReady]);

  return null;
} 