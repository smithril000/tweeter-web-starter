import { createContext, useContext, useState } from "react";

interface AuthCredentials {
  alias: string;
  password: string;
  setAlias: (alias: string) => void;
  setPassword: (password: string) => void;
  clearCredentials: () => void;
}

const AuthCredentialsContext = createContext<AuthCredentials | undefined>(
  undefined,
);

interface Props {
  children: React.ReactNode;
}

export const AuthCredentialsProvider: React.FC<Props> = ({ children }) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");

  const clearCredentials = () => {
    setAlias("");
    setPassword("");
  };

  return (
    <AuthCredentialsContext.Provider
      value={{ alias, password, setAlias, setPassword, clearCredentials }}
    >
      {children}
    </AuthCredentialsContext.Provider>
  );
};

export const useAuthCredentials = (): AuthCredentials => {
  const credentials = useContext(AuthCredentialsContext);
  if (!credentials) {
    throw new Error(
      "useAuthCredentials must be used within an AuthCredentialsProvider",
    );
  }
  return credentials;
};
