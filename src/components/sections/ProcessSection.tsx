import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { getProcessConfig } from "@/lib/config";
import type { Config } from "@/types/config";
import { IconMap } from "@/components/ui/icons";

export default function ProcessSection() {
  const process = getProcessConfig();

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">{process.title}</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {process.steps.map((step: Config["process"]["steps"][0], index: number) => {
          const Icon = IconMap[step.icon as keyof typeof IconMap];
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
