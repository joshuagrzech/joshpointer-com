import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Github, ExternalLink, Download, Star, Users, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProjectsConfig } from '@/lib/config';
import type { Config } from '@/types/config';

export default function Projects() {
  const projects = getProjectsConfig();

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">{projects.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{projects.description}</p>
        </motion.div>
      </ScrollReveal>

      <div className="grid gap-8 md:grid-cols-2">
        {projects.items.map((project: Config['projects']['items'][0], index: number) => (
          <ScrollReveal key={project.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
                        <p className="text-muted-foreground leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {project.github && (
                          <Button variant="ghost" size="icon" asChild>
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`View ${project.title} on GitHub`}
                            >
                              <Github className="h-5 w-5" />
                            </a>
                          </Button>
                        )}
                        {project.url && (
                          <Button variant="ghost" size="icon" asChild>
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`View ${project.title} on App Store`}
                            >
                              <Smartphone className="h-5 w-5" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Metrics */}
                    {project.metrics && (
                      <div className="grid grid-cols-3 gap-4 py-4 border-t border-border">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Download className="h-4 w-4 text-muted-foreground mr-1" />
                          </div>
                          <p className="text-sm font-medium">{project.metrics.downloads}</p>
                          <p className="text-xs text-muted-foreground">Downloads</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Star className="h-4 w-4 text-muted-foreground mr-1" />
                          </div>
                          <p className="text-sm font-medium">{project.metrics.rating}</p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Users className="h-4 w-4 text-muted-foreground mr-1" />
                          </div>
                          <p className="text-sm font-medium">{project.metrics.users}</p>
                          <p className="text-xs text-muted-foreground">Active Users</p>
                        </div>
                      </div>
                    )}

                    {/* Technologies */}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        Technologies Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      {project.github && (
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" />
                            View Code
                          </a>
                        </Button>
                      )}
                      {project.url && (
                        <Button size="sm" asChild className="flex-1">
                          <a href={project.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View App
                          </a>
                        </Button>
                      )}
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
