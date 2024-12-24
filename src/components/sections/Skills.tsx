import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import {
  Code2,
  Database,
  Cloud,
  Layout,
  type LucideIcon,
} from "lucide-react";

interface Skill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category: string;
}

interface SkillCategory {
  name: string;
  icon: LucideIcon;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "Frontend Development",
    icon: Layout,
    skills: [
      { name: "React", level: "Expert", category: "Frontend" },
      { name: "TypeScript", level: "Expert", category: "Frontend" },
      { name: "Next.js", level: "Advanced", category: "Frontend" },
      { name: "TailwindCSS", level: "Advanced", category: "Frontend" },
    ],
  },
  {
    name: "Backend Development",
    icon: Code2,
    skills: [
      { name: "Node.js", level: "Expert", category: "Backend" },
      { name: "Python", level: "Advanced", category: "Backend" },
      { name: "GraphQL", level: "Advanced", category: "Backend" },
      { name: "REST APIs", level: "Expert", category: "Backend" },
    ],
  },
  {
    name: "Database",
    icon: Database,
    skills: [
      { name: "PostgreSQL", level: "Advanced", category: "Database" },
      { name: "MongoDB", level: "Advanced", category: "Database" },
      { name: "Redis", level: "Intermediate", category: "Database" },
      { name: "Prisma", level: "Advanced", category: "Database" },
    ],
  },
  {
    name: "DevOps & Cloud",
    icon: Cloud,
    skills: [
      { name: "AWS", level: "Advanced", category: "DevOps" },
      { name: "Docker", level: "Advanced", category: "DevOps" },
      { name: "CI/CD", level: "Advanced", category: "DevOps" },
      { name: "Kubernetes", level: "Intermediate", category: "DevOps" },
    ],
  },
];

export default function Skills() {
  return (
    <div className="space-y-8">
      <ScrollReveal>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Skills</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Here&apos;s an overview of my technical skills and expertise across different areas
            of software development.
          </p>
        </motion.div>
      </ScrollReveal>

      <div className="grid gap-6 md:grid-cols-2">
        {skillCategories.map((category) => (
          <ScrollReveal key={category.name}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <category.icon className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">{category.name}</h2>
                </div>
                <div className="space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{skill.name}</span>
                      <Badge
                        variant={
                          skill.level === "Expert"
                            ? "default"
                            : skill.level === "Advanced"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {skill.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
