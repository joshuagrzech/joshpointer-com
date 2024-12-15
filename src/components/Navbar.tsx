import { motion } from 'framer-motion';
import { useNavigationStore } from '@/lib/store';
import { IconMap } from './ui/icons';
import { useEffect, useState } from 'react';
import { fetchConfig } from '@/lib/config';

interface NavItem {
  id: string;
  label: string;
  icon: keyof typeof IconMap;
}

interface Config {
  navigation: NavItem[];
}

export default function Navbar() {
  const { setRoute } = useNavigationStore();
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    async function loadConfig() {
      const data: Config = await fetchConfig();
      setNavItems(data.navigation);
    }
    loadConfig();
  }, []);

  return (
    <nav className="h-16 bg-background/80 backdrop-blur-lg border-b fixed top-0 left-0 right-0 z-30">
      <div className="h-full max-w-lg mx-auto px-4 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = IconMap[item.icon];
          return (
            <motion.button
              key={item.id}
              onClick={() => setRoute(item.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center space-y-1"
            >
              <Icon size={24} />
              <span className="text-xs">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
