import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Home,
  User,
  Folder,
  Wrench,
  Book,
  Link,
  type LucideIcon,
  PersonStandingIcon,
  Lightbulb,
  Code2,
  CheckCircle,
  Rocket,
} from "lucide-react";

export type IconName =
  | "github"
  | "twitter"
  | "linkedin"
  | "mail"
  | "home"
  | "user"
  | "folder"
  | "wrench"
  | "book"
  | "link"
  | "about"
  | "skills"
  | "blog"
  | "lightbulb"
  | "code"
  | "check"
  | "rocket";

export const IconMap: Record<IconName, LucideIcon> = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  mail: Mail,
  home: Home,
  user: User,
  folder: Folder,
  wrench: Wrench,
  book: Book,
  link: Link,
  about: PersonStandingIcon,
  skills: Wrench,
  blog: Book,
  lightbulb: Lightbulb,
  code: Code2,
  check: CheckCircle,
  rocket: Rocket,
};
