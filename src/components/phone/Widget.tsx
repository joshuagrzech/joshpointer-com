import React from "react";
import { motion } from "framer-motion";
import type { WidgetProps } from "@/types";

const Widget: React.FC<WidgetProps> = ({ branding }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mx-16 mt-32 p-8 rounded-3xl bg-white/20 backdrop-blur-sm"
    >
      <h1 className="text-6xl font-semibold text-white">{branding.name}</h1>
      <p className="text-3xl text-white/80">{branding.tagline}</p>
    </motion.div>
  );
};

export default Widget;
