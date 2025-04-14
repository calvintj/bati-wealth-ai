import React, { memo } from "react";

import ChatBubble from "@/app/chatbot/_components/chat-dialog/chat-bubble";
import { Message } from "@/schema/message";

interface ChatSuggestionsProps {
  messages: Message[];
  onSuggestion: (message: Message) => void;
}

function NonMemoizedChatSuggestions({
  messages,
  onSuggestion,
}: ChatSuggestionsProps) {
  return (
    <div className="grid grid-cols-1 h-fit max-h-[200px] md:max-h-[251px] border border-input dark:!border-zinc-900 gap-2 md:gap-4 p-3 md:p-5 rounded-lg w-full md:w-fit ml-auto overflow-y-auto">
      {messages.map((message) => (
        <ChatBubble
          isSuggestion
          onClick={() => onSuggestion(message)}
          className="cursor-pointer hover:brightness-90"
          key={message.id}
          id={message.id}
          content={message.content}
          role="suggestion"
        />
      ))}
    </div>
  );
}

export default memo(NonMemoizedChatSuggestions);
