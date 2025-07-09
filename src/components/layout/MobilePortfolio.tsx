'use client';

import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useNavigation } from '@/hooks/useNavigation';
import { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { getNavigationConfig, getBrandingConfig } from '@/lib/config';

// Dynamic imports for sections
const About = dynamic(() => import('@/components/sections/About'));
const Projects = dynamic(() => import('@/components/sections/Projects'));
const Skills = dynamic(() => import('@/components/sections/Skills'));
const Contact = dynamic(() => import('@/components/sections/Contact'));
const Blog = dynamic(() => import('@/components/sections/Blog'));
const Links = dynamic(() => import('@/components/Links'));

export default function MobilePortfolio() {
  const { currentRoute, navigate } = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigation = getNavigationConfig();
  const branding = getBrandingConfig();

  const renderContent = () => {
    switch (currentRoute) {
      case 'about':
        return <About />;
      case 'projects':
        return <Projects />;
      case 'skills':
        return <Skills />;
      case 'contact':
        return <Contact />;
      case 'blog':
        return <Blog />;
      case 'links':
        return <Links />;
      default:
        return (
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-bold">{branding.name}</h1>
              <p className="text-lg text-muted-foreground">{branding.tagline}</p>
              <p className="text-muted-foreground max-w-md mx-auto">
                {branding.description}
              </p>
              <motion.button
                onClick={() => navigate('about')}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
                <ChevronRight size={16} />
              </motion.button>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <motion.h1 
            className="text-xl font-bold"
            onClick={() => navigate('home')}
            whileTap={{ scale: 0.95 }}
          >
            {branding.name}
          </motion.h1>
          
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg bg-muted"
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-muted/50 border-b border-border overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navigation.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    navigate(item.id as any);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentRoute === item.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-background'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Alternative) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
        <div className="flex justify-center">
          <motion.button
            onClick={() => navigate('contact')}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
          </motion.button>
        </div>
      </nav>
    </div>
  );
} 