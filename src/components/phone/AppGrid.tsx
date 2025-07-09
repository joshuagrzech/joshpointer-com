'use client';

import { motion } from 'framer-motion';
import AppIcon from './AppIcon';
import { getNavigationConfig } from '@/lib/config';
import type { Config } from '@/types/config';
import type { NavItem } from '@/types';

interface AppGridProps {
  handleAppClick: (item: NavItem, index: number) => void;
}

export function AppGrid({ handleAppClick }: AppGridProps) {
  const navigation = getNavigationConfig();

  return (
    <div className="grid grid-cols-4 gap-6 place-items-center w-full">
      {navigation
        .filter((item) => item.id !== 'home')
        .map((item: Config['navigation'][0], index: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => handleAppClick(item as NavItem, index)}
            className="flex items-center justify-center"
          >
            <AppIcon item={item} index={index} handleAppClick={handleAppClick} />
          </motion.div>
        ))}
    </div>
  );
}
