 
"use client";
import React, { createContext, useContext, useState, useMemo } from "react";

export type User = {
  name: string;
  email: string;
  role: string;
  clientId?: string;
  propertyId?: string;
  isActive?:boolean;
} | null;

type AuthContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User;
}) {
  const [user, setUser] = useState<User>(initialUser);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
