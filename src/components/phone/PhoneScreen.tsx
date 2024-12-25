"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { NavItem, Route, SelectedIcon } from "@/types";
import { OpenApp } from "@/components/phone/OpenApp";
import HomeScreen from "@/components/phone/HomeScreen";
import { useNavigation } from "@/hooks/useNavigation";
import { useTheme } from "next-themes";

interface PhoneScreenProps {
  setBackgroundGradient?: (gradient: [string, string]) => void;
}

// Add constant for animation timing
const ANIMATION_DURATION = 300;

// Add helper function outside component
const calculateIconPosition = (index: number) => ({
  x: (index % 4) * (56 + 16) + 32,
  y: Math.floor(index / 4) * (56 + 16) + 160,
});

export default function PhoneScreen({
  setBackgroundGradient,
}: PhoneScreenProps) {
  const { theme } = useTheme();
  const { navigate, isReady, currentRoute } = useNavigation();

  // Combine app-related state
  const [appState, setAppState] = useState({
    activeApp: null as string | null,
    isOpen: false,
    selectedIcon: null as SelectedIcon | null,
    isNavigating: false,
  });

  // Simplified navigation effect
  useEffect(() => {
    if (!isReady || appState.isNavigating) return;

    if (currentRoute === "home" && appState.isOpen) {
      setAppState((prev) => ({
        ...prev,
        isOpen: false,
        activeApp: null,
        selectedIcon: null,
      }));
    } else if (currentRoute !== "home" && !appState.isOpen) {
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
  }, [currentRoute, isReady, appState.isOpen, appState.isNavigating]);

  const handleAppClick = useCallback(
    (item: NavItem, index: number) => {
      if (appState.isNavigating) return;

      setAppState((prev) => ({
        ...prev,
        isNavigating: true,
        selectedIcon: {
          id: item.id,
          index,
          rect: calculateIconPosition(index),
        },
        activeApp: item.id,
        isOpen: true,
      }));

      const timer = setTimeout(() => {
        navigate(item.id as Route);
        setAppState((prev) => ({ ...prev, isNavigating: false }));
      }, ANIMATION_DURATION);

      return () => clearTimeout(timer);
    },
    [navigate, appState.isNavigating]
  );

  const handleAppClose = useCallback(() => {
    if (appState.isNavigating) return;

    setAppState((prev) => ({ ...prev, isNavigating: true, isOpen: false }));

    const timer = setTimeout(() => {
      setAppState((prev) => ({
        ...prev,
        activeApp: null,
        selectedIcon: null,
        isNavigating: false,
      }));
      navigate("home");
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [navigate, appState.isNavigating]);

  if (!isReady) return null;

  return (
    <div
      className={
        "relative w-[748px] h-[1592px] text-white rounded-[108px] shadow-xl border-8 border-border/20 overflow-hidden backdrop-blur-xl transition-colors duration-300"
      }
      style={{
        background: `linear-gradient(to bottom right, ${
          theme === 'dark' 
            ? 'rgba(34, 211, 238, 0.15)' // Cyan for dark
            : 'rgba(34, 211, 238, 0.08)'  // Lighter cyan for light
        }, ${
          theme === 'dark'
            ? 'rgba(79, 70, 229, 0.2)'    // Indigo for dark
            : 'rgba(79, 70, 229, 0.12)'   // Lighter indigo for light
        })`,
        backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'
      } as React.CSSProperties}
    >
      {!appState.isOpen && (
        <HomeScreen
          key="home"
          handleAppClick={handleAppClick}
          setBackgroundGradient={setBackgroundGradient}
        />
      )}
      {appState.activeApp && (
        <OpenApp
          key="app"
          activeApp={appState.activeApp}
          handleAppClose={handleAppClose}
          selectedIcon={appState.selectedIcon!}
        />
      )}
    </div>
  );
}
