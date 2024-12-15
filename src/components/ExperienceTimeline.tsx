import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Briefcase } from 'lucide-react';

interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
}

const experiences: Experience[] = [
  {
    company: "Tech Corp",
    role: "Senior Mobile Developer",
    period: "2021 - Present",
    description: "Led the development of multiple React Native applications, mentored junior developers, and implemented CI/CD pipelines.",
    technologies: ["React Native", "TypeScript", "Redux", "Jest"]
  },
  {
    company: "Mobile Solutions Inc",
    role: "iOS Developer",
    period: "2019 - 2021",
    description: "Developed native iOS applications using Swift and SwiftUI, implemented complex animations and custom UI components.",
    technologies: ["Swift", "SwiftUI", "Core Data", "XCTest"]
  },
  {
    company: "App Studio",
    role: "Mobile Developer",
    period: "2017 - 2019",
    description: "Built cross-platform mobile applications, collaborated with designers, and implemented RESTful APIs.",
    technologies: ["React Native", "JavaScript", "Firebase"]
  }
];

export default function ExperienceTimeline() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />

        {/* Experience cards */}
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative pl-16">
                {/* Timeline dot */}
                <div className="absolute left-6 -translate-x-1/2 w-4 h-4 rounded-full bg-primary" />
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">{exp.role}</h3>
                        <p className="text-sm text-muted-foreground">{exp.company} • {exp.period}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
