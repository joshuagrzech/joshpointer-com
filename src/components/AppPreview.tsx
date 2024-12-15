import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Phone, Play, Pause } from 'lucide-react';

interface AppPreviewProps {
  title: string;
  description: string;
  videoUrl: string;
  features: string[];
}

export default function AppPreview({ title, description, videoUrl, features }: AppPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const video = document.querySelector('video');
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative">
      <Card className="overflow-hidden">
        <div className="relative aspect-[9/16] md:aspect-[9/19] bg-black">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoUrl}
            loop
            muted
            playsInline
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/50 text-white"
          >
            {isPlaying ? (
              <Pause className="w-16 h-16" />
            ) : (
              <Play className="w-16 h-16" />
            )}
          </motion.button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">{title}</h3>
          </div>
          <p className="text-muted-foreground mb-6">{description}</p>
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Badge variant="secondary">{feature}</Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
