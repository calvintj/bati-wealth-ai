"use client";

import { Avatar, AvatarFallback } from "@/components/chatbot/ui/avatar";
import { Button } from "@/components/chatbot/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/chatbot/ui/dropdown-menu";
import { useSessionStore } from "@/stores/use-session-store";

export function UserNav() {
  const sessionId = useSessionStore((state) => state.id);
  const setSession = useSessionStore((state) => state.setSession);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage
              src="/avatars/01.png"
              alt={sessionId ?? ""}
              className="dark:!bg-background"
            /> */}
            <AvatarFallback className="dark:!bg-background">RM</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{sessionId}</p>
            {/* <p className="text-xs leading-none text-muted-foreground">
              m@example.com
            </p> */}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setSession({ accessToken: null, id: null })}
        >
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
