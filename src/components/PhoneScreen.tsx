import { motion } from 'framer-motion'
import { useNavigationStore } from '@/lib/store'
import type { NavItem } from '@/lib/types'
import { Home, FolderKanban, Mail, Link, BookOpen } from 'lucide-react'

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
      return <Home size={24} />
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

export default function PhoneScreen() {
  const { setRoute } = useNavigationStore()

  return (
    <div className="relative w-[300px] h-[600px] bg-background/90 backdrop-blur-sm rounded-[40px] shadow-xl overflow-hidden border-4 border-foreground/10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[32px] bg-foreground/10 rounded-b-2xl" />
      <div className="p-6 h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-sm text-muted-foreground">Mobile Developer</p>
          </motion.div>
        </div>
        <nav className="grid grid-cols-3 gap-4">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setRoute(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-card hover:bg-card/80 transition-colors"
            >
              {getIcon(item.icon)}
              <span className="text-xs mt-2">{item.label}</span>
            </motion.button>
          ))}
        </nav>
      </div>
    </div>
  )
}
