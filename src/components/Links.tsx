import { motion } from 'framer-motion';
import { IconMap } from './ui/icons';

export default function Links() {
  const links = [
    {
      title: 'GitHub',
      url: 'https://github.com/johndoe',
      icon: 'github',
    },
    {
      title: 'Twitter',
      url: 'https://twitter.com/johndoe',
      icon: 'twitter',
    },
    {
      title: 'LinkedIn',
      url: 'https://linkedin.com/in/johndoe',
      icon: 'linkedin',
    },
  ];

  return (
    <div className="max-w-lg mx-auto py-8 px-4 md:py-12">
      <h2 className="text-3xl font-bold mb-8">Links</h2>
      <div className="grid gap-4">
        {links.map((link, index) => {
          const Icon = IconMap[link.icon];
          return (
            <motion.a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
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
