import config from '../../public/config.json';
import type { Config } from '@/types/config';

export const siteConfig = config as Config;

// Type-safe getter functions
export function getThemeConfig() {
  return siteConfig.theme;
}

export function getBrandingConfig() {
  return siteConfig.branding;
}

export function getNavigationConfig() {
  return siteConfig.navigation;
}

export function getProcessConfig() {
  return siteConfig.process;
}

export function getTestimonialsConfig() {
  return siteConfig.testimonials;
}

export function getProjectsConfig() {
  return siteConfig.projects;
}

export function getSkillsConfig() {
  return siteConfig.skills;
}

export function getBlogConfig() {
  return siteConfig.blog;
}

export function getLinksConfig() {
  return siteConfig.links;
}

export function getContactConfig() {
  return siteConfig.contact;
}

export function getFooterConfig() {
  return siteConfig.footer;
}

export function getAboutConfig() {
  return siteConfig.about;
}

export function getHeroConfig() {
  return siteConfig.hero;
}
