"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/login/use-logout";

export function UserNav() {
  const router = useRouter();
  const { handleLogout } = useLogout();

  // Get user data from localStorage
  const userStr = localStorage.getItem("user");
  let userEmail = "User";

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userEmail = user.email || "User";
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full cursor-pointer"
        >
          <Avatar className="h-10 w-10">
            {/* <AvatarImage
              src="/avatars/01.png"
              alt={userEmail}
              className="dark:!bg-background"
            /> */}
            <AvatarFallback className="dark:!bg-background">RM</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userEmail}</p>
            {/* <p className="text-xs leading-none text-muted-foreground">
              m@example.com
            </p> */}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
