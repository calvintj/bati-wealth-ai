import React from "react";

import { NavigationMenuList } from "@/components/ui/navigation-menu";

import NavigationItem, { NavigationItemProps } from "./navigation-item";

export interface NavigationListProps {
  items: NavigationItemProps[];
}

export default function NavigationList({ items }: NavigationListProps) {
  return (
    <NavigationMenuList className="flex items-center">
      {items.map((item) => (
        <NavigationItem {...item} key={item.dest} />
      ))}
    </NavigationMenuList>
  );
}
