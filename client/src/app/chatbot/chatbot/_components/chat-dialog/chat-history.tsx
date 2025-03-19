import { MoreHorizontal } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

export interface ChatHistoryProps
  extends React.LiHTMLAttributes<HTMLLIElement> {
  chatContent: string;
  onMore?: () => void;
}

export default function ChatHistory({
  chatContent,
  className,
  onMore,
  ...props
}: ChatHistoryProps) {
  const handleMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onMore) onMore();
  };

  return (
    <li
      className={cn(
        "cursor-pointer group p-2 relative items-center hover:bg-blue-100 dark:hover:bg-zinc-800 rounded-md transition-all h-8 flex overflow-hidden",
        className
      )}
      {...props}
    >
      <p className="line-clamp-1 text-nowrap w-full">{chatContent}</p>
      <div className="group-hover:hidden rounded-md bg-gradient-to-l h-8 w-8 flex justify-center items-center shadow-none absolute right-0 from-iceBlue dark:from-zinc-900 to-transparent"></div>
      <button
        onClick={handleMore}
        className="hidden group-hover:flex justify-end pr-2 items-center text-zinc-600 hover:text-zinc-950 absolute right-0 from-transparent to-40% to-iceBlue dark:to-zinc-900 w-12 bg-gradient-to-r h-full dark:text-zinc-400 hover:dark:text-zinc-100"
      >
        <MoreHorizontal />
      </button>
    </li>
  );
}
