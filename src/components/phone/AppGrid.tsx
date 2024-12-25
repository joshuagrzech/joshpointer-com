import React from "react";
import type { AppGridProps } from "@/types";
import AppIcon from "@/components/phone/AppIcon";
import { useConfig } from "@/contexts/ConfigContext";

const AppGrid: React.FC<AppGridProps> = ({ handleAppClick }) => {
  const { config, isLoading } = useConfig();

  if (isLoading || !config) {
    return null;
  }

  return (
    <div className="px-16 mt-8">
      <div className="grid grid-cols-4 gap-8">
        {config.navigation.map((item, index) => (
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
};

export default AppGrid;
