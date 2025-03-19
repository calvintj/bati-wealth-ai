export interface CreateChatDto {
  model: string;
  input: string;
  language: "Indonesia" | "English";
  user_data: "string";
  is_init: 0 | 1;
  customer_id: string;
}
