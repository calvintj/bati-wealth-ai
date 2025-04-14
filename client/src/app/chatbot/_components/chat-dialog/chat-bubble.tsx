import React, { memo } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/utils";
import { Message } from "@/schema/message";

export interface ChatBubbleProps
  extends Message,
    Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "role" | "content"> {
  onSuggestion?: () => void;
  isSuggestion?: boolean;
}

function NonMemoizedChatBubble({
  role,
  content,
  onSuggestion,
  isSuggestion,
  className,
  ...props
}: ChatBubbleProps) {
  const isBot = ["bot", "assistant"].includes(role);

  const handleSuggestion = () => {
    if (onSuggestion && role === "suggestion") onSuggestion();
  };

  return (
    <div
      className={cn(
        "flex gap-2 md:gap-4 items-start w-full",
        !isBot && "ml-auto justify-end",
        isSuggestion && "h-fit",
        className
      )}
      {...props}
    >
      {isBot && (
        <Avatar className="mt-2 md:mt-4 w-8 h-8 md:w-10 md:h-10">
          <AvatarImage
            className="object-cover object-center"
            src="/bati-chatbot-avatar-bg-removed.png"
          />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "rounded-xl p-2 md:p-4 prose-sm md:prose-base dark:prose-invert",
          isBot && "pl-1 md:pl-2 w-[85%] text-black dark:text-white",
          !isBot && "!bg-secondary dark:!bg-accent text-black dark:text-white",
          isSuggestion && "w-full"
        )}
        onClick={handleSuggestion}
      >
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
}

export default memo(NonMemoizedChatBubble);
