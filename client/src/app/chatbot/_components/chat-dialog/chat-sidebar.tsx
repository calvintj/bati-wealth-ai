import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import HistoryLists from "@/app/chatbot/_components/chat-dialog/history-lists";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { chatHistories } from "@/data/dummy/chat-histories";
import { UseDisclosureReturn } from "@/hooks/chatbot/use-disclosure";

export interface ChatSidebarProps extends UseDisclosureReturn {
  onHistory?: (historyId: string) => void;
  onNewChat?: () => void;
}

export default function ChatSidebar({
  isOpen,
  onHistory,
  toggleOpen,
  onNewChat,
}: ChatSidebarProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          exit={{ x: -700 }}
          transition={{ duration: 0.05 }}
          className="dark:bg-zinc-900 px-2 border-r border-input bg-secondary overflow-y-auto h-[100%] w-[400px] pb-4 chat-popup-scrollbar"
        >
          <div className="flex !text-primary p-4 px-2 justify-between sticky top-0 dark:bg-zinc-900 bg-secondary z-10">
            <Button size="icon" variant="ghost" onClick={toggleOpen}>
              <Icon src="/panel-left.svg" alt="Panel Left" size={20} />
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={onNewChat} size="icon" variant="ghost">
                    <Icon src="/write.svg" alt="Write" size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-background">
                  <p>New Chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="pt-0 px-2 flex flex-col gap-6">
            <p className="px-2 font-bold text-lg text-black dark:text-white">History</p>
            <HistoryLists onHistory={onHistory} chatHistories={chatHistories} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
