import { motion } from 'framer-motion';

export default function About() {
  return (
    <section className="py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold"
        >
          About Me
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          I'm a passionate mobile developer with over 5 years of experience in creating high-performance, user-friendly mobile applications. My expertise lies in React Native and iOS development, and I'm always eager to learn and explore new technologies. I'm driven by the challenge of building innovative solutions that solve real-world problems and enhance user experiences. My goal is to contribute my skills and passion to a dynamic team where I can continue to grow and make a significant impact.
        </motion.p>
      </div>
    </section>
  );
}
