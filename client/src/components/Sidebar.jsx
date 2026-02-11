// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiPocket,
  FiBox,
  FiDatabase,
  FiSettings,
  FiUsers,
  FiCreditCard,
  FiClock,
  FiKey,
  FiFileText,
  FiChevronDown,
  FiMenu,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ collapsed, setCollapsed }) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const isActive = (p) => pathname === p;

  // ✅ Dropdown states restored
  const [openSections, setOpenSections] = useState({
    hub: true,
    manage: true,
    account: true,
  });

  const toggleSection = (key) => {
    if (collapsed) return; // lock dropdowns in mini mode
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      key: "hub",
      label: "The Hub",
      items: [
        { name: "Serverless Repos", path: "/repos", icon: <FiBox /> },
        { name: "Pod Templates", path: "/templates", icon: <FiPocket /> },
        { name: "Public Endpoints", path: "/endpoints", icon: <FiHome /> },
      ],
    },
    {
      key: "manage",
      label: "Manage",
      items: [
        { name: "Serverless", path: "/serverless", icon: <FiPocket /> },
        { name: "Pods", path: "/pods", icon: <FiBox /> },
        {
          name: "Instant Clusters",
          path: "/InstantCluster",
          icon: <FiClock />,
        },
        { name: "Storage", path: "/storage", icon: <FiDatabase /> },
        { name: "Fine Tuning", path: "/tuning", icon: <FiKey /> },
        { name: "Secrets", path: "/secrets", icon: <FiFileText /> },
      ],
    },
    {
      key: "account",
      label: "Account",
      items: [
        { name: "Billing", path: "/billing", icon: <FiCreditCard /> },
        { name: "Team", path: "/team", icon: <FiUsers /> },
        { name: "Savings Plans", path: "/savings-plans", icon: <FiPocket /> },
        { name: "Audit Logs", path: "/audit-logs", icon: <FiFileText /> },
        { name: "Remote Access", path: "/remote-access", icon: <FiKey /> },
        { name: "Settings", path: "/settings", icon: <FiSettings /> },
      ],
    },
  ];

  return (
   <aside
  className={`
    fixed top-16 left-0 h-[calc(100vh-4rem)]
    bg-[#0B0E11] border-r border-gray-800
    text-gray-300 transition-all duration-300
    overflow-y-auto overscroll-contain
    hide-scrollbar mt-
    ${collapsed ? "w-16" : "w-64"}
  `}
>


      {/* Toggle */}
      <div className="flex items-center justify-between px-4 py-3">
        {!collapsed && (
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            Menu
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-300 hover:text-white"
        >
          <FiMenu size={18} />
        </button>
      </div>

      {/* User */}
      {!collapsed && (
        <div className="mx-3 mb-4 p-3 bg-[#111417] border border-gray-700 rounded-lg">
          <p className="text-sm font-semibold truncate">
            {user?.name || user?.email || "User"}
          </p>
          <p className="text-xs text-gray-400">
            ${user?.walletBalance ?? "0.00"}
          </p>
        </div>
      )}

      {/* Primary */}
      <nav className="px-2 space-y-1">
        <SidebarItem
          to="/"
          icon={<FiHome />}
          label="Home"
          collapsed={collapsed}
          active={isActive("/")}
        />
        <SidebarItem
          to="/profile"
          icon={<FiUsers />}
          label="Profile"
          collapsed={collapsed}
          active={isActive("/profile")}
        />
      </nav>

      {/* Sections */}
      {sections.map((section) => {
        const isOpen = collapsed || openSections[section.key];

        return (
          <div key={section.key} className="mt-6">
            {/* Header */}
            <button
              onClick={() => toggleSection(section.key)}
              className={`
                w-full flex items-center justify-between px-4 mb-2
                text-xs uppercase tracking-wide text-gray-500
                ${collapsed ? "cursor-default" : "hover:text-gray-300"}
              `}
            >
              {!collapsed && <span>{section.label}</span>}
              {!collapsed && (
                <FiChevronDown
                  className={`transition-transform ${
                    openSections[section.key] ? "rotate-0" : "-rotate-90"
                  }`}
                />
              )}
            </button>

            {/* Items */}
            {isOpen && (
              <nav className="px-2 space-y-1">
                {section.items.map((item) => (
                  <SidebarItem
                    key={item.path}
                    to={item.path}
                    icon={item.icon}
                    label={item.name}
                    collapsed={collapsed}
                    active={isActive(item.path)}
                  />
                ))}
              </nav>
            )}
          </div>
        );
      })}
    </aside>
  );
}

function SidebarItem({ to, icon, label, collapsed, active }) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md text-sm
        transition
        ${
          active
            ? "bg-violet-600/20 border border-violet-500 text-white"
            : "hover:bg-[#1a1f26] text-gray-400"
        }
      `}
    >
      <span className="text-lg">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
