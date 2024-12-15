import { motion } from 'framer-motion';
import { fetchConfig } from '@/lib/config';
import { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import { ParallaxSection } from './ParallaxSection';
import { ScrollReveal } from './ScrollReveal';
import { GestureCard } from './GestureCard';

interface Project {
  title: string;
  description: string;
  tech: string;
  image: string;
  github: string;
  demo: string;
}

interface Config {
  projects: Project[];
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function loadConfig() {
      const data: Config = await fetchConfig();
      setProjects(data.projects);
    }
    loadConfig();
  }, []);

  return (
    <section className="py-8 md:py-12 lg:py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <ParallaxSection>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Projects
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Here are some of the mobile applications I've built. Each project demonstrates my expertise in React Native, iOS development, and modern mobile app architecture.
            </p>
          </motion.div>
        </ParallaxSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <ScrollReveal 
              key={index}
              direction={index % 2 === 0 ? 'left' : 'right'}
              delay={index * 0.1}
            >
              <GestureCard>
                <ProjectCard project={project} index={index} />
              </GestureCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
