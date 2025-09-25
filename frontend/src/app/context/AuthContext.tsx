// 13-9-2025  refreshUser function update suriya
// app/context/AuthContext.tsx

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Cookies from "js-cookie";
import { verifyUser } from "../../../lib/api";

export type User = {
  name?: string;
  email?: string;
  role?: string;
  clientId?: string;
  propertyId?: string;
  isActive?: boolean;
} | null;

type AuthContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  refreshUser: () => Promise<void>;
  hasRole: (roleOrRoles: string | string[]) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  authChecked: boolean; // <--- important
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const [user, setUser] = useState<User>(initialUser ?? null);
  const [authChecked, setAuthChecked] = useState(false);
  const mounted = useRef(true);

  const normalize = (r?: string) => (r ?? "").toString().toLowerCase().trim();

  const _getCurrentRole = (): string | null => {
    if (user?.role) return normalize(user.role);
    const cookieRole = Cookies.get("auth_role");
    if (cookieRole) return normalize(cookieRole);
    return null;
  };

  const hasRole = (roleOrRoles: string | string[]) => {
    const cur = _getCurrentRole();
    if (!cur) return false;
    if (Array.isArray(roleOrRoles)) return roleOrRoles.map(normalize).includes(cur);
    return cur === normalize(roleOrRoles as string);
  };

  const hasAnyRole = (roles: string[]) => hasRole(roles);
  // app/context/AuthContext.tsx  (only changed refreshUser shown)
  const refreshUser = async () => {
    try {
      const data = await verifyUser(); // may throw on network/timeouts
      const payload = (data && (data.user ?? data)) ?? null;

      if (payload?.user) {
        if (mounted.current) {
          setUser(payload.user as User);
          try {
            if (payload.user.role) Cookies.set("auth_role", payload.user.role, { expires: 7, path: "/" });
          } catch (e) {
            console.warn("Could not set cookie:", e);
          }
        }
      } else if (payload && payload.role) {
        if (mounted.current) setUser(payload as User);
      } else {
        // Not authenticated or no useful payload
        if (mounted.current) setUser(null);
        try {
          Cookies.remove("auth_role");
        } catch { }
      }
    } catch (err: any) {
      // Network or verifyUser threw: treat as not authenticated (but don't crash)
      if (mounted.current) setUser(null);
      try {
        Cookies.remove("auth_role");
      } catch { }
      // optionally set a debug message to your UI or telemetry
      console.info("[Auth] refreshUser failed:", err?.message ?? err);
    }
  };


  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        await refreshUser();
      } finally {
        if (mounted.current) setAuthChecked(true);
      }
    })();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ user, setUser, refreshUser, hasRole, hasAnyRole, authChecked }),
    [user, authChecked]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
