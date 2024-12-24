import React from "react";
import type { AppGridProps, NavItem } from "@/types";
import AppIcon from "@/components/phone/AppIcon";

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "about", label: "About", icon: "user" },
  { id: "projects", label: "Projects", icon: "folder" },
  { id: "skills", label: "Skills", icon: "wrench" },
  { id: "blog", label: "Blog", icon: "book" },
  { id: "links", label: "Links", icon: "link" },
  { id: "contact", label: "Contact", icon: "mail" },
];

const AppGrid: React.FC<AppGridProps> = ({ handleAppClick }) => (
  <div className="px-16 mt-8">
    <div className="grid grid-cols-4 gap-8">
      {navItems.map((item, index) => (
        <AppIcon
          key={item.id}
          item={item}
          index={index}
          handleAppClick={handleAppClick}
        />
      ))}
    </div>
  </div>
);

export default AppGrid;
