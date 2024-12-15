import { motion } from 'framer-motion';
import { fetchConfig } from '@/lib/config';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';

interface Post {
  title: string;
  excerpt: string;
  date: string;
}

interface BlogConfig {
  title: string;
  posts: Post[];
}

interface Config {
  blog: BlogConfig;
}

export default function Blog() {
  const [blog, setBlog] = useState<BlogConfig | null>(null);

  useEffect(() => {
    async function loadConfig() {
      const data: Config = await fetchConfig();
      setBlog(data.blog);
    }
    loadConfig();
  }, []);

  if (!blog) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <section className="py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            Latest Insights
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {blog.title}
          </h2>
          <p className="text-muted-foreground">
            Thoughts and insights about mobile development, React Native, and iOS
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {blog.posts.map((post, index) => (
            <motion.div key={index} variants={item}>
              <Card className="overflow-hidden">
                <CardHeader className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <time className="text-sm text-muted-foreground">
                      {post.date}
                    </time>
                  </div>
                  <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <motion.a
                    href="#"
                    className="inline-flex items-center text-primary hover:text-primary/80"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
