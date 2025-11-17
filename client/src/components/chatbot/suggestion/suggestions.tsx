import Image from "next/image";

import { SuggestionOptions } from "@/components/chatbot/suggestion/suggestion-lists";

export const suggestions: SuggestionOptions[] = [
  {
    value: "Customer Description",
    icon: (
      <Image src="/profile-user.svg" alt="profile" width={16} height={16} />
    ),
    topicId: "e7990fe4-9530-4c82-bcc7-8700ec14dc6d",
  },
  {
    value: "Customer Recommendations",
    icon: <Image src="/thumb-up.svg" alt="profile" width={16} height={16} />,
    topicId: "2226c352-c5ef-428a-b911-253cd1203614",
  },
  {
    value: "Product Analysis",
    icon: <Image src="/graph.svg" alt="profile" width={16} height={16} />,
    topicId: "5a6cf722-655d-4594-b58e-3b66932c7a91",
  },
  {
    value: "Top Customer",
    icon: (
      <Image src="/profile-user.svg" alt="profile" width={16} height={16} />
    ),
    topicId: "e497b8b0-f68c-448b-b1b6-b6b2a8df3ad2",
  },
];
