"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/use-session-store";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuth(props: P) {
    const router = useRouter();
    const sessionId = useSessionStore((state) => state.id);
    const accessToken = useSessionStore((state) => state.accessToken);

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token || !sessionId || !accessToken) {
        router.replace("/");
      }
    }, [sessionId, accessToken, router]);

    if (!sessionId || !accessToken) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
}
