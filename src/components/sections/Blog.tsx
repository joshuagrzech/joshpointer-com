import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    title: "Building Modern Web Applications with Next.js 13",
    excerpt: "Learn how to leverage the latest features in Next.js 13 to build fast, modern web applications with great user experience.",
    date: "2023-12-15",
    readTime: "8 min read",
    tags: ["Next.js", "React", "Web Development"],
    slug: "building-modern-web-applications-nextjs-13",
  },
  {
    title: "Understanding TypeScript's Type System",
    excerpt: "A deep dive into TypeScript's type system and how it can help you write more maintainable code.",
    date: "2023-12-10",
    readTime: "10 min read",
    tags: ["TypeScript", "JavaScript", "Programming"],
    slug: "understanding-typescript-type-system",
  },
  // Add more blog posts as needed
];

export default function Blog() {
  return (
    <div className="space-y-8">
      <ScrollReveal>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thoughts, tutorials, and insights about software development and technology.
          </p>
        </motion.div>
      </ScrollReveal>

      <div className="grid gap-6">
        {blogPosts.map((post) => (
          <ScrollReveal key={post.slug}>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold">{post.title}</h2>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-fit" asChild>
                    <a href={`/blog/${post.slug}`}>
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
