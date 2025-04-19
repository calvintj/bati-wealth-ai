import { create } from "zustand";

interface User {
  id: string;
  email: string;
  rm_number?: string;
  role: string;
}

interface SessionState {
  id: string | null;
  accessToken: string | null;
  user: User | null;
  setSession: (session: {
    accessToken: string | null;
    id: string | null;
    user?: User | null;
  }) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  id: null,
  accessToken: null,
  user: null,
  setSession: ({
    accessToken,
    id,
    user,
  }: {
    accessToken: string | null;
    id: string | null;
    user?: User | null;
  }) => set({ accessToken, id, user: user || null }),
}));
