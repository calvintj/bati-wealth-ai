"use client";

import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";

import { useSessionStore } from "@/stores/use-session-store";

export default function Authorization({ children }: PropsWithChildren) {
  const sessionId = useSessionStore((state) => state.id);
  const router = useRouter();

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
    }
  }, [sessionId]);

  return <>{children}</>;
}
