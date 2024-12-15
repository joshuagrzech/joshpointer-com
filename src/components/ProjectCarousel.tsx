import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react';
import { Button } from './ui/button';

interface Project {
  title: string;
  description: string;
  image: string;
  tech: string[];
  github: string;
  demo: string;
  features: string[];
}

const projects: Project[] = [
  {
    title: "E-commerce Mobile App",
    description: "A full-featured mobile commerce platform with seamless payment integration",
    image: "/project1.png",
    tech: ["React Native", "TypeScript", "Redux", "Stripe"],
    github: "https://github.com/example/ecommerce",
    demo: "https://demo.example.com",
    features: ["Secure Payments", "Real-time Inventory", "Push Notifications"]
  },
  // Add more projects...
];

export default function ProjectCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + projects.length) % projects.length);
  };

  const currentProject = projects[currentIndex];

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute w-full h-full"
        >
          <Card className="h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="relative aspect-video mb-6 overflow-hidden rounded-lg">
                <img
                  src={currentProject.image}
                  alt={currentProject.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <h3 className="text-2xl font-bold mb-4">{currentProject.title}</h3>
              <p className="text-muted-foreground mb-6">{currentProject.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {currentProject.tech.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {currentProject.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-4 mt-auto">
                <Button variant="outline" className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  View Code
                </Button>
                <Button className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <Button
        variant="ghost"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
        onClick={() => paginate(-1)}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
        onClick={() => paginate(1)}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-primary" : "bg-primary/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
