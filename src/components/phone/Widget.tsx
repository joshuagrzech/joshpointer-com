import React from "react";
import { motion } from "framer-motion";
import { useConfig } from "@/contexts/ConfigContext";

const Widget: React.FC = () => {
  const { config, isLoading } = useConfig();

  if (isLoading || !config) {
    return null;
  }

  const { branding } = config;
  const { framerMotion } = config.theme.animation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...framerMotion.default, delay: 0.2 }}
      className="mx-16 mt-32 p-8 rounded-3xl relative overflow-hidden widget-gradient"
      style={{
        '--widget-gradient-from': 'rgba(99, 102, 241, 0.9)',  // Indigo-like color
        '--widget-gradient-via': 'rgba(139, 92, 246, 0.8)',   // Purple-like color
        '--widget-gradient-to': 'rgba(236, 72, 153, 0.7)',    // Pink-like color
      } as React.CSSProperties}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--widget-gradient-from)] via-[var(--widget-gradient-via)] to-[var(--widget-gradient-to)] " />
      
      {/* Content with relative positioning to appear above gradient */}
      <div className="relative text-white">
        <h1 className="text-6xl font-semibold">{branding.name}</h1>
        <p className="text-3xl">{branding.tagline}</p>
      </div>
    </motion.div>
  );
};

export default Widget;
