import { ChatHistory } from "@/types/chat-history";

// Date String
const dateString = "2023-02-09T10:10:10".replace(/-/g, "/").replace("T", " ");
const dateString2 = "2023-01-11T10:10:10".replace(/-/g, "/").replace("T", " ");
const dateString3 = "2024-01-11T10:10:10".replace(/-/g, "/").replace("T", " ");

export const chatHistories: ChatHistory[] = [
  {
    id: "f0aae07a-e29d-47f9-a354-5ffe49534859",
    createdAt: new Date().toISOString() as unknown as Date,
    title: "Investment Risk #PART 2",
    updatedAt: new Date().toISOString() as unknown as Date,
    chats: [],
  },
  {
    id: "42486d45-d29a-4326-8547-518be1928296",
    createdAt: new Date().toISOString() as unknown as Date,
    title: "Investment Risk #PART 2",
    updatedAt: new Date().toISOString() as unknown as Date,
    chats: [],
  },
  {
    id: "0a2abb63-3a1b-40a0-8ddd-8117ae3102bf",
    createdAt: new Date().toISOString() as unknown as Date,
    title: "Investment Risk #PART 2",
    updatedAt: new Date().toISOString() as unknown as Date,
    chats: [],
  },
  {
    id: "ac3981b5-d711-4a7f-a5a6-11dc57b2da40",
    createdAt: new Date(dateString).toISOString() as unknown as Date,
    title: "Investment Risks",
    updatedAt: new Date(dateString).toISOString() as unknown as Date,
    chats: [],
  },
  {
    id: "b555de9e-ba99-44c0-9ffa-64a8744c941c",
    createdAt: new Date(dateString2).toISOString() as unknown as Date,
    title: "Who are Siti Boolean?",
    updatedAt: new Date(dateString2).toISOString() as unknown as Date,
    chats: [],
  },
  {
    id: "69f9c483-2e32-4b86-bf94-82f3417d496b",
    createdAt: new Date(dateString3).toISOString() as unknown as Date,
    title: "Investment Recommendations",
    updatedAt: new Date(dateString3).toISOString() as unknown as Date,
    chats: [],
  },
];
