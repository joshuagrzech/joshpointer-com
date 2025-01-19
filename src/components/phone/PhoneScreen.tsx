'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import type { NavItem, Route, SelectedIcon } from '@/types';
import { OpenApp } from '@/components/phone/OpenApp';
import { HomeScreen } from '@/components/phone/HomeScreen';
import { useNavigation } from '@/hooks/useNavigation';
import { AnimatePresence } from 'framer-motion';
import StatusBar from './StatusBar';
import { useIsMobile } from '@/hooks/useIsMobile';

// Add constant for animation timing
const ANIMATION_DURATION = 500;

// Add helper function outside component
const calculateIconPosition = (index: number) => ({
  x: (index % 4) * (56 + 16) + 32,
  y: Math.floor(index / 4) * (56 + 16) + 160,
});

// Memoize child components
const MemoizedHomeScreen = memo(HomeScreen);
const MemoizedOpenApp = memo(OpenApp);

export default function PhoneScreen() {
  const { navigate, isReady, currentRoute } = useNavigation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isMobile = useIsMobile();
  // Combine app-related state
  const [appState, setAppState] = useState({
    activeApp: null as string | null,
    isOpen: false,
    selectedIcon: null as SelectedIcon | null,
  });

  // Handle route changes
  useEffect(() => {
    if (!isReady) return;

    if (currentRoute === 'home' && appState.isOpen) {
      setAppState((prev) => ({
        ...prev,
        isOpen: false,
        activeApp: null,
        selectedIcon: null,
      }));
    } else if (currentRoute !== 'home' && !appState.isOpen) {
      setAppState((prev) => ({
        ...prev,
        selectedIcon: {
          id: currentRoute,
          index: 0,
          rect: calculateIconPosition(0),
        },
        activeApp: currentRoute,
        isOpen: true,
      }));
    }
  }, [currentRoute, isReady, appState.isOpen]);

  const handleAppClick = useCallback(
    (item: NavItem, index: number) => {
      if (isTransitioning) return;

      setIsTransitioning(true);
      setAppState((prev) => ({
        ...prev,
        selectedIcon: {
          id: item.id,
          index,
          rect: calculateIconPosition(index),
        },
        activeApp: item.id,
        isOpen: true,
      }));

      navigate(item.id as Route);

      setTimeout(() => {
        setIsTransitioning(false);
      }, ANIMATION_DURATION);
    },
    [navigate, isTransitioning]
  );

  const handleAppClose = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setAppState((prev) => ({
      ...prev,
      isOpen: false,
    }));

    navigate('home');

    setTimeout(() => {
      setAppState((prev) => ({
        ...prev,
        activeApp: null,
        selectedIcon: null,
      }));
      setIsTransitioning(false);
    }, ANIMATION_DURATION);
  }, [navigate, isTransitioning]);

  if (!isReady) return null;

  return (
    <div
      className={`relative text-white rounded-[110px] overflow-hidden bg-secondary/50 ${
        !appState.isOpen
          ? 'w-[746px] h-[1594px]'
          : isMobile
            ? 'w-[746px] h-[1594px]' // Portrait mode on mobile
            : 'h-[748px] w-[1594px] rotate-90' // Landscape mode on desktop
      }`}
      style={{
        willChange: 'transform, opacity',
        pointerEvents: isTransitioning ? 'none' : 'auto',
      }}
    >
      <AnimatePresence mode="wait">
        {!appState.isOpen && (
          <>
            <StatusBar />
            <MemoizedHomeScreen key="home" handleAppClick={handleAppClick} />
          </>
        )}
        {appState.activeApp && (
          <MemoizedOpenApp
            key="app"
            activeApp={appState.activeApp}
            handleAppClose={handleAppClose}
            selectedIcon={appState.selectedIcon!}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
