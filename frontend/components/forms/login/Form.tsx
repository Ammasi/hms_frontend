// components/forms/login/Form.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { login as apiLogin, verifyUser as apiVerifyUser } from "../../../lib/api";
import { useAuth } from "@/app/context/AuthContext";

type Props = {
  onRegisterClick: () => void;
  onForgotClick: () => void;
};

export const LoginForm = ({ onRegisterClick, onForgotClick }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const isMounted = useRef(true);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
 
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
console.log("search bar ",searchParams);
  // helper: safe redirect host/path validation
  function getAllowedRedirect(raw?: string | null) {
    if (!raw) return null;
    // must begin with single slash (no protocol), and not be // (which leads to other host)
    if (!raw.startsWith("/") || raw.startsWith("//")) return null;
    // prevent redirect back to login
    if (raw === "/login" || raw === "/login") return null;
    return raw;
  }

  // helper: role -> default landing
  function roleLandingFor(role?: string | null) {
    const r = (role ?? "").toString().toLowerCase();
    if (r === "receptionist") return "/dashboard";
    // software, owner, admin -> clients
    return "/clients";
  }

  // If token cookie exists (user may have been redirected to login with ?redirect=...),
  // attempt to verify and auto-redirect to requested path or role landing.
  useEffect(() => {
    (async () => {
      const token = Cookies.get("auth_token");
      if (!token) return;

      try {
        const res = await apiVerifyUser();
        // support different response shapes
        const verifiedUser = res?.user ?? res?.data?.user ?? res?.data ?? null;
        if (verifiedUser && isMounted.current) {
          setUser(verifiedUser);

          // ensure cookies exist for middleware fast-check
          try {
            Cookies.set("auth_token", token, {
              expires: 7,
              path: "/",
              sameSite: "Lax",
              secure: process.env.NODE_ENV === "production",
            });
            if (verifiedUser.role) {
              Cookies.set("auth_role", verifiedUser.role, {
                expires: 7,
                path: "/",
                sameSite: "Lax",
                secure: process.env.NODE_ENV === "production",
              });
            }
          } catch { }

          // read redirect from query params using Next useSearchParams
          const rawRedirect = searchParams?.get("redirect") ?? null;
          const allowed = getAllowedRedirect(rawRedirect);
          const go = allowed ?? roleLandingFor(verifiedUser.role);
          router.replace(go);
        }
      } catch (err) {
        // verification failed — show login form
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    ;

    try {
      // 1) Call login endpoint
      const res = await apiLogin(formData.email.trim(), formData.password);

      // defensive extraction of token & user (handle different backend shapes)
      const data = res?.data ?? res ?? {};
      const token = data.token ?? data?.data?.token ?? null;
      const loginUser = data.user ?? data?.data?.user ?? data?.user ?? null;

      if (!token) throw new Error("No token returned from server");

      // 2) Save token cookie (client-side). Prefer server-set httpOnly cookie in production.
      Cookies.set("auth_token", token, {
        expires: 7,
        path: "/",
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      });

      // convenience: set role cookie from login response to help middleware fast-check
      if (loginUser?.role) {
        try {
          Cookies.set("auth_role", loginUser.role, {
            expires: 7,
            path: "/",
            sameSite: "Lax",
            secure: process.env.NODE_ENV === "production",
          });
        } catch { }
      }

      // 3) Verify user using token (server should accept cookie or Authorization)
      let verifiedUser: any = null;
      try {
        const verifyRes = await apiVerifyUser();
        verifiedUser = verifyRes?.user ?? verifyRes?.data?.user ?? verifyRes?.data ?? loginUser;
      } catch {
        // fallback to login response
        verifiedUser = loginUser;
      }

      if (!verifiedUser) throw new Error("Verification failed after login");

      // 4) Update app state & ensure role cookie present
      if (isMounted.current) {
        setUser(verifiedUser);
        try {
          Cookies.set("auth_role", verifiedUser.role ?? "", {
            expires: 7,
            path: "/",
            sameSite: "Lax",
            secure: process.env.NODE_ENV === "production",
          });
        } catch { }
      }

      // 5) Redirect to original requested path OR role landing
      const rawRedirect = searchParams?.get("redirect") ?? null;
      const allowedRedirect = getAllowedRedirect(rawRedirect);
      const role = (verifiedUser.role ?? "").toString().toLowerCase();
      const landing = allowedRedirect ?? roleLandingFor(role);

      router.replace(landing);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Login failed. Please try again.";
      if (isMounted.current) setError(msg);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-center font-bold mb-4">Hotel Management Software</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" autoComplete="off">
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            className="border p-2 rounded"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            autoComplete="username"

          />

          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            className="border p-2 rounded"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            autoComplete="current-password"

          />

          <div className="text-right text-sm">
            <button
              type="button"
              onClick={onForgotClick}
              className="text-blue-600 hover:underline"

            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"

          >
            Login
          </button>

          <button
            type="button"
            onClick={onRegisterClick}
            className="bg-gray-500 text-white py-2 rounded hover:bg-gray-600"

          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};
