import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fetchConfig } from "@/lib/config";
import { useEffect, useState } from "react";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Badge } from "./ui/badge";

interface BrandingConfig {
  name: string;
  description: string;
  tagline: string;
}

interface Config {
  branding: BrandingConfig;
  links: Array<{
    title: string;
    url: string;
    icon: string;
  }>;
}

export default function Home() {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    async function loadConfig() {
      const data: Config = await fetchConfig();
      setConfig(data);
    }
    loadConfig();
  }, []);

  if (!config) return null;

  const { branding, links } = config;

  const socialIcons = {
    github: <Github className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    mail: <Mail className="w-5 h-5" />,
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] md:min-h-0 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-3xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Badge variant="secondary" className="mb-4">
            Available for hire
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {"Hi, I'm "}
            {branding.name}
          </h1>
          <h2 className="text-2xl md:text-3xl text-muted-foreground font-medium">
            {branding.tagline}
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground"
        >
          {branding.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" className="group">
            View My Work
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <div className="flex gap-4">
            {links.map((link) => (
              <motion.a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                {socialIcons[link.icon as keyof typeof socialIcons]}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
