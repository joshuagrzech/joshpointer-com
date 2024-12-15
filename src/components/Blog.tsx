import { motion } from 'framer-motion'

export default function Blog() {
  const posts = [
    {
      title: "Building Performant React Native Apps",
      excerpt: "Learn the best practices for optimizing React Native performance...",
      date: "2024-03-15"
    },
    {
      title: "The Future of Mobile Development",
      excerpt: "Exploring upcoming trends in mobile app development...",
      date: "2024-03-10"
    },
    {
      title: "Native vs Cross-Platform Development",
      excerpt: "A comprehensive comparison of development approaches...",
      date: "2024-03-05"
    }
  ]

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:py-12 lg:py-16">
      <h2 className="text-3xl font-bold mb-8">Blog</h2>
      <div className="space-y-6">
        {posts.map((post, index) => (
          <motion.article
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-card rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
            <time className="text-sm text-muted-foreground">{post.date}</time>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
