import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Send, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const inputClasses = "w-full p-3 rounded-md border bg-background text-foreground";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get in Touch</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <input
              type="text"
              placeholder="Your Name"
              className={inputClasses}
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <input
              type="email"
              placeholder="Your Email"
              className={inputClasses}
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <textarea
              placeholder="Your Message"
              className={`${inputClasses} min-h-[150px]`}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || submitted}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : submitted ? (
                "Message Sent!"
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </CardContent>
    </Card>
  );
}
