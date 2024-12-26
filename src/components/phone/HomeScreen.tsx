'use client';

import { motion } from "framer-motion";
import { AppGrid } from "./AppGrid";
import { Widget } from "./Widget";
import type { NavItem } from "@/types";
import StatusBar from "./StatusBar";

interface HomeScreenProps {
  handleAppClick: (item: NavItem, index: number) => void;
}

export function HomeScreen({ handleAppClick }: HomeScreenProps) {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative h-full w-full flex flex-col gap-4 items-center px-6 pt-4"
    >
        <div className="w-full max-w-[90%] flex flex-col gap-8">
            <Widget />
            <AppGrid handleAppClick={handleAppClick} />
        </div>
    </motion.div>
  );
}
