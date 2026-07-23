import {
  createContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AuthContextType {
  token: string | null;
  user: { user_id: string; username: string } | null;
  login: (token: string, user: { user_id: string; username: string }) => void;
  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token"),
  );

  const [user, setUser] = useState<{ user_id: string; username: string } | null>(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (newToken: string, userData: { user_id: string; username: string }) => {
    localStorage.setItem("access_token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
    }),
    [token, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

