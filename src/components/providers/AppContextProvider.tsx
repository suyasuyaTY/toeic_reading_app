"use client";
import useLocalStorage from "@/hooks/useLocalStorage";
import React, { createContext, useContext } from "react";

interface AppContextType {
  gasWebhookUrl: string;
  setGasWebhookUrl: (url: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gasWebhookUrl, setGasWebhookUrl] = useLocalStorage<string>(
    "gasWebhookUrl",
    ""
  );

  return (
    <AppContext.Provider value={{ gasWebhookUrl, setGasWebhookUrl }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
};
