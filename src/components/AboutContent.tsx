import React from "react";
import { useConfig } from "@/contexts/ConfigContext";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export const AboutContent = () => {
  const { config, isLoading } = useConfig();

  if (isLoading || !config) {
    return null;
  }

  const { about } = config;

  return (
    <div className="h-full w-full p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={config.theme.animation.framerMotion.default}
      >
        <Card>
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold mb-6">{about.title}</h1>
            <div className="prose prose-lg dark:prose-invert">
              <p className="text-muted-foreground">{about.content}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
