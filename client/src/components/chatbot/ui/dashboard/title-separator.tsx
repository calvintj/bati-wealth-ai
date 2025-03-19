import React, { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface TitleSeparatorProps
  extends PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {}

export default function TitleSeparator({
  children,
  className,
  ...props
}: TitleSeparatorProps) {
  return (
    <div
      className={cn(
        "text-xl font-semibold bg-[#E7F8FE] w-full py-3 text-center rounded-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
