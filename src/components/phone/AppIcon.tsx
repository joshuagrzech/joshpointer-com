import React from "react";
import { motion } from "framer-motion";
import { IconMap } from "@/components/ui/icons";
import type { NavItem } from "@/types";
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
  const { theme } = useTheme();

  const Icon = IconMap[item.icon as keyof typeof IconMap];

  // Enhanced gradient configurations
  const gradients = {
    about: {
      light: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      dark: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    projects: {
      light: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      dark: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    },
    skills: {
      light: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      dark: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    blog: {
      light: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      dark: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    },
    links: {
      light: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      dark: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
    },
    contact: {
      light: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      dark: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  };

  const currentGradient = gradients[item.id as keyof typeof gradients] || gradients.about;

  return (
    <motion.button
      onClick={() => handleAppClick(item, index)}
      className="flex flex-col items-center justify-center cursor-pointer group"
      whileHover={{ 
        scale: 1.05,
        y: -2,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
    >
      <div 
        className="relative w-28 h-28 rounded-3xl flex items-center justify-center transition-all duration-300 shadow-lg group-hover:shadow-xl"
        style={{
          background: theme === 'dark' ? currentGradient.dark : currentGradient.light,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          style={{
            background: theme === 'dark' ? currentGradient.dark : currentGradient.light,
            filter: 'blur(20px)',
            transform: 'scale(1.2)',
          }}
        />
        
        {/* Icon with enhanced styling */}
        <div className="relative z-10">
          <Icon 
            size={56} 
            color={theme === 'dark' ? "white" : 'white'} 
            className="drop-shadow-lg"
          />
        </div>
      </div>
      
      {/* Enhanced label */}
      <motion.span 
        className="mt-3 text-2xl font-medium text-foreground transition-colors duration-300 group-hover:text-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.2 }}
      >
        {item.label}
      </motion.span>
    </motion.button>
  );
};

export default AppIcon; 