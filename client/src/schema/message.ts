import z from "zod";

export const messageSchema = z.object({
  id: z.string().describe("Should be UUID"),
  content: z.string(),
  role: z.enum(["user", "bot", "suggestion", "suggestion-topic", "assistant"]),
});

export type Message = z.infer<typeof messageSchema>;
