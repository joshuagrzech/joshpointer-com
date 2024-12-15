import { motion } from 'framer-motion';
import { fetchConfig } from '@/lib/config';
import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface SkillsConfig {
  languages: string[];
  frameworks: string[];
  tools: string[];
  databases: string[];
}

interface Config {
  skills: SkillsConfig;
}

const skillColors: { [key: string]: string } = {
  languages: 'from-blue-500 to-blue-600',
  frameworks: 'from-purple-500 to-purple-600',
  tools: 'from-green-500 to-green-600',
  databases: 'from-orange-500 to-orange-600',
};

const skillIcons: { [key: string]: string } = {
  languages: '🚀',
  frameworks: '⚛️',
  tools: '🛠️',
  databases: '💾',
};

export default function Skills() {
  const [skills, setSkills] = useState<SkillsConfig | null>(null);

  useEffect(() => {
    async function loadConfig() {
      const data: Config = await fetchConfig();
      setSkills(data.skills);
    }
    loadConfig();
  }, []);

  if (!skills) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Technical Skills
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise and the technologies I work with.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {Object.entries(skills).map(([category, list], index) => (
            <motion.div key={category} variants={item}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{skillIcons[category]}</span>
                    <h3 className="text-xl font-semibold capitalize">{category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {list.map((skill) => (
                      <motion.div
                        key={skill}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge
                          className={`bg-gradient-to-r ${skillColors[category]} text-white`}
                        >
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
