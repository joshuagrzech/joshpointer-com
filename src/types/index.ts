// @/types/index.ts

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export type IconType =
  | "home"
  | "about"
  | "folder"
  | "skills"
  | "book"
  | "link"
  | "mail"
  | "user"
  | "wrench"
  | "blog";

export interface Branding {
  name: string;
  tagline: string;
}

export interface SelectedIcon {
  id: string;
  index: number;
  rect: {
    x: number;
    y: number;
  };
}

export interface OpenAppProps {
  activeApp: string | null;
  handleAppClose: () => void;
  selectedIcon: SelectedIcon;
}

export interface AppGridProps {
  handleAppClick: (item: NavItem, index: number) => void;
  setBackgroundGradient?: (gradient: [string, string]) => void;
}

export interface WidgetProps {
  branding: Branding;
}

export interface AppOpenProps extends WidgetProps {
  handleAppClick: (item: NavItem, index: number) => void;
  setBackgroundGradient?: (gradient: [string, string]) => void;
}

export type Route =
  | "home"
  | "about"
  | "projects"
  | "skills"
  | "contact"
  | "blog"
  | "links"
  | "admin"
