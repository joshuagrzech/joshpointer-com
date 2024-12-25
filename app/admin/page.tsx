'use client';

import { useEffect, useState } from 'react';
import { Config, useConfig } from '@/contexts/ConfigContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConfigSection from '@/components/admin/ConfigSection';

export default function AdminPage() {
  const { config, isLoading } = useConfig();
  const [isDev, setIsDev] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<Config>();

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  useEffect(() => {
    if (config) {
      setCurrentConfig(config);
    }
  }, [config]);

  if (!isDev) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
            <p className="mt-2">This page is only available in development mode.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !currentConfig) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6">
            <p>Loading configuration...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleConfigUpdate = async (section: string, value: unknown) => {
    try {
      const updatedConfig = {
        ...currentConfig,
        [section]: value,
      };
      setCurrentConfig(updatedConfig);

      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedConfig),
      });

      if (!response.ok) {
        throw new Error('Failed to update configuration');
      }
    } catch (error) {
      console.error('Error updating configuration:', error);
    }
  };

  return (
    <div className="absolute top-0 left-0 p-8 z-50 w-full">
      <Card className='w-0.5'>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-6">Configuration Editor</h1>
          <Tabs defaultValue="theme">
            <TabsList className="mb-4">
              <TabsTrigger value="theme">Theme</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="ui">UI</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            <TabsContent value="theme">
              <ConfigSection
                title="Theme Configuration"
                data={currentConfig.theme}
                onUpdate={(value) => handleConfigUpdate('theme', value)}
              />
            </TabsContent>

            <TabsContent value="branding">
              <ConfigSection
                title="Branding Configuration"
                data={currentConfig.branding}
                onUpdate={(value) => handleConfigUpdate('branding', value)}
              />
            </TabsContent>

            <TabsContent value="ui">
              <ConfigSection
                title="UI Configuration"
                data={currentConfig.ui}
                onUpdate={(value) => handleConfigUpdate('ui', value)}
              />
            </TabsContent>

            <TabsContent value="navigation">
              <ConfigSection
                title="Navigation Configuration"
                data={currentConfig.navigation}
                onUpdate={(value) => handleConfigUpdate('navigation', value)}
              />
            </TabsContent>

            <TabsContent value="content">
              <ConfigSection
                title="Content Configuration"
                data={{
                  hero: currentConfig.hero,
                  about: currentConfig.about,
                  process: currentConfig.process,
                  testimonials: currentConfig.testimonials,
                  projects: currentConfig.projects,
                  skills: currentConfig.skills,
                  blog: currentConfig.blog,
                  contact: currentConfig.contact,
                  footer: currentConfig.footer,
                }}
                onUpdate={(value) => {
                  Object.entries(value as Record<string, unknown>).forEach(([key, val]) => {
                    handleConfigUpdate(key, val);
                  });
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 