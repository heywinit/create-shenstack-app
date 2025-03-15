import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  token: string | null;
  credentials: {
    clientCode: string;
    username: string;
    password: string;
  } | null;
  setToken: (token: string | null) => void;
  setCredentials: (credentials: UserState["credentials"]) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      credentials: null,
      setToken: (token) => set({ token }),
      setCredentials: (credentials) => set({ credentials }),
    }),
    {
      name: "user-storage",
    }
  )
);
