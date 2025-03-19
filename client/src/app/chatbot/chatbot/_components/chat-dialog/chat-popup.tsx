"use client";

import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { ArrowDown, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/chatbot/ui/button";
import Icon from "@/components/chatbot/ui/icon";
import LoadingDots from "@/components/chatbot/ui/loading-dots";
import { useDisclosure } from "@/hooks/chatbot/use-disclosure";
import { useLockBodyScroll } from "@/hooks/chatbot/use-lock-body-scroll";
import { cn } from "@/lib/utils";
import { Message } from "@/schema/message";

import ChatSidebar from "./chat-sidebar";
import MessageLists from "./message-lists";

interface ChatPopupProps extends HTMLMotionProps<"div"> {
  onClose?: () => void;
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
  onClose,
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
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className={cn(
              "p-0 flex w-full flex-1 h-full bg-[#181E26]",
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
              <div className="items-center w-full flex flex-row justify-between p-4 bg-[#181E26] sticky top-0 z-[1]">
                <div className="flex items-center gap-4">
                  {!isChatSidebarOpen && (
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        className="text-2xl"
                        variant="ghost"
                        onClick={toggleChatSidebarOpen}
                      >
                        <Icon
                          src="/panel-left.svg"
                          alt="Panel Left"
                          size={20}
                        />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={onNewChat}>
                        <Icon
                          src="/write.svg"
                          alt="Write new message"
                          size={20}
                        />
                      </Button>
                    </div>
                  )}
                  <h2 className="font-bold text-lg">WealthAI</h2>
                </div>
                <Button
                  onClick={onClose}
                  size="icon"
                  variant="ghost"
                  className="!text-primary"
                >
                  <X />
                </Button>
              </div>
              <Button
                onClick={handleScrollDown}
                size="icon"
                variant="secondary"
                className={cn(
                  "rounded-3xl z-30 fixed right-8 md:right-12 hover:bg-white dark:hover:bg-zinc-900 transition-all w-10 h-10 bottom-52 dark:bg-zinc-950",
                  isShowScrollDownButton ? "scale-100" : "scale-0",
                  isFullScreen ? "md:bottom-36" : "md:bottom-40"
                )}
              >
                <ArrowDown />
              </Button>
              <MessageLists
                onSuggestion={handleSuggestion}
                messages={promptMessages}
                className="max-w-5xl w-full mx-auto flex flex-1 justify-center items-center"
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
