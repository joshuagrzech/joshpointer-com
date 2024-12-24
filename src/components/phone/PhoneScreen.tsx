'use client';

import React, { useState, useEffect, useCallback } from "react";
import { fetchConfig } from "@/lib/config";
import type { Branding, NavItem, Route, SelectedIcon } from "@/types";
import { OpenApp } from "@/components/phone/OpenApp";
import HomeScreen from "@/components/phone/HomeScreen";
import { useNavigation } from '@/hooks/useNavigation';

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

export default function PhoneScreen({ setBackgroundGradient }: PhoneScreenProps) {
  const { navigate, isReady, currentRoute } = useNavigation();

  // Combine app-related state
  const [appState, setAppState] = useState({
    activeApp: null as string | null,
    isOpen: false,
    selectedIcon: null as SelectedIcon | null,
    isNavigating: false,
  });

  const [branding, setBranding] = useState<Branding>({
    name: "",
    tagline: "",
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await fetchConfig();
        setBranding(data.branding);
      } catch (error) {
        console.error("Failed to load config:", error);
      }
    };
    loadConfig();
  }, []);

  // Simplified navigation effect
  useEffect(() => {
    if (!isReady || appState.isNavigating) return;

    if (currentRoute === 'home' && appState.isOpen) {
      setAppState(prev => ({ ...prev, isOpen: false, activeApp: null, selectedIcon: null }));
    } else if (currentRoute !== 'home' && !appState.isOpen) {
      setAppState(prev => ({
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

  const handleAppClick = useCallback((item: NavItem, index: number) => {
    if (appState.isNavigating) return;
    
    setAppState(prev => ({
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
      setAppState(prev => ({ ...prev, isNavigating: false }));
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [navigate, appState.isNavigating]);

  const handleAppClose = useCallback(() => {
    if (appState.isNavigating) return;
    
    setAppState(prev => ({ ...prev, isNavigating: true, isOpen: false }));
    
    const timer = setTimeout(() => {
      setAppState(prev => ({
        ...prev,
        activeApp: null,
        selectedIcon: null,
        isNavigating: false,
      }));
      navigate('home');
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [navigate, appState.isNavigating]);

  if (!isReady) return null;

  return (
    <div className={

           "relative w-[748px] h-[1592px] text-white rounded-[108px] shadow-xl border-8 border-transparent overflow-hidden"
      }>
        {!appState.isOpen && (
          <HomeScreen
            key="home"
            branding={branding}
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
