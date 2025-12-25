import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content */}
     <main
  className={`
    bg-[#111315] text-gray-100
    w-full
    h-[calc(100vh-4rem)]
    overflow-y-auto
    overscroll-contain
    p-6
    transition-all duration-300
    ${sidebarCollapsed ? "ml-16" : "ml-64"}
  `}
>

        {children}
      </main>
    </div>
  );
}
