import { createContext, useContext, useState, useMemo, type ReactNode } from "react";

export interface AuthUser {
  username: string;
  email: string;
  avatarIndex: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "seal.auth.user";

function loadUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser());

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      signIn: (u) => {
        setUser(u);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      },
      signOut: () => {
        setUser(null);
        sessionStorage.removeItem(STORAGE_KEY);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
