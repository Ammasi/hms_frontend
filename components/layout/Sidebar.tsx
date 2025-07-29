'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-80'
      } bg-blue-800 text-white transition-all duration-300 ease-in-out min-h-screen p-4`}
    >
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleCollapse}
          className="text-white bg-blue-700 px-3 py-1 rounded hover:bg-blue-600"
        >
          {collapsed ? '☰' : '✕'}
        </button>
      </div>
      <ul className="space-y-4">
        <li>
          <Link href="/hotelManagement" className="flex items-center p-2 rounded hover:bg-blue-700">
            <span className={`${collapsed ? 'text-xl' : ''}`}>
              {collapsed ? 'Hotel ' : 'Hotel Management'}
            </span>
          </Link>
        </li>  
      </ul>
    </aside>
  );
}