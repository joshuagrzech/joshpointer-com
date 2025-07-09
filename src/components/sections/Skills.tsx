import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Smartphone, Code, Zap, Shield, Database, Wrench } from 'lucide-react';
import { getSkillsConfig } from '@/lib/config';
import type { Config } from '@/types/config';

const categoryIcons = {
  'Mobile Development': Smartphone,
  'State Management & Architecture': Code,
  'Performance & Optimization': Zap,
  'Testing & Quality': Shield,
  'Backend & APIs': Database,
  'Tools & DevOps': Wrench,
};

export default function Skills() {
  const skills = getSkillsConfig();

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">{skills.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{skills.description}</p>
        </motion.div>
      </ScrollReveal>

      <div className="grid gap-6 md:grid-cols-2">
        {skills.categories.map((category: Config['skills']['categories'][0], index: number) => {
          const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Code;

          return (
            <ScrollReveal key={category.name}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">{category.name}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Additional Skills Summary */}
      <ScrollReveal>
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Core Competencies</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Specialized in React Native and iOS development with 5+ years of experience building
                scalable mobile applications. Expert in performance optimization, user experience
                design, and mobile architecture patterns.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="default" className="text-sm">
                  React Native Expert
                </Badge>
                <Badge variant="default" className="text-sm">
                  iOS Development
                </Badge>
                <Badge variant="default" className="text-sm">
                  Mobile Architecture
                </Badge>
                <Badge variant="default" className="text-sm">
                  Performance Optimization
                </Badge>
                <Badge variant="default" className="text-sm">
                  App Store Deployment
                </Badge>
                <Badge variant="default" className="text-sm">
                  Team Leadership
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
}
