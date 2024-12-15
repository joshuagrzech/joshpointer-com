import { motion } from 'framer-motion';
import { IconMap } from './ui/icons';
import { fetchConfig } from '@/lib/config';
import { useEffect, useState } from 'react';

interface FooterConfig {
  copyright: string;
}

interface LinkConfig {
  title: string;
  url: string;
  icon: keyof typeof IconMap;
}

interface Config {
  links: LinkConfig[];
  footer: FooterConfig;
}

export default function Footer() {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    async function loadConfig() {
      const data = await fetchConfig();
      setConfig(data);
    }
    loadConfig();
  }, []);

  if (!config) return null;

  const { links, footer } = config;

  return (
    <footer className="py-8 px-4 bg-secondary text-secondary-foreground">
      <div className="max-w-lg mx-auto text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center space-x-4"
        >
          {links.map((link, index) => {
            const Icon = IconMap[link.icon];
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-foreground hover:text-primary transition-colors"
              >
                <Icon size={24} />
              </a>
            );
          })}
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm"
        >
          {footer.copyright.replace('{year}', new Date().getFullYear().toString())}
        </motion.p>
      </div>
    </footer>
  );
}
