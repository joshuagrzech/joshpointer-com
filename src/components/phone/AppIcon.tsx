import React from "react";
import { motion } from "framer-motion";
import { IconMap } from "@/components/ui/icons";
import type { NavItem } from "@/types";

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
  const Icon = IconMap[item.icon];

  return (
    <motion.button
      onClick={() => handleAppClick(item, index)}
      className="flex flex-col items-center justify-center cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
        <Icon size={56} />
      </div>
      <span className="mt-2 text-3xl">{item.label}</span>
    </motion.button>
  );
};

export default AppIcon; 