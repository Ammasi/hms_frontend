'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  FaHotel,
  FaUsers,
  FaTasks,
  FaStream,
  FaConciergeBell,
  FaClipboardCheck,
  FaFileInvoice, 
  FaUserTie,
  FaFileInvoiceDollar,
} from 'react-icons/fa';


export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside
      className={`${collapsed ? 'w-20' : 'w-80'} bg-blue-800 text-white transition-all duration-300 ease-in-out min-h-screen p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-900`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleCollapse}
          className="text-white bg-blue-700 px-3 py-1 rounded hover:bg-blue-600"
        >
          {collapsed ? '☰' : '✕'}
        </button>
      </div>

      {/* Navigation Items */}
      <ul className="space-y-4">
        {/* Hotel Management */}
        <li>
          <Link href="/hotelManagement" className="flex items-center gap-3 p-2 rounded hover:bg-blue-700">
            <FaHotel className="text-xl" />
            <span className={collapsed ? 'hidden' : ''}>Hotel Management</span>
          </Link>
        </li>

        {/* Customer Management */}
        <li>
          <Link href="/customerManagement" className="flex items-center gap-3 p-2 rounded hover:bg-blue-700">
            <FaUsers className="text-xl" />
            <span className={collapsed ? 'hidden' : ''}>Customer Management</span>
          </Link>
        </li>

        {/* Task Sheet */}
        <li>
          <Link href="/taskSheet" className="flex items-center gap-3 p-2 rounded hover:bg-blue-700">
            <FaTasks className="text-xl" />
            <span className={collapsed ? 'hidden' : ''}>Task Sheet</span>
          </Link>
        </li>

        {/* Subscription Limit */}
        <li>
          <Link href="/subscriptionLimit" className="flex items-center gap-3 p-2 rounded hover:bg-blue-700">
            <FaStream className="text-xl" />
            <span className={collapsed ? 'hidden' : ''}>Subscription Limit</span>
          </Link>
        </li>

        {/* Hotel Facility */}
        <li>
          <Link href="/hotelFacility" className="flex items-center gap-3 p-2 rounded hover:bg-blue-700">
            <FaConciergeBell className="text-xl" />
            <span className={collapsed ? 'hidden' : ''}>Hotel Facility</span>
          </Link>
        </li>

        {/* Check In Mode */}
        <li>
          <Link href="/checkInMode" className="flex items-center gap-3 p-2 rounded hover:bg-blue-700">
            <FaClipboardCheck className="text-xl" />
            <span className={collapsed ? 'hidden' : ''}>Check In Mode</span>
          </Link>
        </li>

        {/* GST Registration */}
        <li>
          <Link href="/gstRegister" className="flex items-center gap-3 p-2 rounded hover:bg-blue-700">
            <FaFileInvoice className="text-xl" />
            <span className={collapsed ? 'hidden' : ''}>GST Registration</span>
          </Link>
        </li>

        {/* Employee Management */}
        <li>
          <Link href="/employee" className="flex items-center gap-3 p-2 rounded hover:bg-blue-700">
            <FaUserTie className="text-xl" />
            <span className={collapsed ? 'hidden' : ''}>Employee Management</span>
          </Link>
        </li>
        {/*  Charges Register */}
        <li>
          <Link href="/chargesRegister" className="flex items-center gap-3 p-2 rounded hover:bg-blue-700">
            <FaFileInvoiceDollar className="text-xl" />
            <span className={collapsed ? 'hidden' : ''}>Charges Register</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}
