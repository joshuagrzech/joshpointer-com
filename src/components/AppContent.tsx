import React from "react";
import { HomeContent } from "@/components/HomeContent";
import { AboutContent } from "@/components/AboutContent";

export const AppContent = ({ activeApp }: { activeApp: string }) => {
  const contentComponents = {
    home: HomeContent,
    about: AboutContent,
    projects: () => (
      <div className="h-full w-full bg-green-500 p-4">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
      </div>
    ),
    skills: () => (
      <div className="h-full w-full bg-red-500 p-4">
        <h1 className="text-2xl font-bold text-white">Skills</h1>
      </div>
    ),
    blog: () => (
      <div className="h-full w-full bg-yellow-500 p-4">
        <h1 className="text-2xl font-bold text-white">Blog</h1>
      </div>
    ),
    links: () => (
      <div className="h-full w-full bg-pink-500 p-4">
        <h1 className="text-2xl font-bold text-white">Links</h1>
      </div>
    ),
    contact: () => (
      <div className="h-full w-full bg-indigo-500 p-4">
        <h1 className="text-2xl font-bold text-white">Contact</h1>
      </div>
    ),
  } as const;

  const ContentComponent = contentComponents[activeApp as keyof typeof contentComponents] || (() => null);
  return <ContentComponent />;
};
