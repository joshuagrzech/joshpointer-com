import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import ProcessSection from "@/components/sections/ProcessSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function About() {
  const skills = [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "GraphQL",
  ];

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">About Me</h1>
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg text-muted-foreground mb-4">
                I&apos;m a passionate software engineer with a focus on building scalable web applications
                and solving complex problems. With years of experience in full-stack development,
                I bring ideas to life through clean, efficient code.
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </ScrollReveal>

      <ScrollReveal>
        <ExperienceTimeline />
      </ScrollReveal>

      <ScrollReveal>
        <ProcessSection />
      </ScrollReveal>

      <ScrollReveal>
        <TestimonialSection />
      </ScrollReveal>
    </div>
  );
}
