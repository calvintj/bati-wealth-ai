import React from "react";

import SuggestionBadge, { SuggestionBadgeProps } from "./suggestion-badge";

export interface SuggestionOptions
  extends Omit<SuggestionBadgeProps, "onSuggestionClick" | "icon"> {
  icon?: React.ReactNode;
  topicId: string;
}

export interface SuggestionListsProps {
  suggestions: SuggestionOptions[];
  onSuggestion: (value: string, topicId: string) => void;
}

export default function SuggestionLists({
  suggestions,
  onSuggestion,
}: SuggestionListsProps) {
  return (
    <div className="flex gap-1 md:gap-2 p-1 md:p-2 overflow-x-scroll w-full hide-scrollbar mx-auto md:justify-center">
      {suggestions.map((option) => (
        <SuggestionBadge
          onClick={onSuggestion}
          key={option.value}
          {...option}
        />
      ))}
    </div>
  );
}
