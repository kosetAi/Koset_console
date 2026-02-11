// src/layouts/DashboardLayout.jsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#09090B]">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main
        className={`
          flex-1 text-gray-200
          h-screen overflow-y-auto
          p- transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "ml-16" : "ml-64"}
        `}
      >
        <div className="max-w-7xl mx-auto pt-16"> 
          {children}
        </div>
      </main>
    </div>
  );
}