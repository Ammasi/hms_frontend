// 13-9-2025 Role based allow pagas change in code code structure  suriya 

"use client";
import Link from "next/link";
import { useState } from "react";
import {
  FaHotel,
  FaUsers,
  FaTasks,
  FaStream, 
  FaClipboardCheck,
  FaFileInvoice,
  FaUserTie,
  FaFileInvoiceDollar, 
  FaCreditCard,
  FaEnvelope,
  FaPhoneAlt,
  FaBell, 
  FaClipboardList,
  FaBed,
  FaMoon,
  FaCalendarCheck,
} from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext"; // adjust path if necessary

type NavItem = {
  href: string;
  label: string;
  Icon: React.ComponentType<any>;
  roles?: string[]; // allowed roles (lower/upper case accepted)
};

const navItems: NavItem[] = [
  { href: "/clients", label: "Clients", Icon: FaUsers, roles: ["software"] },
  { href: "/dashboard", label: "Dashboard", Icon: FaTasks, roles: ["receptionist"] },
  { href: "/checkin", label: "Check In", Icon: FaHotel, roles: ["receptionist", "software"] },

  { href: "/customerManagement", label: "Customer Management", Icon: FaUsers, roles: ["admin", "owner", "software", "receptionist"] },

  { href: "/taskSheet", label: "Task Sheet", Icon: FaTasks, roles: ["software"] },
  { href: "/subscriptionLimit", label: "Subscription Limit", Icon: FaStream, roles: ["software"] },
// { href: "/properties", label: "Properties", Icon: FaBuilding, roles: [  "software", "owner", "admin"] },
// { href: "/rooms", label: "Rooms", Icon: FaClipboardCheck, roles: [  "software", "owner", "admin"] },

  { href: "/bookingReport", label: "Booking Report", Icon: FaClipboardList, roles:  ["receptionist", "software"]  },
  { href: "/stayReport", label: "Stay Report", Icon: FaBed, roles: ["receptionist", "software"]  },
  { href: "/nightAuditReport", label: "Night Audit Report", Icon: FaMoon, roles:  ["receptionist", "software"]  },
  { href: "/reservationReport", label: "Reservation Report", Icon: FaCalendarCheck, roles: ["receptionist", "software"]  },

  { href: "/checkInMode", label: "Check In Mode", Icon: FaClipboardCheck, roles: ["software"] },
  { href: "/gstRegister", label: "GST Registration", Icon: FaFileInvoice, roles: ["software"] },

  { href: "/employee", label: "Employee Management", Icon: FaUserTie, roles: ["software"] },
  { href: "/chargesRegister", label: "Charges Register", Icon: FaFileInvoiceDollar, roles: ["software"] },

  { href: "/subscriptionModel", label: "Subscription Model", Icon: FaCreditCard, roles: ["software"] },
  { href: "/statusMessage", label: "Status Message", Icon: FaEnvelope, roles: ["software"] },
  { href: "/callMessage", label: "Call Message", Icon: FaPhoneAlt, roles: ["software"] },
  { href: "/notification", label: "Notification", Icon: FaBell, roles: ["software"] },

  { href: "/billing", label: "Billing", Icon: FaBell, roles: ["software"] },
  { href: "/BillingInfoList", label: "BillingInfoList", Icon: FaBell, roles: ["software"] },
  // { href: "/customerInfo", label: "Customer Info", Icon: FaAddressCard, roles: ["software"] },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const { user, hasRole } = useAuth();

  const toggleCollapse = () => setCollapsed((s) => !s);

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"} 
        bg-blue-800 text-white transition-all duration-300 ease-in-out 
        flex flex-col h-screen`}
    >
      <div className="flex justify-end p-4 border-b border-blue-700 flex-shrink-0">
        <button
          onClick={toggleCollapse}
          className="text-white bg-blue-700 px-3 py-1 rounded hover:bg-blue-600"
          aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
        >
          {collapsed ? "☰" : "✕"}
        </button>
      </div>

      <div
        className={`${collapsed ? "p-3" : "p-0"} flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-900`}
      >
        <ul className="space-y-4 flex flex-col items-start min-h-full">
          {navItems.map((item) => {
            // if item has roles defined, require at least one; otherwise show to all
            const allowed = !item.roles || item.roles.length === 0 || item.roles.some((r) => hasRole(r));
            if (!allowed) return null;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 p-2 rounded hover:bg-blue-700"
                >
                  <item.Icon className="text-xl" />
                  <span className={collapsed ? "hidden" : ""}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
