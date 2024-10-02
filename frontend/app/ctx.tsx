import React from "react";
import { useStorageState } from "@/hooks/useStorageState";

const AuthContext = React.createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  userId: string | null;
  setUserId: (id: string) => void;
}>({
  signIn: (token: string) => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  userId: null,
  setUserId: (id: string) => null
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [[isLoadingUser, userId], setUserId] = useStorageState("userId");
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
        isLoading,
        userId,
        setUserId
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
