'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
  minDuration?: number;
  showProgress?: boolean;
  progressSteps?: string[];
  onComplete?: () => void;
}

export default function LoadingState({
  isLoading,
  children,
  fallback,
  delay = 200,
  minDuration = 500,
  showProgress = false,
  progressSteps = [],
  onComplete,
}: LoadingStateProps) {
  const [shouldShow, setShouldShow] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setStartTime(Date.now());
      const timer = setTimeout(() => setShouldShow(true), delay);
      return () => clearTimeout(timer);
    } else {
      const elapsed = startTime ? Date.now() - startTime : 0;
      const remaining = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        setShouldShow(false);
        setProgress(0);
        setCurrentStep(0);
        onComplete?.();
      }, remaining);
    }
  }, [isLoading, delay, minDuration, startTime, onComplete]);

  // Simulate progress steps
  useEffect(() => {
    if (shouldShow && showProgress && progressSteps.length > 0) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= progressSteps.length) {
            clearInterval(interval);
            return prev;
          }
          setProgress((next / progressSteps.length) * 100);
          return next;
        });
      }, 800);

      return () => clearInterval(interval);
    }
  }, [shouldShow, showProgress, progressSteps]);

  const defaultFallback = (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border rounded-lg p-8 shadow-lg max-w-sm w-full mx-4">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />

          {showProgress && progressSteps.length > 0 && (
            <div className="space-y-3">
              <div className="w-full bg-secondary rounded-full h-2">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="text-sm text-muted-foreground">
                {progressSteps[currentStep] || 'Loading...'}
              </div>

              <div className="text-xs text-muted-foreground">{Math.round(progress)}% complete</div>
            </div>
          )}

          {!showProgress && (
            <div className="text-sm text-muted-foreground">Loading your experience...</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence mode="wait">
        {shouldShow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {fallback || defaultFallback}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!shouldShow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Specialized loading components
export function SkeletonLoader({ className = 'h-4 bg-muted rounded' }: { className?: string }) {
  return <div className={`animate-pulse ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonLoader className="h-6 bg-muted rounded w-3/4" />
      <SkeletonLoader className="h-4 bg-muted rounded w-full" />
      <SkeletonLoader className="h-4 bg-muted rounded w-2/3" />
    </div>
  );
}

export function GridSkeleton({ rows = 3, cols = 2 }: { rows?: number; cols?: number }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} className="bg-card border rounded-lg p-4 space-y-3">
          <SkeletonLoader className="h-5 bg-muted rounded w-1/2" />
          <SkeletonLoader className="h-4 bg-muted rounded w-full" />
          <SkeletonLoader className="h-4 bg-muted rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}
