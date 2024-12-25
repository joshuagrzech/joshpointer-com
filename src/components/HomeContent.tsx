import React from "react";
import { useConfig } from "@/contexts/ConfigContext";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export const HomeContent = () => {
  const { config, isLoading } = useConfig();

  if (isLoading || !config) {
    return null;
  }

  const { hero } = config;

  return (
    <div className="h-full w-full p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={config.theme.animation.framerMotion.default}
      >
        <Card>
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold mb-4">{hero.title}</h1>
            <p className="text-xl text-muted-foreground mb-8">{hero.description}</p>
            <a
              href={hero.cta.url}
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              {hero.cta.label}
            </a>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
