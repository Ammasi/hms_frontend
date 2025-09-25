// app/(protected)/dashboard/layout.tsx
// app/(protected)/dashboard/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/context/AuthContext";
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, authChecked } = useAuth();

 
  useEffect(() => {
 
    if (!authChecked) return;

    if (!user) {
      const current =
        typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
      const loginUrl = "/?redirect=" + encodeURIComponent(current);
      router.replace(loginUrl);
    }
  }, [authChecked, user, router]);

 
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="loader relative w-10 h-10 rotate-[165deg]" />
      </div>
    );
  }

 
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="loader relative w-10 h-10 rotate-[165deg]" />
      </div>
    );
  }

 
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main
          className="flex-1 overflow-y-auto bg-cover bg-center"
          style={{ backgroundImage: `url('/Home/home.jpg')` }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
