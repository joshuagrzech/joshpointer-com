import React from "react";
import { HomeContent } from "@/components/HomeContent";
import { AboutContent } from "@/components/AboutContent";
import { useConfig } from "@/contexts/ConfigContext";
import { Card, CardContent } from "@/components/ui/card";

export const AppContent = ({ activeApp }: { activeApp: string }) => {
  const { config, isLoading } = useConfig();

  if (isLoading || !config) {
    return null;
  }

  const contentComponents = {
    home: HomeContent,
    about: AboutContent,
    projects: () => (
      <div className="h-full w-full p-4">
        <h1 className="text-2xl font-bold mb-6">{config.projects[0].title}</h1>
        <div className="grid gap-6">
          {config.projects.map((project, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {project.tech.split(", ").map((tech) => (
                    <span key={tech} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ),
    skills: () => (
      <div className="h-full w-full p-4">
        <h1 className="text-2xl font-bold mb-6">Skills</h1>
        <div className="grid gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Languages</h2>
              <div className="flex gap-2 flex-wrap">
                {config.skills.languages.map((lang) => (
                  <span key={lang} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Frameworks</h2>
              <div className="flex gap-2 flex-wrap">
                {config.skills.frameworks.map((framework) => (
                  <span key={framework} className="bg-secondary/10 text-secondary-foreground px-2 py-1 rounded-md text-sm">
                    {framework}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
    blog: () => (
      <div className="h-full w-full p-4">
        <h1 className="text-2xl font-bold mb-6">{config.blog.title}</h1>
        <div className="grid gap-6">
          {config.blog.posts.map((post, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-muted-foreground mb-2">{post.excerpt}</p>
                <time className="text-sm text-muted-foreground">{post.date}</time>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ),
    links: () => (
      <div className="h-full w-full p-4">
        <h1 className="text-2xl font-bold mb-6">Links</h1>
        <div className="grid gap-4">
          {config.links.map((link, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary hover:underline"
                >
                  {link.title}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ),
    contact: () => (
      <div className="h-full w-full p-4">
        <h1 className="text-2xl font-bold mb-6">{config.contact.title}</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">{config.contact.description}</p>
            <a
              href={config.contact.email}
              className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Get in Touch
            </a>
          </CardContent>
        </Card>
      </div>
    ),
  } as const;

  const ContentComponent = contentComponents[activeApp as keyof typeof contentComponents] || (() => null);
  return <ContentComponent />;
};
