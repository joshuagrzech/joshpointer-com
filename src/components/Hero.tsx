import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fetchConfig } from '@/lib/config';
import { useEffect, useState } from 'react';

interface HeroConfig {
  title: string;
  description: string;
  cta: {
    label: string;
    url: string;
  };
}

interface Config {
  hero: HeroConfig;
}

export default function Hero() {
  const [hero, setHero] = useState<HeroConfig | null>(null);

  useEffect(() => {
    async function loadConfig() {
      const data: Config = await fetchConfig();
      setHero(data.hero);
    }
    loadConfig();
  }, []);

  if (!hero) return null;

  return (
    <div className="relative h-screen flex items-center justify-center z-20">
      <div className="text-center px-4 space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
        >
          {hero.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          {hero.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button size="lg" className="rounded-full">
            <a href={hero.cta.url}>{hero.cta.label}</a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
