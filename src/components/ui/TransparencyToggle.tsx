'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Eye, EyeOff } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useNavigation } from '@/hooks/useNavigation';

// Create a context to manage transparency state
import { createContext, useContext, useState, useEffect } from 'react';

interface TransparencyContextType {
  isTransparencyEnabled: boolean;
  toggleTransparency: () => void;
}

const TransparencyContext = createContext<TransparencyContextType | undefined>(undefined);

export const useTransparency = () => {
  const context = useContext(TransparencyContext);
  if (!context) {
    throw new Error('useTransparency must be used within a TransparencyProvider');
  }
  return context;
};

export const TransparencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransparencyEnabled, setIsTransparencyEnabled] = useState(false);

  const toggleTransparency = () => {
    setIsTransparencyEnabled((prev) => !prev);
  };

  return (
    <TransparencyContext.Provider value={{ isTransparencyEnabled, toggleTransparency }}>
      {children}
    </TransparencyContext.Provider>
  );
};

const TransparencyToggle = ({ route }: { route?: string }) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const { currentRoute } = useNavigation();
  const { isTransparencyEnabled, toggleTransparency } = useTransparency();

  return (
    <motion.button
      initial={false}
      animate={{
        scale: 1,
        rotate: isTransparencyEnabled ? 360 : 0,
      }}
      whileTap={{ scale: 0.9 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 10,
      }}
      onClick={toggleTransparency}
      className="fixed top-4 right-16 z-50 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background/90 transition-colors"
      aria-label="Toggle transparency"
      style={{
        display:
          route === 'home' ? (isMobile && currentRoute !== 'home' ? 'none' : 'block') : 'block',
      }}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isTransparencyEnabled ? 180 : 0,
          scale: isTransparencyEnabled ? 0 : 1,
          opacity: isTransparencyEnabled ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 10,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Eye className="w-5 h-5 text-blue-500" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: isTransparencyEnabled ? 0 : -180,
          scale: isTransparencyEnabled ? 1 : 0,
          opacity: isTransparencyEnabled ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 10,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <EyeOff className="w-5 h-5 text-gray-500" />
      </motion.div>
      <div className="w-5 h-5" /> {/* Spacer to maintain button size */}
    </motion.button>
  );
};

export default TransparencyToggle;
