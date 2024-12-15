import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Quote } from 'lucide-react';

interface Testimonial {
  content: string;
  author: string;
  role: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    content: "Working with Josh was a game-changer for our mobile app. His expertise in React Native helped us deliver a seamless cross-platform experience.",
    author: "Sarah Johnson",
    role: "Product Manager",
    company: "TechStart Inc."
  },
  {
    content: "The attention to detail and performance optimization in our iOS app was impressive. Josh's knowledge of native development really shows.",
    author: "Michael Chen",
    role: "CTO",
    company: "AppWorks"
  },
  {
    content: "Not only did Josh deliver an exceptional app, but his communication and project management skills made the process smooth and efficient.",
    author: "Emily Rodriguez",
    role: "Founder",
    company: "Digital Solutions"
  }
];

export default function TestimonialSection() {
  return (
    <section className="py-20 px-4 bg-secondary/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Client Testimonials
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here's what clients say about working with me
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary mb-4" />
                  <p className="text-lg mb-6">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
