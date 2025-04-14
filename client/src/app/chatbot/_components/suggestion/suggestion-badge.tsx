import { Sparkles } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";

export interface SuggestionBadgeProps {
  icon?: React.ReactNode;
  value: string;
  onClick?: (value: string, topicId: string) => void;
  topicId: string;
}

export default function SuggestionBadge({
  onClick,
  value,
  icon,
  topicId,
}: SuggestionBadgeProps) {
  const handleSuggestionClick = () => {
    if (onClick) onClick(value, topicId);
  };

  return (
    <Badge
      className="bg-[#161B21] border border-input shadow-none text-white flex gap-1 md:gap-2 items-center text-xs cursor-pointer p-2 md:p-3 py-1.5 md:py-2 whitespace-nowrap hover:bg-zinc-200 hover:dark:bg-background hover:dark:border-accent2 flex-shrink-0"
      onClick={handleSuggestionClick}
    >
      {icon ? (
        icon
      ) : (
        <Sparkles size={14} className="text-purple-400 md:w-4 md:h-4" />
      )}
      {value}
    </Badge>
  );
}
