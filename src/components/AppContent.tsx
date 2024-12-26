import { motion } from "framer-motion";
import { getNavigationConfig } from "@/lib/config";
import type { Config } from "@/types/config";

export default function AppContent({ activeApp }: { activeApp: string }) {
  const navigation = getNavigationConfig();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center space-y-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          {navigation.map((item: Config["navigation"][0]) => (
            <motion.a
              key={item.id}
              href={`#${item.id}`}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-card hover:bg-accent transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg font-medium">{item.label}</span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
