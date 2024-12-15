import { motion } from 'framer-motion'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { useWindowSize } from '@/hooks/useWindowSize'

export default function Projects() {
  const { width } = useWindowSize()
  const isPortrait = width < 768

  const projects = [
    {
      title: "E-commerce App",
      description: "A full-featured mobile commerce platform built with React Native and TypeScript, featuring Redux for state management and Stripe for payments.",
      tech: "React Native, TypeScript, Redux",
      image: "/project1.png"
    },
    {
      title: "Social Media Platform",
      description: "Native iOS social networking app developed using Swift and SwiftUI, integrated with Firebase for real-time updates and cloud storage.",
      tech: "Swift, SwiftUI, Firebase",
      image: "/project2.png"
    },
    {
      title: "Fitness Tracking App",
      description: "Cross-platform fitness application with real-time workout tracking, social features, and cloud sync using AWS AppSync.",
      tech: "React Native, GraphQL, AWS",
      image: "/project3.png"
    }
  ]

  const ProjectCard = ({ project, index }: { project: typeof projects[0], index: number }) => {
    if (isPortrait) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card rounded-lg p-6 shadow-lg"
        >
          <div className="aspect-video bg-muted rounded-lg mb-4" />
          <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
          <p className="text-muted-foreground mb-4">{project.description}</p>
          <p className="text-sm text-muted-foreground">{project.tech}</p>
        </motion.div>
      )
    }

    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="group relative bg-card rounded-lg p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="aspect-video bg-muted rounded-lg mb-4" />
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-muted-foreground text-sm">{project.tech}</p>
          </motion.div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">{project.title}</h4>
            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    )
  }

  return (
    <section className="py-8 md:py-12 lg:py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
