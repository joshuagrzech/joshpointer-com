import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-2xl space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold"
        >
          Hi, I'm John Doe
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground"
        >
          I'm a mobile developer specializing in creating exceptional digital experiences. 
          With expertise in React Native and iOS development, I help businesses bring their 
          ideas to life through intuitive and performant mobile applications.
        </motion.p>
      </div>
    </div>
  )
}
