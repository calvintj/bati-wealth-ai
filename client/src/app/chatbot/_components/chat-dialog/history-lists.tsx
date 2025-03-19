import React, { useMemo } from "react";

import ChatHistory from "@/app/chatbot/_components/chat-dialog/chat-history";
import { formatDateRelative, groupResponseListByDate } from "@/lib/utils";
import { type ChatHistory as ChatHistoryT } from "@/types/chat-history";

export interface HistoryListsProps {
  chatHistories: ChatHistoryT[];
  onHistory?: (historyId: string) => void;
}

export default function HistoryLists({
  chatHistories,
  onHistory,
}: HistoryListsProps) {
  const groupedHistories = useMemo(
    () => groupResponseListByDate(chatHistories, "updatedAt"),
    [chatHistories]
  );

  const histories = Object.entries(groupedHistories);

  return (
    <div className="flex flex-col gap-4">
      {histories.map(([date, chatHistories]) => {
        return (
          <div key={date.toString()} className="flex flex-col gap-1">
            <p className="font-bold text-sm pb-2 px-2">
              {formatDateRelative(date as unknown as Date)}
            </p>
            <ul className="flex flex-col text-sm gap-2">
              {chatHistories.map((chatHistory) => (
                <ChatHistory
                  onClick={() => {
                    if (onHistory) onHistory(chatHistory.id);
                  }}
                  chatContent={chatHistory.title}
                  key={chatHistory.id}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
