import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Calendar, ArrowRight, Clock, Tag } from 'lucide-react';
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
            Thoughts, tutorials, and insights about mobile development, React Native, and iOS
            development.
          </p>
        </motion.div>
      </ScrollReveal>

      <div className="grid gap-6">
        {blog.posts.map((post: Config['blog']['posts'][0], index: number) => (
          <ScrollReveal key={post.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {post.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Title and Excerpt */}
                    <div>
                      <h2 className="text-2xl font-semibold mb-3">{post.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Read More Button */}
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-fit" asChild>
                        <a href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
