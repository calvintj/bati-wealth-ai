"use client";

import { Square } from "lucide-react";
import { useTheme } from "next-themes";
import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useResizeDetector } from "react-resize-detector";

import { suggestions } from "@/app/chatbot/_components/suggestion/suggestions";
import Icon from "@/components/ui/icon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { questions, questionTopic } from "@/data/question";
import { useChat } from "@/hooks/chatbot/use-chat";
import { useDebounceValue } from "@/hooks/chatbot/use-debounce-value";
import { useToast } from "@/hooks/chatbot/use-toast";
import { cn } from "@/lib/utils";
import { Message } from "@/schema/message";

import ChatPopup from "../chat-dialog/chat-popup";
import SuggestionLists from "../suggestion/suggestion-lists";
import CustomerSelect from "./customer-select";

const MemoizedSuggestionLists = memo(SuggestionLists);
const MemoizedChatPopup = memo(ChatPopup);

export default function InputPrompt() {
  const { theme } = useTheme();
  const chatPopupContainerRef = useRef<HTMLDivElement | null>(null);

  const { toast } = useToast();

  // Chat logic
  const { messages, setMessages, error, form, stop } = useChat();
  const inputField = form.useField({ name: "query" });

  // Auto-size chat popup's height offset
  const { ref, height = 0 } = useResizeDetector();
  const chatPopupStyle = useMemo(() => ({ paddingBottom: height }), [height]);

  // Always open => no show/hide toggles
  const isOpenChatPopup = true;
  // If needed, a small debounced “open” to pass into ChatPopup
  const [isOpenChatPopupDebounced] = useDebounceValue(isOpenChatPopup, 200);

  // Submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Chat is always open, just send
    form.handleSubmit();
  };

  // Suggestion
  const handleSuggestion = useCallback(
    (value: string, topicId: string) => {
      if (form.store.state.isSubmitting) return;

      const topic = questionTopic[topicId as keyof typeof questionTopic];
      const suggestionTopic: Message = {
        content: topic,
        id: crypto.randomUUID(),
        role: "suggestion-topic",
      };

      const suggestionItems = questions[topicId as keyof typeof questions];
      const suggestionsArray: Message[] = suggestionItems.map((q) => ({
        id: crypto.randomUUID(),
        content: q.question,
        role: "suggestion",
      }));
      setMessages((msgs) => [...msgs, suggestionTopic, ...suggestionsArray]);
    },
    [form, setMessages]
  );

  // Called when a suggestion is chosen
  const handleSelectSuggestion = useCallback(
    (message: Message) => {
      inputField.setValue(message.content);
      form.handleSubmit();
    },
    [form, inputField]
  );

  // Clear chat messages
  const handleNewChat = useCallback(() => {
    if (!form.store.state.isSubmitting) {
      setMessages([]);
    }
  }, [form, setMessages]);

  // Stop streaming
  const handleStopPrompt = () => {
    if (form.store.state.isSubmitting) stop();
  };

  // Submit on Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit();
    }
  };

  // Show error as toast if any
  useEffect(() => {
    if (error?.message) {
      toast({ description: error?.message, variant: "destructive" });
    }
  }, [error?.message, toast]);

  // Position the chat container
  useEffect(() => {
    const element = chatPopupContainerRef.current;
    if (!element) return;
    // No toggling, just stay open
    element.classList.add("top-0");
    element.classList.add("md:top-28");
  }, []);

  return (
    <>
      <div
        ref={chatPopupContainerRef}
        className={cn(
          "shadow-md absolute bottom-0 md:bottom-2 overflow-hidden inset-x-0 md:inset-x-2 flex md:rounded-lg transition-all flex-col items-center z-50 justify-between dark:shadow-none",
          "top-0 md:top-28" // forced open
        )}
      >
        <MemoizedChatPopup
          isOpenDebounced={isOpenChatPopupDebounced}
          isLoading={form.store.state.isSubmitting}
          onNewChat={handleNewChat}
          onSuggestion={handleSelectSuggestion}
          messages={messages}
          style={chatPopupStyle}
          isOpen={true}
        />
        <div
          ref={ref}
          className={cn(
            "w-full flex flex-col mt-auto z-30 bg-background dark:bg-[#1D283A]",
            "absolute bottom-0"
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
            className="justify-between gap-2 w-full border-b-black border-b-[1px] p-4 flex flex-row"
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
            
          </form>
          <MemoizedSuggestionLists
            onSuggestion={handleSuggestion}
            suggestions={suggestions}
          />
        </div>
      </div>
      {/* Removed the overlay that closes popup */}
    </>
  );
}
