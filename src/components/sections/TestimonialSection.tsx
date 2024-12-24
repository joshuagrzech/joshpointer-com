import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface Testimonial {
  content: string;
  author: string;
  role: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    content: "An exceptional developer who consistently delivers high-quality work. Their attention to detail and problem-solving skills are outstanding.",
    author: "Sarah Johnson",
    role: "CTO",
    company: "Tech Innovations",
  },
  {
    content: "Working with them was a great experience. They not only delivered the project on time but also provided valuable insights throughout the development process.",
    author: "Michael Chen",
    role: "Product Manager",
    company: "Digital Solutions",
  },
  {
    content: "Their technical expertise and ability to understand complex requirements made our project a success. Highly recommended!",
    author: "Emily Rodriguez",
    role: "Engineering Lead",
    company: "Software Corp",
  },
];

export default function TestimonialSection() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Quote className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Testimonials</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-muted-foreground flex-grow">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="mt-6">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
