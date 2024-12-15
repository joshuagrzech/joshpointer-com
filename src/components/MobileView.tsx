import { motion, AnimatePresence } from "framer-motion";
import { useNavigationStore } from "@/lib/store";
import Projects from "./Projects";
import Contact from "./Contact";
import Blog from "./Blog";
import Links from "./Links";
import About from "./About";
import Skills from "./Skills";

import type { NavItem } from "@/lib/types";
import PhoneScreen from "./PhoneScreen";
import { IconMap } from "./ui/icons";

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "about", label: "About", icon: "user" },
  { id: "projects", label: "Projects", icon: "folder" },
  { id: "skills", label: "Skills", icon: "wrench" },
  { id: "blog", label: "Blog", icon: "book" },
  { id: "links", label: "Links", icon: "link" },
  { id: "contact", label: "Contact", icon: "mail" },
];

export default function MobileView() {
  const { currentRoute, setRoute } = useNavigationStore();

  const getComponent = () => {
    switch (currentRoute) {
      case "about":
        return <About />;
      case "projects":
        return <Projects />;
      case "skills":
        return <Skills />;
      case "contact":
        return <Contact />;
      case "blog":
        return <Blog />;
      case "links":
        return <Links />;
      case "home":
        return <PhoneScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Content Area */}
      <div className="flex-1 overflow">
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
      {currentRoute !== "home" && (
        <nav className="h-16 bg-background/80 backdrop-blur-lg border-t fixed bottom-0 left-0 right-0">
          <div className="h-full max-w-lg mx-auto px-4 flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = IconMap[item.icon];
              return (
                <button
                  key={item.id}
                  onClick={() => setRoute(item.id)}
                  className={`flex flex-col items-center justify-center space-y-1 ${
                    currentRoute === item.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
