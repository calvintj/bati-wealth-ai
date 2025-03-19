import * as React from "react";

import { chatBotModels } from "@/app/(main)/chatbot/_components/model_selector/chatbot-models";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ModelSelectorProps
  extends Omit<React.ComponentProps<typeof Select>, "defaulValue"> {
  className?: string;
}

export function ModelSelector({ className, ...props }: ModelSelectorProps) {
  return (
    <Select defaultValue="gpt-4o" {...props}>
      <SelectTrigger className={cn(className, "capitalize max-w-[170px]")}>
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select Model</SelectLabel>
          {chatBotModels.map((model) => (
            <SelectItem value={model} key={model}>
              {model}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
