'use client';

import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import { useNavigation } from "@/hooks/useNavigation";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Suspense, memo } from 'react';

// Dynamically import components with loading states
const Projects = dynamic(() => import("@/components/sections/Projects"), {
  loading: () => <LoadingPlaceholder />,
  ssr: false
});

const Contact = dynamic(() => import("@/components/sections/Contact"), {
  loading: () => <LoadingPlaceholder />,
  ssr: false
});

const Blog = dynamic(() => import("@/components/sections/Blog"), {
  loading: () => <LoadingPlaceholder />,
  ssr: false
});

const Links = dynamic(() => import("@/components/Links"), {
  loading: () => <LoadingPlaceholder />,
  ssr: false
});

const About = dynamic(() => import("@/components/sections/About"), {
  loading: () => <LoadingPlaceholder />,
  ssr: false
});

const Skills = dynamic(() => import("@/components/sections/Skills"), {
  loading: () => <LoadingPlaceholder />,
  ssr: false
});

// Memoized loading placeholder
const LoadingPlaceholder = memo(() => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="animate-pulse bg-gray-200 rounded-lg w-full h-64" />
  </div>
));

LoadingPlaceholder.displayName = 'LoadingPlaceholder';

// Animation variants with improved performance
const pageTransitionVariants = {
  initial: { 
    opacity: 0, 
    x: 100,
    transition: { duration: 0.3 }
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    x: 100,
    transition: { duration: 0.2 }
  },
};

// Component selector function
function getComponent(route: string) {
  switch (route) {
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
      return <div aria-label="Home" />;
    default:
      return null;
  }
}

export default function ContentView() {
  const { currentRoute, isReady } = useNavigation();
  const { width, height } = useWindowSize();
  const isPortrait = height > width;

  if (!isReady || isPortrait) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
      <AnimatePresence mode="sync">
        <motion.div
          key={currentRoute}
          variants={pageTransitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="h-full p-8"
        >
          <Suspense fallback={<LoadingPlaceholder />}>
            {getComponent(currentRoute)}
          </Suspense>
        </motion.div>
      </AnimatePresence>
  );
}
