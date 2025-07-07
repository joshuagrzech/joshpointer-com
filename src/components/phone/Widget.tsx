'use client';

import { motion } from "framer-motion";
import { getBrandingConfig } from "@/lib/config";
import { useTheme } from "next-themes";
import { Clock, MapPin, Mail } from "lucide-react";

export function Widget() {
  const branding = getBrandingConfig();
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-card/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full border border-white/10 overflow-hidden group"
    >
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
        style={{
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
            : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #ffecd2 100%)',
          filter: 'blur(40px)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <motion.div 
          className="flex items-start gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Avatar placeholder */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">
              {branding.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          <div className="flex-1">
            <motion.h3 
              className="font-bold text-4xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {branding.name}
            </motion.h3>
            <motion.p 
              className="text-2xl text-muted-foreground mt-1 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {branding.tagline}
            </motion.p>
          </div>
        </motion.div>

        {/* Quick info */}
        <motion.div 
          className="mt-6 flex items-center gap-6 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>Available for work</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>Remote</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <span>Open to opportunities</span>
          </div>
        </motion.div>

        {/* Status indicator */}
        <motion.div 
          className="mt-4 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-500 font-medium">Active</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
