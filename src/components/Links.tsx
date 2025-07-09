import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Smartphone,
  FileText,
  Download,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { getLinksConfig, getContactConfig } from '@/lib/config';
import type { Config } from '@/types/config';

export default function Links() {
  const links = getLinksConfig();
  const contact = getContactConfig();

  const linkCategories = [
    {
      title: 'Professional',
      links: links.filter((link: Config['links'][0]) =>
        ['LinkedIn', 'Resume'].includes(link.title)
      ),
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Development',
      links: links.filter((link: Config['links'][0]) =>
        ['GitHub', 'App Store'].includes(link.title)
      ),
      icon: Github,
      color: 'text-gray-600',
    },
    {
      title: 'Social',
      links: links.filter((link: Config['links'][0]) => ['Twitter', 'Email'].includes(link.title)),
      icon: Mail,
      color: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Connect & Resources</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find me on various platforms and access my professional resources.
          </p>
        </motion.div>
      </ScrollReveal>

      {/* Resume Download */}
      <ScrollReveal>
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-primary/10">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold">Download Resume</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Get a detailed overview of my experience, skills, and achievements in mobile
                development.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <a href="/resume.pdf" download>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a
                    href="https://calendly.com/joshpointer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Call
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Categorized Links */}
      <div className="grid gap-6 md:grid-cols-3">
        {linkCategories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <ScrollReveal key={category.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg bg-primary/10`}>
                        <IconComponent className={`h-5 w-5 ${category.color}`} />
                      </div>
                      <h3 className="font-semibold">{category.title}</h3>
                    </div>
                    <div className="space-y-3">
                      {category.links.map((link: Config['links'][0]) => (
                        <Button
                          key={link.title}
                          variant="ghost"
                          className="w-full justify-start gap-3"
                          asChild
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                          >
                            {link.icon === 'github' && <Github className="h-5 w-5" />}
                            {link.icon === 'linkedin' && <Linkedin className="h-5 w-5" />}
                            {link.icon === 'twitter' && <Twitter className="h-5 w-5" />}
                            {link.icon === 'mail' && <Mail className="h-5 w-5" />}
                            {link.icon === 'smartphone' && <Smartphone className="h-5 w-5" />}
                            {link.icon === 'file-text' && <FileText className="h-5 w-5" />}
                            <span className="flex-1 text-left">{link.title}</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Contact CTA */}
      <ScrollReveal>
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Ready to Work Together?</h3>
              <p className="text-muted-foreground">
                I'm always interested in new opportunities and exciting projects. Let's discuss how
                I can help bring your mobile app ideas to life.
              </p>
              <Button asChild size="lg">
                <a href={`mailto:${contact.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Get in Touch
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
}
