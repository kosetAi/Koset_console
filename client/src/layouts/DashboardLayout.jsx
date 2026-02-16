import React from "react";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children, sidebarCollapsed, setSidebarCollapsed }) {
  return (
    <div className="flex min-h-screen bg-[#09090B]">
      {/* Sidebar logic remains unchanged */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main
        className={`
          flex-1 text-gray-200
          min-h-screen overflow-y-auto
          transition-all duration-300 ease-in-out
          /* 1. FLEX CENTER: This forces the content to center horizontally */
          flex flex-col items-center 
          
          /* 2. RESPONSIVE MARGIN: 
             On Mobile/Tablet: No left margin (ml-0)
             On Desktop (lg): Space for the sidebar (ml-16 or ml-64) 
          */
          ml-0
          ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}
        `}
      >
        {/* 3. INNER CONTAINER:
          - 'w-full' ensures it doesn't shrink too much.
          - 'max-w-7xl' keeps it elegant on wide screens.
          - 'px-4' or 'px-6' prevents content from hitting the screen edges on mobile.
        */}
        <div className="w-full max-w-7xl pt-20 pb-10 px-4 sm:px-6 lg:px-10"> 
          {children}
        </div>
      </main>
    </div>
  );
}