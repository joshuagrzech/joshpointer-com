import { motion } from 'framer-motion';
import { IconMap } from '@/components/ui/icons';
import { useConfig } from '@/contexts/ConfigContext';

export default function Links() {
  const { config, isLoading } = useConfig();

  if (isLoading || !config) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto py-8 px-4 md:py-12">
      <h2 className="text-3xl font-bold mb-8">Links</h2>
      <div className="grid gap-4">
        {config.links.map((link, index) => {
          const Icon = IconMap[link.icon as keyof typeof IconMap];
          return (
            <motion.a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...config.theme.animation.framerMotion.default, delay: index * 0.1 }}
              className="flex items-center p-4 bg-card rounded-lg hover:bg-card/80 transition-colors"
            >
              <Icon size={24} />
              <span className="ml-4">{link.title}</span>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
