import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

const experiences: Experience[] = [
  {
    title: 'Senior Mobile Software Engineer',
    company: 'MobileFirst Technologies',
    period: '2022 - Present',
    description:
      'Leading mobile development initiatives for a fintech startup, building scalable React Native applications with over 500K active users. Mentoring junior developers and establishing mobile development best practices.',
    technologies: ['React Native', 'TypeScript', 'Redux Toolkit', 'Firebase', 'Jest', 'Fastlane'],
    achievements: [
      'Led development of flagship finance app with 500K+ downloads',
      'Improved app performance by 40% through optimization',
      'Established CI/CD pipeline reducing deployment time by 60%',
      'Mentored 3 junior developers in React Native best practices',
    ],
  },
  {
    title: 'Mobile Software Engineer',
    company: 'HealthTech Solutions',
    period: '2020 - 2022',
    description:
      'Developed healthcare applications using React Native and iOS, focusing on HIPAA compliance and user privacy. Built features for patient monitoring and telemedicine capabilities.',
    technologies: ['React Native', 'iOS (Swift)', 'HealthKit', 'Firebase', 'GraphQL', 'Jest'],
    achievements: [
      'Built HIPAA-compliant patient monitoring app',
      'Integrated Apple HealthKit for seamless data sync',
      'Reduced app crash rate by 70% through error handling',
      'Implemented real-time telemedicine features',
    ],
  },
  {
    title: 'React Native Developer',
    company: 'EcoDelivery Inc',
    period: '2018 - 2020',
    description:
      'Built sustainable food delivery platform with real-time tracking and carbon footprint calculation. Focused on performance optimization and user experience.',
    technologies: [
      'React Native',
      'JavaScript',
      'Redux',
      'Google Maps API',
      'Socket.io',
      'MongoDB',
    ],
    achievements: [
      'Developed real-time delivery tracking system',
      'Implemented carbon footprint calculation feature',
      'Achieved 4.8/5 App Store rating with 100K+ downloads',
      'Optimized app bundle size by 30%',
    ],
  },
  {
    title: 'Frontend Developer',
    company: 'TechStart Mobile',
    period: '2017 - 2018',
    description:
      'Started as frontend developer, quickly transitioned to mobile development. Built responsive web applications and began learning React Native.',
    technologies: ['React', 'JavaScript', 'CSS', 'Redux', 'React Native', 'Firebase'],
    achievements: [
      'Built 3 responsive web applications',
      'Learned React Native and shipped first mobile app',
      "Contributed to team's transition to mobile-first approach",
      'Improved website performance by 50%',
    ],
  },
];

export default function ExperienceTimeline() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Briefcase className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Professional Experience</h2>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
        {experiences.map((experience, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="relative pl-8"
          >
            <div className="absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">{experience.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {experience.company} • {experience.period}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{experience.description}</p>

                  {/* Achievements */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Key Achievements
                    </h4>
                    <ul className="space-y-1">
                      {experience.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start">
                          <span className="text-primary mr-2">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
