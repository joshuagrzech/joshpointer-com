import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getSkillsConfig } from "@/lib/config";
import type { Config } from "@/types/config";

export default function Skills() {
  const skills = getSkillsConfig();

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">{skills.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">
            {skills.description}
          </p>
        </motion.div>
      </ScrollReveal>

      <div className="grid gap-6 md:grid-cols-2">
        {skills.categories.map((category: Config["skills"]["categories"][0]) => (
          <ScrollReveal key={category.name}>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
