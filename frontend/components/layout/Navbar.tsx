// chnages 13-9-2025 logout  function call sueiya 
// components/layout/Navbar.tsx  
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import { logout } from "../../lib/api";
 

export default function Navbar() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await logout(); // server call + cookie cleanup
    } catch (err) {
      console.error("Logout failed", err);
   
    } finally {
      
      try {
        setUser(null);
      } catch (e) {
        console.warn("Failed to clear user in context", e);
      }

      setShowDropdown(false);
      setLoggingOut(false);
      // navigate to public landing
      router.push("/");
    }
  };

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <nav className="w-full bg-blue-800 text-white px-6 py-3 flex justify-between items-center relative shadow-md">
      <h1 className="text-2xl font-bold tracking-wide">HMS</h1>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown((s) => !s)}
          className="relative p-1 rounded-full hover:bg-blue-700 transition"
          aria-haspopup="true"
          aria-expanded={showDropdown}
        >
          <FaUserCircle size={30} className="text-white" />
          {user?.isActive && (
            <span className="absolute bottom-1 right-1 block h-1 w-1 rounded-full bg-green-500 ring-2 ring-white" />
          )}
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 z-50">
            {user ? (
              <>
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">Client ID: {user.clientId}</p>
                  <p className="text-xs text-gray-500">Property ID: {user.propertyId}</p>
                  <p className="text-sm text-blue-600 font-medium capitalize mt-1">
                    {user.role}
                  </p>
                </div>

                <div className="p-3">
                  <button
                    onClick={handleLogout}
                    className={`w-full py-2 rounded-lg transition ${
                      loggingOut
                        ? "bg-gray-400 text-white cursor-wait"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={loggingOut}
                  >
                    {loggingOut ? "Signing out…" : "Logout"}
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4 text-sm text-gray-700">Not signed in</div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
