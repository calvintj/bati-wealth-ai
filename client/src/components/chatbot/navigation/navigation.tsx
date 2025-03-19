"use client";

import { Bell, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import HamburgerMenu from "@/components/ui/hamburger";
import Icon from "@/components/ui/icon";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { useIsMounted } from "@/components/ui/use-is-mounted";
import { UserNav } from "@/components/ui/user-nav";
import { QUERY_TOKEN, useMediaQuery } from "@/hooks/chatbot/use-media-query";

import { ColorModeToggle } from "../color-mode-toggle";
import { NavigationItemProps } from "./navigation-item";
import NavigationList from "./navigation-list";

const navigationItems: NavigationItemProps[] = [
  {
    dest: "/dashboard",
    icon: <Icon alt="Dashboard" src="/dashboard-inactive.svg" />,
    activeIcon: <Icon alt="Dashboard" src="/dashboard.svg" />,
    label: "Dashboard",
  },
  {
    dest: "/customer",
    activeIcon: (
      <Icon alt="Groups" src="/user-group.svg" width={24} height={24} />
    ),
    icon: (
      <Icon
        alt="Groups"
        src="/user-group-inactive.svg"
        width={24}
        height={24}
      />
    ),
    label: "Customer",
  },
];

export default function Navigation() {
  const isMounted = useIsMounted();
  const isSm = useMediaQuery(QUERY_TOKEN.sm);

  return (
    <div className="p-4 z-40 bg-background dark:bg-accent sticky top-4 inset-x-0 md:inset-x-4 shadow-md rounded-md flex justify-between border-0 dark:border dark:border-input">
      <div className="flex gap-10 items-center flex-1">
        <Link href="/" className="hidden md:block">
          <Image
            src="/bati-light.svg"
            alt="Bati Logo"
            width={120}
            height={36}
            className="dark:hidden"
          />
          <Image
            src="/bati-dark.svg"
            alt="Bati Logo"
            width={120}
            height={36}
            className="hidden dark:block"
          />
        </Link>
        {isMounted ? (
          isSm ? (
            <NavigationMenu>
              <NavigationList items={navigationItems} />
            </NavigationMenu>
          ) : (
            <HamburgerMenu />
          )
        ) : null}
      </div>
      <div className="flex gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell />
          </Button>
          <ColorModeToggle />
          <Button variant="ghost" size="icon">
            <Info />
          </Button>
        </div>

        <UserNav />
      </div>
    </div>
  );
}
