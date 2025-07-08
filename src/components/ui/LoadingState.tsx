'use client';

import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {
  type?: 'loading' | 'error' | 'offline' | 'webgl-unsupported';
  message?: string;
  onRetry?: () => void;
  progress?: number;
}

export default function LoadingState({ 
  type = 'loading', 
  message, 
  onRetry,
  progress 
}: LoadingStateProps) {
  const getContent = () => {
    switch (type) {
      case 'error':
        return {
          icon: <AlertCircle className="w-12 h-12 text-destructive" />,
          title: "Something went wrong",
          description: message || "We encountered an error loading the portfolio. Please try again.",
          showRetry: true
        };
      
      case 'offline':
        return {
          icon: <WifiOff className="w-12 h-12 text-muted-foreground" />,
          title: "You're offline",
          description: "Please check your internet connection and try again.",
          showRetry: true
        };
      
      case 'webgl-unsupported':
        return {
          icon: <AlertCircle className="w-12 h-12 text-warning" />,
          title: "WebGL not supported",
          description: "Your browser doesn't support 3D graphics. You'll see a simplified version of the portfolio.",
          showRetry: false
        };
      
      default:
        return {
          icon: <Loader2 className="w-12 h-12 animate-spin text-primary" />,
          title: "Loading portfolio...",
          description: message || "Please wait while we prepare your experience.",
          showRetry: false
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          {content.icon}
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold mb-2"
        >
          {content.title}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground mb-6"
        >
          {content.description}
        </motion.p>
        
        {progress !== undefined && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="bg-primary h-2 rounded-full"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{Math.round(progress)}% complete</p>
          </motion.div>
        )}
        
        {content.showRetry && onRetry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          </motion.div>
        )}
        
        {/* Subtle loading animation dots */}
        {type === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-1 mt-4"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 h-2 bg-primary rounded-full"
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 