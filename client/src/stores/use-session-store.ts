import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionState {
  id: string | null;
  accessToken: string | null;
}

interface SessionAction {
  setSession: (newState: SessionState) => void;
}

export const useSessionStore = create(
  persist<SessionState & SessionAction>(
    (set) => ({
      id: null,
      accessToken: null,
      setSession: (newState: SessionState) =>
        set((state) => ({ ...state, ...newState })),
    }),
    {
      name: "x-bati-session",
    }
  )
);
