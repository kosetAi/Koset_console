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
  FiX,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ collapsed, setCollapsed }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isActive = (p) => pathname === p;

  const [openSections, setOpenSections] = useState({
    hub: true,
    manage: true,
    account: true,
  });

  const handleSelection = () => {
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    }
  };

  const toggleSection = (key) => {
    if (collapsed) return;
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
    <>
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] lg:hidden transition-opacity"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`
          fixed top-0 lg:top-16 left-0 h-full lg:h-[calc(100vh-4rem)]
          bg-[#0B0E11] border-r border-gray-800
          text-gray-300 transition-all duration-300 ease-in-out
          overflow-y-auto overscroll-contain
          hide-scrollbar z-[120]
          ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "translate-x-0 w-64"}
        `}
      >
        {/* FIXED ALIGNMENT HEADER */}
        <div
          className={`
          flex items-center py-4 lg:py-3 border-b border-white/5 lg:border-none
          ${collapsed ? "justify-center px-0" : "justify-between px-4"}
        `}
        >
          {!collapsed && (
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Menu
            </span>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-300 hover:text-white p-1 flex items-center justify-center"
          >
            <span className="lg:hidden">
              {!collapsed ? <FiX size={20} /> : <FiMenu size={20} />}
            </span>
            <span className="hidden lg:block">
              <FiMenu size={18} />
            </span>
          </button>
        </div>

        {!collapsed && (
          <div className="mx-3 my-4 p-3 bg-[#111417] border border-gray-700 rounded-lg">
            <p className="text-sm font-semibold truncate text-white">
              {user?.name || user?.email || "User"}
            </p>
            <p className="text-xs text-violet-400">
              ${user?.walletBalance ?? "0.00"}
            </p>
          </div>
        )}

        <nav className="px-2 space-y-1">
          <SidebarItem
            to="/"
            icon={<FiHome />}
            label="Home"
            collapsed={collapsed}
            active={isActive("/")}
            onClick={handleSelection}
          />
          <SidebarItem
            to="/profile"
            icon={<FiUsers />}
            label="Profile"
            collapsed={collapsed}
            active={isActive("/profile")}
            onClick={handleSelection}
          />
        </nav>

        {sections.map((section) => {
          const isOpen = collapsed || openSections[section.key];
          return (
            <div key={section.key} className="mt-6">
              <button
                onClick={() => toggleSection(section.key)}
                className={`w-full flex items-center justify-between px-4 mb-2 text-xs uppercase tracking-wide text-gray-500 ${collapsed ? "cursor-default" : "hover:text-gray-300"}`}
              >
                {!collapsed && <span>{section.label}</span>}
                {!collapsed && (
                  <FiChevronDown
                    className={`transition-transform duration-200 ${openSections[section.key] ? "rotate-0" : "-rotate-90"}`}
                  />
                )}
              </button>
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
                      onClick={handleSelection}
                    />
                  ))}
                </nav>
              )}
            </div>
          );
        })}
      </aside>
    </>
  );
}

function SidebarItem({ to, icon, label, collapsed, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
        active
          ? "bg-violet-600/20 border border-violet-500 text-white"
          : "hover:bg-[#1a1f26] text-gray-400 border border-transparent"
      } ${collapsed ? "justify-center px-0" : ""}`}
    >
      <span className="text-lg flex-shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
