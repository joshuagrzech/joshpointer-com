'use client';

import { motion } from "framer-motion";
import { getBrandingConfig } from "@/lib/config";

export function HomeContent() {
  const branding = getBrandingConfig();

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold">{branding.name}</h1>
        <p className="text-xl text-muted-foreground">{branding.tagline}</p>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {branding.description}
        </p>
      </motion.div>
    </div>
  );
}
