"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";

import { useIsMounted } from "@/components/chatbot/ui/use-is-mounted";
import { ThemeProvider } from "@/providers/theme-provider";

const queryClient = new QueryClient();

export default function AppProvider({
  children,
  value,
}: PropsWithChildren<{ value: "light" | "dark" }>) {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <ThemeProvider
      attribute={["class"]}
      defaultTheme={value}
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
