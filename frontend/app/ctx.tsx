import React from "react";
import { useStorageState } from "@/hooks/useStorageState";

const AuthContext = React.createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  user: string | null;
  setUser: (user: string) => void;
}>({
  signIn: (token: string) => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  user: null,
  setUser: (user: string) => null
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [[isLoadingUser, user], setUser] = useStorageState("user");
  return (
    <AuthContext.Provider
      value={{
        signIn: (token) => {
          setSession(token);
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading: isLoading || isLoadingUser,
        user,
        setUser
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
