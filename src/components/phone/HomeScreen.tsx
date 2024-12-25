import React from "react";
import { motion } from "framer-motion";
import StatusBar from "@/components/phone/StatusBar";
import AppGrid from "@/components/phone/AppGrid";
import Widget from "@/components/phone/Widget";
import { useConfig } from "@/contexts/ConfigContext";
import type { AppGridProps } from "@/types";

const HomeScreen: React.FC<AppGridProps> = ({ handleAppClick, setBackgroundGradient }) => {
  const { config, isLoading } = useConfig();

  if (isLoading || !config) {
    return null;
  }

  const { framerMotion } = config.theme.animation;

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={framerMotion.default}
      className="min-h-screen text-foreground transition-colors duration-300"
    >
      <div className="relative z-10">
        <StatusBar />
        <Widget />
        <AppGrid handleAppClick={handleAppClick} setBackgroundGradient={setBackgroundGradient} />
      </div>
    </motion.div>
  );
};

export default HomeScreen;
