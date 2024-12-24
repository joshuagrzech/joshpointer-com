import React from "react";
import { motion } from "framer-motion";
import { AppContent } from "@/components/AppContent";
import type { OpenAppProps } from "@/types";
import { useNavigation } from '@/hooks/useNavigation';

export const OpenApp: React.FC<OpenAppProps> = ({
  activeApp,
  handleAppClose,
  selectedIcon,
}) => {
  const { navigate } = useNavigation();

  const handleBack = () => {
    handleAppClose();
    navigate('home');
  };

  return (
    <motion.div
      key="app"
      initial={{
        clipPath: `circle(0% at ${selectedIcon.rect.x + 28}px ${
          selectedIcon.rect.y + 56
        }px)`,
        opacity: 0,
      }}
      animate={{
        clipPath: `circle(150% at ${selectedIcon.rect.x + 28}px ${
          selectedIcon.rect.y + 56
        }px)`,
        opacity: 1,
      }}
      exit={{
        clipPath: `circle(0% at ${selectedIcon.rect.x + 28}px ${
          selectedIcon.rect.y + 56
        }px)`,
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="absolute inset-0 z-50"
    >
      {activeApp && (
      <div className="absolute inset-0">
        <AppContent activeApp={activeApp} />
      </div>
      )}
      <button
        onClick={handleBack}
        className="fixed top-16 left-16 z-50 bg-black/20 p-4 rounded-full hover:bg-black/30 transition-colors"
        aria-label="Close app"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </motion.div>
  );
};
