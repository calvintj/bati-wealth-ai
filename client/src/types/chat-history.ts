import { Message } from "@/schema/message";

export interface ChatHistory {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  chats: Message[];
}
