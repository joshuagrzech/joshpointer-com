import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBlogConfig } from '@/lib/config';
import type { Config } from '@/types/config';

export default function Blog() {
  const blog = getBlogConfig();

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thoughts, tutorials, and insights about software development and technology.
          </p>
        </motion.div>
      </ScrollReveal>

      <div className="grid gap-6">
        {blog.posts.map((post: Config['blog']['posts'][0]) => (
          <ScrollReveal key={post.title}>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold">{post.title}</h2>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                  <Button variant="outline" size="sm" className="w-fit" asChild>
                    <a href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
