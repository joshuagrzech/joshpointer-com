import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Code2, Smartphone, Zap, Rocket } from 'lucide-react';

const processes = [
  {
    icon: <Code2 className="w-8 h-8" />,
    title: "Development",
    description: "Writing clean, maintainable code with modern best practices and patterns."
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Testing",
    description: "Rigorous testing across multiple devices and platforms to ensure quality."
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Optimization",
    description: "Performance tuning and optimization for smooth user experience."
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "Deployment",
    description: "Streamlined deployment process with CI/CD pipelines."
  }
];

export default function ProcessSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Development Process
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A systematic approach to building high-quality mobile applications
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {processes.map((process, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
                      {process.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{process.title}</h3>
                    <p className="text-muted-foreground">{process.description}</p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
