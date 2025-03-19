import { z } from "zod";

import { messageSchema } from "@/schema/message";

export const messageGeneratedResponse = z.object({
  messages: z.array(messageSchema),
});

export type MessageGeneratedResponse = z.infer<typeof messageGeneratedResponse>;
