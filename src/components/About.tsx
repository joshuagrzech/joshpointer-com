import { motion } from 'framer-motion';
import { fetchConfig } from '@/lib/config';
import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import ExperienceTimeline from './ExperienceTimeline';
import ProcessSection from './ProcessSection';
import TestimonialSection from './TestimonialSection';

interface AboutConfig {
  title: string;
  content: string;
}

interface Config {
  about: AboutConfig;
}

const highlights = [
  { label: 'Years of Experience', value: '5+' },
  { label: 'Apps Shipped', value: '10+' },
  { label: 'Happy Clients', value: '20+' },
  { label: 'Code Reviews', value: '500+' }
];

export default function About() {
  const [about, setAbout] = useState<AboutConfig | null>(null);

  useEffect(() => {
    async function loadConfig() {
      const data: Config = await fetchConfig();
      setAbout(data.about);
    }
    loadConfig();
  }, []);

  if (!about) return null;

  return (
    <div className="space-y-20">
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">
              About Me
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {about.title}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                {about.content}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {highlights.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="text-3xl font-bold text-primary mb-2">
                        {item.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.label}
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <ExperienceTimeline />
      <ProcessSection />
      <TestimonialSection />
    </div>
  );
}
