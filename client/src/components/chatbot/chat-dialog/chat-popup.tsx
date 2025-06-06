"use client";

import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import LoadingDots from "@/components/ui/loading-dots";
import { useDisclosure } from "@/hooks/chatbot/use-disclosure";
import { useLockBodyScroll } from "@/hooks/chatbot/use-lock-body-scroll";
import { cn } from "@/lib/utils";
import { Message } from "@/schema/message";

import ChatSidebar from "@/components/chatbot/chat-dialog/chat-sidebar";
import MessageLists from "@/components/chatbot/chat-dialog/message-lists";

interface ChatPopupProps extends HTMLMotionProps<"div"> {
  isOpen?: boolean;
  isOpenDebounced?: boolean;
  isLoading: boolean;
  isFullScreen?: boolean;
  messages?: Message[];
  onSuggestion: (message: Message) => void;
  onNewChat: () => void;
}

export default function ChatPopup({
  isLoading,
  isOpen,
  isOpenDebounced,
  isFullScreen,
  className,
  messages = [],
  onSuggestion,
  onNewChat,
  ...props
}: ChatPopupProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  const promptMessages: Message[] = messages.map((message) => ({
    id: message.id,
    content: message.content,
    role: message?.role,
  }));

  const lastMessageContent = messages?.slice(-1)?.[0]?.content ?? "";

  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const [isShowScrollDownButton, setIsShowScrollDownButton] = useState(false);

  const {
    isOpen: isChatSidebarOpen,
    onClose: onChatSidebarClose,
    onOpen: onChatSidebarOpen,
    toggleOpen: toggleChatSidebarOpen,
  } = useDisclosure(false);

  const handleScrollDown = () => {
    if (messageContainerRef?.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  const handleSuggestion = useCallback((message: Message) => {
    if (onSuggestion) onSuggestion(message);
  }, []);

  const handleMessageContainerScroll = useCallback(() => {
    if (messageContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messageContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

      setIsShowScrollDownButton(!isAtBottom);
    }
  }, [isOpen, isFullScreen]);

  // Do not automatically scroll down if the user are not in the bottom while the message is still streamed
  useEffect(() => {
    if (lastMessageContent && !isShowScrollDownButton) {
      handleScrollDown();
    }
  }, [lastMessageContent, isShowScrollDownButton]);

  useEffect(() => {
    if (isOpenDebounced && !hasScrolled) {
      handleScrollDown();
    }
  }, [isOpenDebounced, hasScrolled]);

  useEffect(() => {
    if (!isOpen) {
      setHasScrolled(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (messages?.length > 0) {
      handleScrollDown();
    }
  }, [messages?.length]);

  // Scroll to bottom every after user submit a new message
  useEffect(() => {
    if (isLoading) handleScrollDown();
  }, [isLoading]);

  useLockBodyScroll(isOpen);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className={cn(
              "p-0 flex w-full flex-1 min-h-full bg-white dark:bg-[#181E26]",
              className
            )}
            {...props}
          >
            <ChatSidebar
              onNewChat={onNewChat}
              isOpen={isChatSidebarOpen}
              onClose={onChatSidebarClose}
              onOpen={onChatSidebarOpen}
              toggleOpen={toggleChatSidebarOpen}
            />
            <div
              ref={messageContainerRef}
              onScroll={handleMessageContainerScroll}
              className="w-full flex relative flex-col pb-8 gap-4 overflow-y-auto chat-popup-scrollbar"
            >
              <div className="items-center w-full flex flex-row justify-between p-2 md:p-4 bg-white dark:bg-[#181E26] sticky top-0 z-[1]">
                <div className="flex items-center gap-2 md:gap-4">
                  {!isChatSidebarOpen && (
                    <div className="flex gap-1 md:gap-2">
                      <Button
                        size="icon"
                        className="text-xl md:text-2xl"
                        variant="ghost"
                        onClick={toggleChatSidebarOpen}
                      >
                        <Icon
                          src="/panel-left.svg"
                          alt="Panel Left"
                          size={18}
                          className="md:w-5 md:h-5"
                        />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={onNewChat}>
                        <Icon
                          src="/write.svg"
                          alt="Write new message"
                          size={18}
                          className="md:w-5 md:h-5"
                        />
                      </Button>
                    </div>
                  )}
                  <h2 className="font-bold text-base md:text-lg text-black dark:text-white">
                    WealthAI
                  </h2>
                </div>
              </div>
              <Button
                onClick={handleScrollDown}
                size="icon"
                variant="secondary"
                className={cn(
                  "rounded-3xl z-30 fixed right-4 md:right-8 hover:bg-white dark:hover:bg-zinc-900 transition-all w-8 h-8 md:w-10 md:h-10 bottom-32 md:bottom-52 dark:bg-zinc-950",
                  isShowScrollDownButton ? "scale-100" : "scale-0",
                  isFullScreen ? "md:bottom-36" : "md:bottom-40"
                )}
              >
                <ArrowDown className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <MessageLists
                onSuggestion={handleSuggestion}
                messages={promptMessages}
                className="max-w-5xl w-full mx-auto flex flex-1 justify-center items-center px-2 md:px-4"
              />
              {isLoading && <LoadingDots />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* <div className="inset-0 fixed bg-transparent" onClick={onClose}></div> */}
    </>
  );
}
