'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import Cookies from "js-cookie";
type User = {
  name: string;
  email: string;
  role: string;
  clientId: string;
  propertyId: string;
};

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        'http://192.168.1.14:8000/api/v1/auth/logout',
        {},
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        localStorage.removeItem('user');
        Cookies.remove("auth_token");
        router.push('/');
      } else {
        alert('Logout failed');
      }
    } catch (err) {
      alert('Logout error');
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-blue-800 text-white p-4 flex justify-between items-center relative">
      <h1 className="text-xl font-bold">HMS</h1>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {/* User Icon */}
        <button onClick={() => setShowDropdown(!showDropdown)}>
          <FaUserCircle size={28} className="text-white hover:text-gray-300" />
        </button>

        {/* Dropdown */}
        {showDropdown && user && (
          <div className="absolute right-0 top-12 w-64 bg-white text-black rounded shadow-md p-4 z-50">
            <div className="mb-2">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-blue-600 font-medium capitalize">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
