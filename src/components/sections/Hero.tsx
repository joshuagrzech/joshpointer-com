import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Smartphone, Code, Zap, Users } from 'lucide-react';
import { getHeroConfig, getBrandingConfig } from '@/lib/config';

export default function Hero() {
  const hero = getHeroConfig();
  const branding = getBrandingConfig();

  const stats = [
    { label: 'Years Experience', value: '5+', icon: Code },
    { label: 'Apps Built', value: '15+', icon: Smartphone },
    { label: 'Active Users', value: '500K+', icon: Users },
    { label: 'Performance Gain', value: '40%', icon: Zap },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center space-y-12 py-8">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Badge variant="outline" className="mb-4 text-sm">
              Senior Mobile Software Engineer
            </Badge>
          </motion.div>

          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
            {hero.title}
          </h1>

          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl leading-relaxed">
            {hero.subtitle}
          </p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button size="lg" asChild>
          <a href="#projects">
            View My Work <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <a href="#contact">Get In Touch</a>
        </Button>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
      >
        <a href="#about" className="hover:text-primary transition-colors">
          About
        </a>
        <span>•</span>
        <a href="#skills" className="hover:text-primary transition-colors">
          Skills
        </a>
        <span>•</span>
        <a href="#blog" className="hover:text-primary transition-colors">
          Blog
        </a>
        <span>•</span>
        <a href="#contact" className="hover:text-primary transition-colors">
          Contact
        </a>
      </motion.div>
    </div>
  );
}
