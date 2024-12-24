import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Lightbulb,
  Code2,
  TestTube,
  Rocket,
  type LucideIcon,
} from "lucide-react";

interface ProcessStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

const processSteps: ProcessStep[] = [
  {
    title: "Plan & Design",
    description: "Understand requirements, create wireframes, and plan the architecture.",
    icon: Lightbulb,
  },
  {
    title: "Develop",
    description: "Write clean, maintainable code following best practices and patterns.",
    icon: Code2,
  },
  {
    title: "Test & Review",
    description: "Thoroughly test features and conduct code reviews to ensure quality.",
    icon: TestTube,
  },
  {
    title: "Deploy",
    description: "Deploy to production using automated CI/CD pipelines.",
    icon: Rocket,
  },
];

export default function ProcessSection() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Code2 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Development Process</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {processSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <step.icon className="h-6 w-6 text-primary" />
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
        ))}
      </div>
    </div>
  );
}
