"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

interface ProviderProps {
  children: React.ReactNode;
  session?: any; // Replace 'any' with the appropriate type if known
}

const Provider: React.FC<ProviderProps> = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default Provider;