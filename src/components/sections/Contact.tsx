import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";

interface SocialLink {
  name: string;
  icon: typeof Mail;
  href: string;
  color: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "Email",
    icon: Mail,
    href: "mailto:hello@example.com",
    color: "hover:text-blue-500",
  },
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/username",
    color: "hover:text-gray-900 dark:hover:text-gray-100",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://linkedin.com/in/username",
    color: "hover:text-blue-600",
  },
  {
    name: "Twitter",
    icon: Twitter,
    href: "https://twitter.com/username",
    color: "hover:text-blue-400",
  },
];

export default function Contact() {
  return (
    <div className="space-y-8">
      <ScrollReveal>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Contact</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Feel free to reach out to me through any of these platforms. I&apos;m always open
            to discussing new projects, opportunities, or just having a chat.
          </p>
        </motion.div>
      </ScrollReveal>

      <div className="grid gap-6 md:grid-cols-2">
        {socialLinks.map((link) => (
          <ScrollReveal key={link.name}>
            <Card>
              <CardContent className="p-6">
                <Button
                  variant="ghost"
                  className="w-full h-full justify-start gap-4 text-lg"
                  asChild
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={link.color}
                  >
                    <link.icon className="h-6 w-6" />
                    {link.name}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Let&apos;s Work Together</h2>
            <p className="text-muted-foreground mb-6">
              I&apos;m currently available for freelance work and open to new opportunities.
              If you have a project that you want to get started, think you need my help
              with something, or just want to say hello, then get in touch.
            </p>
            <Button asChild>
              <a href="mailto:hello@example.com">
                <Mail className="mr-2 h-4 w-4" />
                Send me an email
              </a>
            </Button>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
}
