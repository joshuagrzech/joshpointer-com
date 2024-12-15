import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fetchConfig } from '@/lib/config';
import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Mail, MessageSquare, Clock } from 'lucide-react';

interface ContactConfig {
  title: string;
  description: string;
  email: string;
}

interface Config {
  contact: ContactConfig;
}

const contactMethods = [
  {
    icon: <Mail className="h-6 w-6" />,
    title: 'Email',
    description: 'Drop me a line anytime',
    action: 'Send Email',
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'Chat',
    description: 'Let\'s discuss your project',
    action: 'Start Chat',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Availability',
    description: 'Book a consultation',
    action: 'Schedule Call',
  },
];

export default function Contact() {
  const [contact, setContact] = useState<ContactConfig | null>(null);

  useEffect(() => {
    async function loadConfig() {
      const data: Config = await fetchConfig();
      setContact(data.contact);
    }
    loadConfig();
  }, []);

  if (!contact) return null;

  return (
    <section className="py-12 md:py-20 px-4 md:px-8 bg-gradient-to-b from-background to-secondary">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {contact.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {contact.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-4">
                    {method.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {method.description}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-auto"
                    asChild
                  >
                    <a href={contact.email}>
                      {method.action}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Prefer traditional email?
          </p>
          <Button
            size="lg"
            className="rounded-full"
            asChild
          >
            <a href={contact.email}>
              Get in Touch
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
