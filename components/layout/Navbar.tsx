'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '@/app/context/AuthContext';
import { logout } from '../../lib/api';



export default function Navbar() {
  const router = useRouter();
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    router.push("/");
  };


  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <nav className="w-full bg-blue-800 text-white px-6 py-3 flex justify-between items-center relative shadow-md">

      <h1 className="text-2xl font-bold tracking-wide">HMS</h1>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>

        <button
          onClick={() => setShowDropdown((s) => !s)}
          className="relative p-1 rounded-full hover:bg-blue-700 transition"
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
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Logout
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
