"use client";

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import { ChatApiRequest, useChatApi } from "@/hooks/chatbot/api/chat-api";
import { useListenErrorToast } from "@/hooks/chatbot/use-listen-error-toast";
import { FormHandlerValue } from "@/lib/tanstack-react-form";
import { Message } from "@/schema/message";
import type { Customer } from "@/types/customer-v2";
import { FetchConfig } from "@/types/fetch-config";

export const inputPromptSchema = z.object({
  query: z.string().min(1),
  language: z.enum(["Bahasa Indonesia", "English"]),
  customer: z.string(),
});

export type InputPromptSchema = z.infer<typeof inputPromptSchema>;

export const useChat = () => {
  const abortControllerRef = useRef(new AbortController());

  const stop = useCallback(() => {
    abortControllerRef.current.abort("CSTOP");
    abortControllerRef.current = new AbortController();
  }, []);

  const handleSubmit = useCallback(
    async ({
      value: { customer: cust, ...value },
    }: FormHandlerValue<InputPromptSchema>) => {
      let customer: Customer | null = null;

      if (cust) {
        customer = JSON.parse(cust);
      }

      try {
        await mutateAsync({
          data: {
            ...value,
            customer_id: customer?.customerId?.toString() ?? null,
          },
          config: { signal: abortControllerRef.current.signal },
        });
      } catch (err) {
        if ((err as Error)?.name === "AbortError") {
          console.log("Submission was aborted");
          // Optionally reset or handle abort state
          form.reset({
            query: "",
            customer: "",
            language: "English",
          });
        }
      }
    },
    []
  );

  const form = useForm({
    defaultValues: {
      query: "",
      customer: "",
      language: "English",
    } as InputPromptSchema,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: inputPromptSchema,
    },
    onSubmit: handleSubmit,
  });

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (form.state.isSubmitted) form.setFieldValue("query", "");
  }, [form.state.isSubmitted]);

  const handleMutationSuccess = useCallback(
    async (data: ReadableStream<Uint8Array> | null) => {
      if (!data) return;
      const reader = data.getReader();
      let currentMessageId: string | null = null;
      const decoder = new TextDecoder("utf-8");

      let additionalData = "";
      try {
        let start = true;
        while (start) {
          const { done, value } = await reader.read();
          if (done) {
            start = false;
            break;
          }

          const text = decoder.decode(value, { stream: true });
          if (text.includes("additional_data:")) {
            additionalData += text.split("additional_data:")[1];
          }
          console.log(text, "Text");

          if (!currentMessageId) {
            currentMessageId = uuidv4();
            setMessages((messages) => [
              ...messages,
              {
                id: currentMessageId as string,
                content: text,
                role: "assistant",
              },
            ]);
          } else {
            setMessages((messages) =>
              messages.map((msg) =>
                msg.id === currentMessageId
                  ? { ...msg, content: msg.content + text }
                  : msg
              )
            );
          }

          if (additionalData) {
            try {
              const jsonData = JSON.parse(additionalData);
              console.log(jsonData, "Parsed JSON Data");
            } catch (error) {
              console.error("Failed to parse additional data as JSON:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error reading from stream:", error);
      } finally {
        reader.releaseLock();
      }
    },

    []
  );

  const handleMutate = useCallback((variables: FetchConfig<ChatApiRequest>) => {
    setMessages((messages) => [
      ...messages,
      {
        id: uuidv4(),
        content: variables?.data?.query ?? "",
        role: "user",
      },
    ]);
  }, []);

  const { isPending, isError, error, mutateAsync } = useChatApi({
    mutationConfig: {
      onSuccess: handleMutationSuccess,
      onMutate: handleMutate,
    },
  });

  console.log(error, "Error");

  useListenErrorToast(error?.message ?? "");

  return {
    form,
    messages,
    stop,
    setMessages,
    isPending,
    isError,
    error,
  };
};
