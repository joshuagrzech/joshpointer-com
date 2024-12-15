import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface Skill {
  name: string;
  level: number;
  category: string;
  description: string;
  years: number;
}

const skills: Skill[] = [
  {
    name: "React Native",
    level: 95,
    category: "Mobile",
    description: "Expert in cross-platform mobile development with React Native",
    years: 5
  },
  {
    name: "iOS/Swift",
    level: 90,
    category: "Mobile",
    description: "Extensive experience in native iOS development",
    years: 4
  },
  {
    name: "TypeScript",
    level: 92,
    category: "Languages",
    description: "Advanced TypeScript development with strong typing practices",
    years: 4
  },
  {
    name: "React",
    level: 88,
    category: "Frontend",
    description: "Building responsive and performant web applications",
    years: 5
  },
  {
    name: "SwiftUI",
    level: 85,
    category: "Mobile",
    description: "Modern iOS UI development with SwiftUI",
    years: 3
  },
  {
    name: "Node.js",
    level: 82,
    category: "Backend",
    description: "Server-side development and API integration",
    years: 4
  }
];

const categoryColors: Record<string, string> = {
  Mobile: "bg-blue-500",
  Languages: "bg-purple-500",
  Frontend: "bg-green-500",
  Backend: "bg-orange-500"
};

export default function SkillVisualization() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <TooltipProvider>
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setHoveredSkill(skill.name)}
              onHoverEnd={() => setHoveredSkill(null)}
            >
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{skill.name}</h3>
                    <Badge variant="secondary">
                      {skill.years} {skill.years === 1 ? 'year' : 'years'}
                    </Badge>
                  </div>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className={`absolute left-0 top-0 h-full ${categoryColors[skill.category]}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{skill.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">Proficiency: {skill.level}%</p>
                    </TooltipContent>
                  </Tooltip>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredSkill === skill.name ? 1 : 0 }}
                    className="mt-2 text-sm text-muted-foreground"
                  >
                    {skill.description}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <span className="text-sm text-muted-foreground">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
