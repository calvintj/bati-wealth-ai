import React, { memo, useCallback, useMemo } from "react";
import { TypeAnimation } from "react-type-animation";

import ChatSuggestions from "@/app/chatbot/_components/chat-dialog/chat-suggestions";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { Message } from "@/schema/message";

import ChatBubble from "./chat-bubble";

export interface MessageListsProps {
  messages: Message[];
  className?: string;
  onSuggestion?: (message: Message) => void;
}

function NonMemoizedMessageLists({
  messages,
  className,
  onSuggestion,
}: MessageListsProps) {
  const handleSuggestion = useCallback((message: Message) => {
    if (onSuggestion) onSuggestion(message);
  }, []);
  console.log(messages, "Messages");
  const renderedMessages = useMemo(() => {
    const output: React.ReactNode[] = [];
    for (let i = 0; i < messages.length; i++) {
      if (
        ["user", "bot", "suggestion-topic", "assistant"].includes(
          messages[i].role
        )
      ) {
        output.push(<ChatBubble key={messages[i].id} {...messages[i]} />);
      } else if (messages[i].role === "suggestion") {
        const suggestionGroup: Message[] = [];
        let j = i;
        while (j < messages.length && messages[j].role === "suggestion") {
          suggestionGroup.push(messages[j]);
          j++;
        }
        output.push(
          <ChatSuggestions
            onSuggestion={handleSuggestion}
            key={suggestionGroup.map((g) => g.id).join(",")}
            messages={suggestionGroup}
          />
        );
        i = j - 1;
      }
    }
    return output;
  }, [messages, handleSuggestion]);

  console.log(renderedMessages, "Rendered Messages");

  const content =
    messages?.length === 0 ? (
      <div className="px-2 md:px-4 flex flex-col gap-2 pt-8 md:pt-16 text-center inset-0 justify-center items-center text-black dark:text-white">
        <TypeAnimation
          sequence={["What can i help with?"]}
          wrapper="p"
          speed={50}
          style={{
            fontSize: "1.25rem",
            display: "inline-block",
            fontWeight: 700,
          }}
          className="md:text-2xl"
          repeat={0}
        />
        <p className="text-muted-foreground justify-center flex items-center text-center gap-2 text-sm md:text-base">
          <span>Powered by</span>
          <Icon
            src="/bati-light.svg"
            size={40}
            alt="Bati Logo"
            className="dark:hidden md:w-[52px] md:h-[52px]"
          />
          <Icon
            src="/bati-dark.svg"
            size={40}
            alt="Bati Logo"
            className="hidden dark:block md:w-[52px] md:h-[52px]"
          />
        </p>
      </div>
    ) : (
      renderedMessages
    );

  return (
    <div
      className={cn(
        "flex p-2 md:p-4 flex-col gap-4 md:gap-8 relative",
        className
      )}
    >
      {content}
    </div>
  );
}

export default memo(NonMemoizedMessageLists);
