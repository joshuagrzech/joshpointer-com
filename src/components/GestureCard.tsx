import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Card, CardContent } from './ui/card';

interface GestureCardProps {
  children: React.ReactNode;
}

export function GestureCard({ children }: GestureCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const springConfig = { stiffness: 100, damping: 10 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  function handleMouse(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{
        perspective: 2000,
        transformStyle: "preserve-3d"
      }}
      className="cursor-pointer"
      onPointerMove={handleMouse}
      onPointerLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY
        }}
        className="w-full"
      >
        <Card className="w-full">
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
