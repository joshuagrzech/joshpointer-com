import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function Contact() {
  return (
    <section className="min-h-[calc(100vh-4rem)] md:min-h-0 py-12 md:py-20 px-4 md:px-8 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold"
        >
          Let's Build Something Amazing
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto"
        >
          Looking for a mobile developer who can bring your ideas to life? Let's talk about your project.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button 
            size="lg" 
            variant="secondary" 
            className="rounded-full"
            asChild
          >
            <a href="mailto:contact@example.com">Get in Touch</a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
