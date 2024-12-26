import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";
import { getContactConfig, getLinksConfig } from "@/lib/config";
import type { Config } from "@/types/config";

export default function Contact() {
  const contact = getContactConfig();
  const links = getLinksConfig();

  const socialLinks = links.filter((link: Config["links"][0]) => 
    ["Email", "GitHub", "LinkedIn", "Twitter"].includes(link.title)
  );

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">{contact.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">
            {contact.description}
          </p>
        </motion.div>
      </ScrollReveal>

      <div className="grid gap-6 md:grid-cols-2">
        {socialLinks.map((link: Config["links"][0]) => (
          <ScrollReveal key={link.title}>
            <Card>
              <CardContent className="p-6">
                <Button
                  variant="ghost"
                  className="w-full h-full justify-start gap-4 text-lg"
                  asChild
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    {link.icon === "mail" && <Mail className="h-6 w-6" />}
                    {link.icon === "github" && <Github className="h-6 w-6" />}
                    {link.icon === "linkedin" && <Linkedin className="h-6 w-6" />}
                    {link.icon === "twitter" && <Twitter className="h-6 w-6" />}
                    {link.title}
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
              <a href={`mailto:${contact.email}`}>
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
