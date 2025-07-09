import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Smartphone,
  FileText,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { getContactConfig, getLinksConfig } from '@/lib/config';
import type { Config } from '@/types/config';

export default function Contact() {
  const contact = getContactConfig();
  const links = getLinksConfig();

  const socialLinks = links.filter((link: Config['links'][0]) =>
    ['Email', 'GitHub', 'LinkedIn', 'Twitter', 'App Store', 'Resume'].includes(link.title)
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
          <p className="text-lg text-muted-foreground mb-8">{contact.description}</p>
        </motion.div>
      </ScrollReveal>

      {/* Availability Status */}
      {contact.availability && (
        <ScrollReveal>
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    Currently Available
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {contact.availability}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      )}

      {/* Social Links */}
      <div className="grid gap-4 md:grid-cols-2">
        {socialLinks.map((link: Config['links'][0], index: number) => (
          <ScrollReveal key={link.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
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
                      {link.icon === 'mail' && <Mail className="h-6 w-6" />}
                      {link.icon === 'github' && <Github className="h-6 w-6" />}
                      {link.icon === 'linkedin' && <Linkedin className="h-6 w-6" />}
                      {link.icon === 'twitter' && <Twitter className="h-6 w-6" />}
                      {link.icon === 'smartphone' && <Smartphone className="h-6 w-6" />}
                      {link.icon === 'file-text' && <FileText className="h-6 w-6" />}
                      {link.title}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>

      {/* Contact Form CTA */}
      <ScrollReveal>
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">Let&apos;s Work Together</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                I&apos;m passionate about creating exceptional mobile experiences. Whether you have
                a project in mind, want to discuss mobile development opportunities, or just want to
                say hello, I&apos;d love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <a href={`mailto:${contact.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send me an email
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a
                    href="https://calendly.com/joshpointer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule a call
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
}
