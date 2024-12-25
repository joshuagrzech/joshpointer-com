import React from "react";
import { motion } from "framer-motion";
import { IconMap } from "@/components/ui/icons";
import type { NavItem } from "@/types";
import { useConfig } from "@/contexts/ConfigContext";
import { useTheme } from "next-themes";

interface AppIconProps {
  item: NavItem;
  index: number;
  handleAppClick: (item: NavItem, index: number) => void;
}

const AppIcon: React.FC<AppIconProps> = ({
  item,
  index,
  handleAppClick,
}) => {
  const { config, isLoading } = useConfig();
  const {theme} = useTheme()
  if (isLoading || !config) {
    return null;
  }

  const Icon = IconMap[item.icon as keyof typeof IconMap];

  return (
    <motion.button
      onClick={() => handleAppClick(item, index)}
      className="flex flex-col items-center justify-center cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={config.theme.animation.framerMotion.default}
    >
      <div 
        className="w-28 h-28 rounded-2xl flex items-center justify-center transition-colors duration-300"
        style={{
          background: `linear-gradient(to bottom right, ${
            theme === 'dark'
              ? 'rgba(244, 63, 94, 0.9)'   // Darker rose for dark mode
              : 'rgba(244, 63, 94, 0.8)'   // Lighter rose for light mode
          }, ${
            theme === 'dark'
              ? 'rgba(251, 113, 133, 0.8)' // Darker light-rose for dark mode
              : 'rgba(251, 113, 133, 0.7)' // Lighter light-rose for light mode
          })`
        }}
      >
        <Icon size={56} color={theme === 'dark' ? "white" : 'black'} />
      </div>
      <span className="mt-2 text-3xl text-foreground transition-colors duration-300">{item.label}</span>
    </motion.button>
  );
};

export default AppIcon; 