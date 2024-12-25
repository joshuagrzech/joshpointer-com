import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useConfig } from "@/contexts/ConfigContext";
import { IconMap } from "@/components/ui/icons";

export default function ProcessSection() {
  const { config, isLoading } = useConfig();

  if (isLoading || !config) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <IconMap.folder className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">{config.process.title}</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {config.process.steps.map((step, index) => {
          const Icon = IconMap[step.icon];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...config.theme.animation.framerMotion.default, delay: index * 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
