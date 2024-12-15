import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin } from 'lucide-react'

export default function Links() {
  const links = [
    {
      title: "GitHub",
      url: "https://github.com/johndoe",
      icon: <Github className="w-6 h-6" />
    },
    {
      title: "Twitter",
      url: "https://twitter.com/johndoe",
      icon: <Twitter className="w-6 h-6" />
    },
    {
      title: "LinkedIn",
      url: "https://linkedin.com/in/johndoe",
      icon: <Linkedin className="w-6 h-6" />
    }
  ]

  return (
    <div className="h-full p-8">
      <h2 className="text-3xl font-bold mb-8">Links</h2>
      <div className="grid gap-4">
        {links.map((link, index) => (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center p-4 bg-card rounded-lg hover:bg-card/80 transition-colors"
          >
            {link.icon}
            <span className="ml-4">{link.title}</span>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
