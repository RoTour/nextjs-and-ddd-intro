"use client";

import React, { createContext, useContext } from "react";

type RuntimeConfig = {
  WEBSOCKET_URL: string;
};

const RuntimeConfigContext = createContext<RuntimeConfig | null>(null);

export const RuntimeConfigProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: RuntimeConfig;
}) => {
  return (
    <RuntimeConfigContext.Provider value={value}>
      {children}
    </RuntimeConfigContext.Provider>
  );
};

export const useRuntimeConfig = () => {
  const context = useContext(RuntimeConfigContext);

  if (!context) {
    throw new Error(
      "useRuntimeConfig must be used within a RuntimeConfigProvider",
    );
  }

  return context;
};
