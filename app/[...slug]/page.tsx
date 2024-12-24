'use client';

import { motion } from "framer-motion";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Blog from "@/components/sections/Blog";
import Links from "@/components/Links";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import { useNavigation } from "@/hooks/useNavigation";
import { useWindowSize } from "@/hooks/useWindowSize";
import { framerMotionConfig } from "@/constants/animations";

const pageTransitionVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

export default function ContentView() {
  const { currentRoute, isReady } = useNavigation();
  const { width, height } = useWindowSize();
  const isPortrait = height > width;

  const getComponent = () => {
    switch (currentRoute) {
      case "about":
        return <About />;
      case "projects":
        return <Projects />;
      case "skills":
        return <Skills />;
      case "contact":
        return <Contact />;
      case "blog":
        return <Blog />;
      case "links":
        return <Links />;
      case "home":
        return <div />;
      default:
        return null;
    }
  };

  if (!isReady || isPortrait) return null;

  return (
    <div>
        <motion.div
          key={currentRoute}
          variants={pageTransitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={framerMotionConfig.default}
          className="h-full p-8"
        >
          {getComponent()}
        </motion.div>
    </div>
  );
}
