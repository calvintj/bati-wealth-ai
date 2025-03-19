"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface NavigationItemOptions {
  dest: string;
  label: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
}

export interface NavigationItemProps extends NavigationItemOptions {
  options?: NavigationItemOptions[];
}

export default function NavigationItem({
  icon,
  label,
  dest,
  activeIcon,
  options = [],
}: NavigationItemProps) {
  const pathname = usePathname();

  const isSelected = pathname?.includes(dest);
  let navIcon = icon;

  if (isSelected && activeIcon) navIcon = activeIcon;

  return (
    <NavigationMenuItem className="hover:bg-zinc-100 hover:text-black dark:hover:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:bg-opacity-40 text-muted-foreground transition-all rounded-lg">
      {options.length > 0 ? (
        <>
          <NavigationMenuTrigger
            className={cn(
              "flex gap-2 items-center",
              navigationMenuTriggerStyle(),
              isSelected && "!text-black dark:!text-zinc-200"
            )}
          >
            {navIcon} {label}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] grid-cols-1 py-2">
              {options.map((option) => (
                <li
                  className={cn(
                    "hover:bg-zinc-100 hover:text-black dark:hover:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:bg-opacity-40 text-muted-foreground transition-all dark:!bg-white",
                    pathname === dest + option?.dest &&
                      "!text-black dark:!text-zinc-200"
                  )}
                  key={option?.dest}
                >
                  <Link
                    href={dest + option?.dest}
                    className="w-full h-full block p-4 py-2 "
                  >
                    {option?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </>
      ) : (
        <Link href={dest} legacyBehavior passHref>
          <NavigationMenuLink
            className={cn(
              "flex gap-2 items-center dark:bg-background dark:hover:border-accent2 dark:hover:border",
              navigationMenuTriggerStyle(),
              isSelected && "!text-black dark:!text-zinc-200"
            )}
          >
            <span className="w-6 h-6 flex justify-center items-center">
              {navIcon}
            </span>
            <p className="font-semibold">{label}</p>
          </NavigationMenuLink>
        </Link>
      )}
    </NavigationMenuItem>
  );
}
