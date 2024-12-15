import {
  Home,
  FolderKanban,
  Mail,
  Link,
  User,
  Wrench,
  Book,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';
import type { Icon } from 'lucide-react';

interface IconMap {
  [key: string]: Icon;
}

export const IconMap: IconMap = {
  home: Home,
  about: User,
  folder: FolderKanban,
  skills: Wrench,
  blog: Book,
  link: Link,
  mail: Mail,
  user: User,
  wrench: Wrench,
  book: Book,
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
};
