import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import ProcessSection from "@/components/sections/ProcessSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getSkillsConfig, getAboutConfig } from "@/lib/config";

export default function About() {
  const skills = getSkillsConfig();
  const about = getAboutConfig();

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">{about.title}</h1>
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg text-muted-foreground mb-4">
                {about.content}
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.categories.map((skill) => (
                  <Badge key={skill.name} variant="secondary">
                    {skill.name}
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
