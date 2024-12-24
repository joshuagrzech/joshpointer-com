import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  demo?: string;
}

const projects: Project[] = [
  {
    title: "Project One",
    description: "A full-stack web application built with modern technologies.",
    technologies: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    github: "https://github.com/username/project-one",
    demo: "https://project-one.demo",
  },
  {
    title: "Project Two",
    description: "A mobile-first responsive web application.",
    technologies: ["Next.js", "TailwindCSS", "Prisma", "MongoDB"],
    github: "https://github.com/username/project-two",
  },
  // Add more projects as needed
];

export default function Projects() {
  return (
    <div className="space-y-8">
      <ScrollReveal>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Projects</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Here are some of the projects I&apos;ve worked on. Each one represents a unique challenge
            and learning experience.
          </p>
        </motion.div>
      </ScrollReveal>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ScrollReveal key={project.title}>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.demo && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Demo
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
