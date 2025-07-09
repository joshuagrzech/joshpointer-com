import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { framerMotionConfig } from "@/constants/animations";

interface ScrollRevealProps {
  children: ReactNode;
  width?: "fit-content" | "100%";
}

export default function ScrollReveal({ children, width = "fit-content" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} style={{ width }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={framerMotionConfig.slow}
      >
        {children}
      </motion.div>
    </div>
  );
}
