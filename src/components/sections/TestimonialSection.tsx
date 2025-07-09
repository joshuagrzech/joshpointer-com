import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { getTestimonialsConfig } from "@/lib/config";
import type { Config } from "@/types/config";

export default function TestimonialSection() {
  const testimonials = getTestimonialsConfig();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Quote className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">{testimonials.title}</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.items.map((testimonial: Config["testimonials"]["items"][0], index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.2 }}
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
