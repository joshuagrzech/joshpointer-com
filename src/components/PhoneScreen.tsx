import { motion } from "framer-motion";
import { useNavigationStore } from "@/lib/store";
import type { NavItem } from "@/lib/types";
import {
  Home,
  FolderKanban,
  Mail,
  Link,
  User,
  Wrench,
  Book,
} from "lucide-react";
import { useWindowSize } from "@/hooks/useWindowSize";

export const getIcon = (icon: string) => {
  switch (icon) {
    case "home":
      return <Home size={24} />;
    case "about":
      return <User size={24} />;
    case "folder":
      return <FolderKanban size={24} />;
    case "skills":
      return <Wrench size={24} />;
    case "blog":
      return <Book size={24} />;
    case "link":
      return <Link size={24} />;
    case "mail":
      return <Mail size={24} />;
    case "user":
      return <User size={24} />;
    case "wrench":
      return <Wrench size={24} />;
    case "book":
      return <Book size={24} />;
    default:
      return null;
  }
};

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "about", label: "About", icon: "user" },
  { id: "projects", label: "Projects", icon: "folder" },
  { id: "skills", label: "Skills", icon: "wrench" },
  { id: "blog", label: "Blog", icon: "book" },
  { id: "links", label: "Links", icon: "link" },
  { id: "contact", label: "Contact", icon: "mail" },
];

const getGradientColor = (index: number) => {
  const colors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-green-500 to-green-600",
    "from-red-500 to-red-600",
    "from-yellow-500 to-yellow-600",
    "from-pink-500 to-pink-600",
    "from-indigo-500 to-indigo-600",
  ];
  return colors[index % colors.length];
};

export default function PhoneScreen() {
  const { setRoute } = useNavigationStore();
  const { width, height } = useWindowSize();
  const isPortrait = height > width;

  if (isPortrait) {
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-1/4 h-[32px] bg-black rounded-2xl" />
        {/* iOS Status Bar */}
        <div className="absolute top-2 w-full h-8 px-4 flex justify-between items-center bg-transparent">
          <div className="text-lg font-medium">9:41</div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4"></div>
            <div className="w-4 h-4">
              <svg viewBox="0 0 24 24" className="w-full h-full scale-150">
                <path
                  fill="currentColor"
                  d="M2 9.5V14.5H5L9 19.5V4.5L5 9.5H2Z"
                />
              </svg>
            </div>
            <div className="w-10 h-4 bg-current rounded-sm" />
          </div>
        </div>

        {/* Widget */}
        <div className="px-4 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-lg"
          >
            <h1 className="text-2xl font-semibold text-gray-900">John Doe</h1>
            <p className="text-sm text-gray-600">Mobile Developer</p>
          </motion.div>
        </div>

        {/* App Grid */}
        <div className="px-6 mt-8">
          <div className="grid grid-cols-4 gap-6">
            {navItems
              .filter((item) => item.label !== "Home")
              .map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => setRoute(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex flex-col items-center justify-center`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradientColor(
                      index
                    )} flex items-center justify-center shadow-lg`}
                  >
                    {getIcon(item.icon)}
                  </div>
                  <span className="text-xs mt-2 font-medium text-gray-900">
                    {item.label}
                  </span>
                </motion.button>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-[300px] h-[600px] bg-gradient-to-b from-slate-100 to-slate-200 rounded-[40px] shadow-xl overflow-hidden border-4 border-slate-300">
      {/* Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/4 h-[24px] bg-black rounded-2xl" />
      {/* iOS Status Bar */}
      <div className="absolute top-0 w-full h-8 px-8 pt-2 flex justify-between items-center bg-transparent">
        <div className="text-xs font-medium">9:41</div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path fill="currentColor" d="M2 9.5V14.5H5L9 19.5V4.5L5 9.5H2Z" />
            </svg>
          </div>
          <div className="w-6 h-3 bg-current rounded-sm" />
        </div>
      </div>
      {/* Widget */}
      <div className="px-4 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white/60 backdrop-blur-xl rounded-3xl p-4 shadow-lg"
        >
          <h1 className="text-xl font-semibold text-gray-900">John Doe</h1>
          <p className="text-xs text-gray-600">Mobile Developer</p>
        </motion.div>
      </div>

      {/* App Grid */}
      <div className="p-4 mt-4">
        <div className="grid grid-cols-3 gap-4">
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => setRoute(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex flex-col items-center justify-center`}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getGradientColor(
                  index
                )} flex items-center justify-center shadow-lg`}
              >
                {getIcon(item.icon)}
              </div>
              <span className="text-xs mt-2 font-medium text-gray-900">
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full" />
    </div>
  );
}
