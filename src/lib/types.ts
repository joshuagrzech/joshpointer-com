export type Route = 'home' | 'projects' | 'contact' | 'blog' | 'links';

export interface NavItem {
  id: Route;
  label: string;
  icon: string;
}
