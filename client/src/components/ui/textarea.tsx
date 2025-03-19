"use client";

import * as React from "react";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

import { cn } from "@/lib/utils";

interface TextareaProps
  extends Omit<React.ComponentProps<"textarea">, "style">,
    TextareaAutosizeProps {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  wrapperStyle?:React.HTMLAttributes<HTMLDivElement>['style']
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ startAdornment, endAdornment, className, wrapperStyle,...props }, ref) => {
    return (
      <div className="w-full flex items-center justify-between relative" style={wrapperStyle}>
        {startAdornment && (
          <div className="absolute left-5 top-0 w-4 h-full flex justify-between items-center">
            {startAdornment}
          </div>
        )}
        <TextareaAutosize
          className={cn(
            "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            startAdornment && "pl-12",
            endAdornment && "pr-12",
            className
          )}
          ref={ref}
          {...props}
        />
        {endAdornment && (
          <div className="absolute right-5 top-0 w-4 h-full flex justify-between items-center">
            {endAdornment}
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
