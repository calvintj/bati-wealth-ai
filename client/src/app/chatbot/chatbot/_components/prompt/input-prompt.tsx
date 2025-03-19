"use client";
import { Fullscreen, Minimize, Square } from "lucide-react";
import { useTheme } from "next-themes";
import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useResizeDetector } from "react-resize-detector";

import { suggestions } from "@/app/chatbot/chatbot/_components/suggestion/suggestions";
import { Button } from "@/components/chatbot/ui/button";
import Icon from "@/components/chatbot/ui/icon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/chatbot/ui/select";
import { Textarea } from "@/components/chatbot/ui/textarea";
import { questions, questionTopic } from "@/data/question";
import { useChat } from "@/hooks/chatbot/use-chat";
import { useDebounceValue } from "@/hooks/chatbot/use-debounce-value";
import { useDisclosure } from "@/hooks/chatbot/use-disclosure";
import { useToast } from "@/hooks/chatbot/use-toast";
import { useToggle } from "@/hooks/chatbot/use-toggle";
import { cn } from "@/lib/utils";
import { Message } from "@/schema/message";

import ChatPopup from "../chat-dialog/chat-popup";
import SuggestionLists from "../suggestion/suggestion-lists";
import CustomerSelect from "./customer-select";

export interface InputPromptProps {
  isFullScreen?: boolean;
}

const MemoizedSuggestionLists = memo(SuggestionLists);
const MemoizedChatPopup = memo(ChatPopup);

export default function InputPrompt({
  isFullScreen: defaultFullScreen,
}: InputPromptProps) {
  const { theme } = useTheme();
  const chatPopupContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    isOpen: isOpenChatPopup,
    onClose: onCloseChatPopup,
    onOpen: onOpenChatPopup,
  } = useDisclosure();
  const [isFullScreen, toggleFullScreen, setFullScreen] =
    useToggle(defaultFullScreen);
  const [isOpenChatPopupDebounced] = useDebounceValue(isOpenChatPopup, 200);

  const { ref, height = 0 } = useResizeDetector();
  // This is for preventing rerender on chat-popup because every after we type something chat-popup always rerendered
  const chatPopupStyle = useMemo(() => ({ paddingBottom: height }), [height]);
  const { toast } = useToast();

  const { messages, setMessages, error, form, stop } = useChat();

  const inputField = form.useField({ name: "query" });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenChatPopup();
    form.handleSubmit();
  };

  const handleSuggestion = useCallback((value: string, topicId: string) => {
    if (form.store.state.isSubmitting) return;

    onOpenChatPopup();

    const topic = questionTopic[topicId as keyof typeof questionTopic];

    const suggestionTopic: Message = {
      content: topic,
      id: crypto.randomUUID(),
      role: "suggestion-topic",
    };

    const suggestions: Message[] = questions[
      topicId as keyof typeof questions
    ].map((question) => ({
      id: crypto.randomUUID(),
      content: question.question,
      role: "suggestion",
    }));
    setMessages((messages) => [...messages, suggestionTopic, ...suggestions]);
  }, []);

  const handleSelectSuggestion = useCallback((message: Message) => {
    inputField.setValue(message.content);
    form.handleSubmit();
  }, []);

  const handleCloseChatPopup = useCallback(() => {
    setFullScreen(false);
    onCloseChatPopup();
  }, []);

  const handleStopPrompt = () => {
    if (form.store.state.isSubmitting) stop();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onOpenChatPopup();
      form.handleSubmit();
    }
  };

  const handleNewChat = useCallback(() => {
    if (form.store.state.isSubmitting) return;
    setMessages([]);
  }, []);

  // Closing popup every navigation occurs

  useEffect(() => {
    if (error?.message)
      toast({ description: error?.message, variant: "destructive" });
  }, [error?.message]);

  // useEffect(() => {
  //   handleCloseChatPopup();
  // }, [pathname]);

  useEffect(() => {
    const element = chatPopupContainerRef.current;
    if (!element) return;

    if (isOpenChatPopup) {
      element.classList.add("top-0");
      element.classList.add("md:top-28");
    }
  }, [isOpenChatPopup]);

  useEffect(() => {
    const element = chatPopupContainerRef.current;
    if (!element) return;

    if (!isOpenChatPopupDebounced) {
      element.classList.remove("top-0");
      element.classList.remove("md:top-28");
    }
  }, [isOpenChatPopupDebounced]);

  useEffect(() => {
    const element = chatPopupContainerRef.current;
    if (!element) return;

    if (isFullScreen && isOpenChatPopup) {
      element.classList.add("!inset-0");
    } else if (!isFullScreen && isOpenChatPopup) {
      element.classList.add("top-0");
      element.classList.add("md:top-28");
    }

    return () => {
      element.classList.remove("!inset-0");
    };
  }, [isFullScreen, isOpenChatPopup]);

  return (
    <>
      <div
        ref={chatPopupContainerRef}
        className={cn(
          "shadow-md absolute bottom-0 md:bottom-2 overflow-hidden inset-x-0 md:inset-x-4 flex rounded-none md:rounded-lg transition-all flex-col items-center z-50 justify-between border border-input md:border-0 dark:shadow-none dark:border dark:border-input",
          isFullScreen && isOpenChatPopup && "!rounded-none",
          isFullScreen && !isOpenChatPopup && "rounded-lg md:!inset-4"
        )}
      >
        <MemoizedChatPopup
          isOpenDebounced={isOpenChatPopupDebounced}
          isLoading={form.store.state.isSubmitting}
          onNewChat={handleNewChat}
          onSuggestion={handleSelectSuggestion}
          messages={messages}
          style={chatPopupStyle}
          isFullScreen={isFullScreen}
          onClose={handleCloseChatPopup}
          isOpen={isOpenChatPopup}
        />
        <div
          ref={ref}
          className={cn(
            "w-full flex flex-col mt-auto z-30 bg-background dark:bg-[#1D283A]",
            isOpenChatPopup && "border-t border-input absolute bottom-0"
          )}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              gridTemplateAreas: `
          "A A A A B B"
          "D D D D D D"
          `,
            }}
            className="grid justify-between md:flex gap-2 w-full border-b-input border-b-[1px] p-4"
          >
            <div style={{ gridArea: "A" }} className="flex items-center gap-2">
              <form.Field name="language" defaultValue="English">
                {(field) => (
                  <Select
                    disabled={form.store.state.isSubmitting}
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(
                        value as "Bahasa Indonesia" | "English"
                      )
                    }
                  >
                    <SelectTrigger className="dark:bg-[#161B21] rounded-xl w-[160px]">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Bahasa Indonesia">
                          <div className="flex items-center gap-2">
                            <Icon alt="ID" size={24} src="/id.svg" /> Bahasa
                            Indonesia
                          </div>
                        </SelectItem>
                        <SelectItem value="English">
                          <div className="flex items-center gap-2">
                            <Icon alt="ENG" size={24} src="/eng.svg" /> English
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </form.Field>

              <form.Field name="customer">
                {(field) => (
                  <CustomerSelect
                    disabled={form.store.state.isSubmitting}
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                    className="w-[140px] dark:bg-[#161B21]"
                  />
                )}
              </form.Field>
            </div>

            <form.Field name="query">
              {(field) => (
                <Textarea
                  disabled={form.store.state.isSubmitting}
                  wrapperStyle={{ gridArea: "D" }}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxRows={4}
                  placeholder="What can I help with? Message Wealth Advisor"
                  className="rounded-xl bg-secondary resize-none min-h-9 dark:bg-[#161B21]"
                  endAdornment={
                    <button
                      type={form.store.state.isSubmitting ? "button" : "submit"}
                      className="flex text-primary justify-center rounded-full items-center"
                      onClick={handleStopPrompt}
                    >
                      {form.store.state.isSubmitting ? (
                        <Square
                          fill={
                            theme === "light" ? "black" : "hsl(var(--accent2))"
                          }
                          className="text-black dark:text-accent2"
                        />
                      ) : (
                        <Icon alt="Send Message" src="/send.svg" />
                      )}
                    </button>
                  }
                />
              )}
            </form.Field>
            <div className="flex gap-2 ml-auto" style={{ gridArea: "B" }}>
              {!isOpenChatPopup && (
                <Button
                  className="flex-shrink-0 rounded-xl"
                  variant="outline"
                  onClick={onOpenChatPopup}
                >
                  Show
                </Button>
              )}
              {isOpenChatPopup && (
                <Button
                  variant="outline"
                  className="hidden md:flex rounded-xl"
                  onClick={toggleFullScreen}
                  size="icon"
                >
                  {isFullScreen ? <Minimize /> : <Fullscreen />}
                </Button>
              )}
            </div>
          </form>
          <MemoizedSuggestionLists
            onSuggestion={handleSuggestion}
            suggestions={suggestions}
          />
        </div>
      </div>
      {isOpenChatPopup && (
        <div
          className="fixed inset-0 z-40 bg-black/10  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onClick={handleCloseChatPopup}
        ></div>
      )}
    </>
  );
}
