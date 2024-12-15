import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Trophy, Star, Award, Zap } from 'lucide-react';

interface Achievement {
  icon: JSX.Element;
  title: string;
  description: string;
  date: string;
  color: string;
}

const achievements: Achievement[] = [
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "App Store Featured",
    description: "E-commerce app featured on the App Store",
    date: "2023",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "5-Star Rating",
    description: "Maintained 4.8+ rating across all apps",
    date: "2022-2024",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Best Mobile App",
    description: "Winner at Regional Tech Awards",
    date: "2023",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Performance Champion",
    description: "Optimized app load time by 60%",
    date: "2024",
    color: "from-green-500 to-emerald-500"
  }
];

export default function AchievementBadges() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {achievements.map((achievement, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${achievement.color}" />
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center text-white mb-4`}>
                {achievement.icon}
              </div>
              <h3 className="font-semibold mb-2">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {achievement.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {achievement.date}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
