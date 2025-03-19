import { cva, type VariantProps } from "class-variance-authority";
import React, { PropsWithChildren } from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const summaryCardVariants = cva(
  "flex justify-center rounded-xl p-0 w-full shadow-none",
  {
    variants: {
      size: {
        default: "p-4",
        sm: "p-2",
        lg: "p-6",
      },
      direction: {
        start: "text-start",
        end: "text-end",
        default: "text-center",
      },
    },
    defaultVariants: {
      size: "default",
      direction: "default",
    },
  }
);

interface SummaryCardProps
  extends PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
    VariantProps<typeof summaryCardVariants> {
  summary: string | number;
  description: string;
}

const SummaryCard = React.forwardRef<HTMLDivElement, SummaryCardProps>(
  (
    { description, summary, children, className, size, direction, ...props },
    ref
  ) => {
    return (
      <Card
        className={cn(summaryCardVariants({ size, direction, className }))}
        ref={ref}
        {...props}
      >
        <CardHeader className="flex w-full flex-col gap-2 p-0 py-2">
          <CardDescription className="text-sm">{description}</CardDescription>
          <CardTitle className="text-lg">{summary}</CardTitle>
        </CardHeader>
        {children}
      </Card>
    );
  }
);

SummaryCard.displayName = "SummaryCard";

export { SummaryCard, summaryCardVariants };
