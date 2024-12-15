export type Route = 'home' | 'about' | 'projects' | 'skills' | 'contact' | 'blog' | 'links';

export interface NavItem {
  id: Route;
  label: string;
  icon: string;
}
