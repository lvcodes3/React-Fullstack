// dependencies
import { createContext, Dispatch, SetStateAction } from "react";

type AuthContextType = {
  authState: {
    id: number;
    username: string;
    status: boolean;
  };
  setAuthState: Dispatch<
    SetStateAction<{ id: number; username: string; status: boolean }>
  >;
};

// Initial values for the context
const initialAuthState: AuthContextType = {
  authState: {
    id: 0,
    username: "",
    status: false,
  },
  setAuthState: () => {},
};

// Create the AuthContext object with initial values
export const AuthContext = createContext<AuthContextType>(initialAuthState);
