import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
}

const experiences: Experience[] = [
  {
    title: "Senior Software Engineer",
    company: "Tech Company",
    period: "2022 - Present",
    description: "Leading the development of scalable web applications using modern technologies. Mentoring junior developers and implementing best practices.",
    technologies: ["React", "Node.js", "AWS", "TypeScript"],
  },
  {
    title: "Software Engineer",
    company: "Digital Agency",
    period: "2020 - 2022",
    description: "Developed and maintained multiple client projects. Worked closely with designers and product managers to deliver high-quality solutions.",
    technologies: ["Next.js", "GraphQL", "PostgreSQL", "Docker"],
  },
  {
    title: "Frontend Developer",
    company: "Startup",
    period: "2018 - 2020",
    description: "Built responsive and performant user interfaces. Implemented new features and optimized existing codebase.",
    technologies: ["React", "JavaScript", "CSS", "Redux"],
  },
];

export default function ExperienceTimeline() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Briefcase className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Experience</h2>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
        {experiences.map((experience, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="relative pl-8"
          >
            <div className="absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{experience.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {experience.company} • {experience.period}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{experience.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
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
