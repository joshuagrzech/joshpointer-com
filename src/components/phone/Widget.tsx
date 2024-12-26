'use client';

import { motion } from "framer-motion";
import { getBrandingConfig } from "@/lib/config";

export function Widget() {
  const branding = getBrandingConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 w-full"
    >
      <div className="flex items-center gap-2 text-left">
        <div className="flex-1">
          <h3 className="font-semibold text-4xl">{branding.name}</h3>
          <p className="text-3xl text-muted-foreground">{branding.tagline}</p>
        </div>
      </div>
    </motion.div>
  );
}
