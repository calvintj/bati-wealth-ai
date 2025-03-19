"use client";

import { useMutation } from "@tanstack/react-query";

import { Constants } from "@/consts/constants";
import { MutationConfig } from "@/lib/react-query";
import { FetchConfig } from "@/types/fetch-config";

export interface ChatApiRequest {
  query: string;
  language: "Bahasa Indonesia" | "English";
  customer_id: string | null;
}

export interface UseChatApiOptions {
  mutationConfig?: MutationConfig<typeof chatApi>;
}

interface ChatApiOptions extends FetchConfig<ChatApiRequest> {}

export const chatApi = async ({ data, config }: ChatApiOptions) => {
  const response = await fetch(Constants.BASE_API_URL + "/api_chat", {
    body: JSON.stringify(data),
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    ...config,
  });

  if (!response.ok) {
    let errorResponseDetail = "";
    try {
      errorResponseDetail = (await response.json())?.detail;
    } catch (err) {
      console.error(err, "Error Calling Chatbot API");
    }

    throw new Error(errorResponseDetail);
  }

  return response.body;
};

export const useChatApi = (options?: UseChatApiOptions) => {
  return useMutation({
    ...options?.mutationConfig,
    mutationFn: chatApi,
  });
};
