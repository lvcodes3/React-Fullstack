// dependencies
import { createContext, Dispatch, SetStateAction } from "react";

type AuthContextType = {
  authState: boolean;
  setAuthState: Dispatch<SetStateAction<boolean>>;
};

// Initial values for the context
const initialAuthState: AuthContextType = {
  authState: false,
  setAuthState: () => {},
};

// Create the AuthContext object with initial values
export const AuthContext = createContext<AuthContextType>(initialAuthState);
