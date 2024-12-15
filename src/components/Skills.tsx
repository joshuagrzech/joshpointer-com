import { motion } from 'framer-motion';

export default function Skills() {
  const skills = {
    languages: ['JavaScript', 'TypeScript', 'Swift', 'Kotlin', 'Java', 'Python'],
    frameworks: [
      'React Native',
      'React',
      'SwiftUI',
      'Express.js',
      'Next.js',
      'Redux',
    ],
    tools: ['Git', 'Xcode', 'Android Studio', 'VS Code', 'Firebase', 'AWS'],
    databases: ['SQLite', 'PostgreSQL', 'MongoDB'],
  };

  return (
    <section className="py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(skills).map(([category, list], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-4">{category}</h3>
              <ul className="list-disc list-inside space-y-2">
                {list.map((skill) => (
                  <li key={skill} className="text-base md:text-lg">
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
