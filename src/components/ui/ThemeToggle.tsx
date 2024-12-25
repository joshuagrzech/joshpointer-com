"use client"
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      initial={false}
      animate={{
        scale: 1,
        rotate: isDark ? 360 : 0,
      }}
      whileTap={{ scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 10
      }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background/90 transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="w-5 h-5 text-yellow-500" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : -180,
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-5 h-5 text-blue-400" />
      </motion.div>
      <div className="w-5 h-5" /> {/* Spacer to maintain button size */}
    </motion.button>
  );
};

export default ThemeToggle; 