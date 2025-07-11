import { motion, AnimatePresence } from 'framer-motion'
import { useNavigationStore } from '@/lib/store'
import Projects from './Projects'
import Contact from './Contact'
import Blog from './Blog'
import Links from './Links'
import Home from './Home'

export default function ContentView() {
  const { currentRoute } = useNavigationStore()

  const getComponent = () => {
    switch (currentRoute) {
      case 'projects':
        return <Projects />
      case 'contact':
        return <Contact />
      case 'blog':
        return <Blog />
      case 'links':
        return <Links />
      case 'home':
        return <Home />
      default:
        return null
    }
  }

  return (
    <div className="absolute top-0 right-0 w-2/3 h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRoute}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {getComponent()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
