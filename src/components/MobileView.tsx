import { motion, AnimatePresence } from 'framer-motion'
import { useNavigationStore } from '@/lib/store'
import Projects from './Projects'
import Contact from './Contact'
import Blog from './Blog'
import Links from './Links'
import Home from './Home'
import { Home as HomeIcon, FolderKanban, Mail, Link, BookOpen } from 'lucide-react'
import type { NavItem } from '@/lib/types'

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'blog', label: 'Blog', icon: 'book' },
  { id: 'links', label: 'Links', icon: 'link' },
  { id: 'contact', label: 'Contact', icon: 'mail' }
]

const getIcon = (icon: string) => {
  switch (icon) {
    case 'home':
      return <HomeIcon size={24} />
    case 'folder':
      return <FolderKanban size={24} />
    case 'book':
      return <BookOpen size={24} />
    case 'link':
      return <Link size={24} />
    case 'mail':
      return <Mail size={24} />
    default:
      return null
  }
}

export default function MobileView() {
  const { currentRoute, setRoute } = useNavigationStore()

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
    <div className="min-h-screen flex flex-col">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[calc(100vh-4rem)]"
          >
            {getComponent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <nav className="h-16 bg-background/80 backdrop-blur-lg border-t fixed bottom-0 left-0 right-0">
        <div className="h-full max-w-lg mx-auto px-4 flex items-center justify-around">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setRoute(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 ${
                currentRoute === item.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {getIcon(item.icon)}
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
