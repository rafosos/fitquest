import React from "react";
import { useStorageState } from "@/hooks/useStorageState";
import { LoginResponse } from "@/classes/loginResponse";

const AuthContext = React.createContext<{
  signIn: (token: LoginResponse) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  username: string | null;
  id: string | null;
  setUser: (user: string) => void;
}>({
  signIn: (token: LoginResponse) => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  username: null,
  id: null,
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
  const [[isLoadingId, id], setId] = useStorageState("id");
  return (
    <AuthContext.Provider
      value={{
        signIn: (token:LoginResponse) => {
          setSession(token.access_token);
          setUser(token.username);
          setId(token.id.toString());
        },
        signOut: () => {
          setSession(null);
          setUser(null);
          setId(null);
        },
        session,
        id,
        isLoading: isLoading || isLoadingUser || isLoadingId,
        username: user,
        setUser
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
