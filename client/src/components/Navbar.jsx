import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import Context

export default function Navbar() {
  const { user, logout } = useAuth(); // Use global state
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayName =
    user?.name || user?.email?.split("@")[0] || user?.phone || "User";

  return (
    <header className="fixed top-0 left-0 w-full z-20">
      <div className=" bg-[#8B5CF6]" />
      <nav className="w-full backdrop-blur-md bg-[#0E0F12]/90 border-b border-[#1A1D24]">
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="Koset Logo"
              className="h-10 w-10 rounded-md shadow"
            />
            <span className="text-[20px] font-semibold text-[#E5E7EB] tracking-tight">
              Koset.io
            </span>
          </Link>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 hover:bg-[#1A1D24] px-3 py-2 rounded-md transition"
              >
                <div className="h-10 w-10 rounded-full bg-[#22252B] text-[#E6E7EC] flex items-center justify-center font-semibold border border-[#2d3038]">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-[15px] font-medium text-[#E5E7EB] hidden sm:block">
                  {displayName}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-[#111317] border border-[#1A1D24] rounded-lg shadow-xl p-2">
                  {/* UID Display */}
                  <div className="px-4 py-2 border-b border-gray-800 mb-1">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">User ID</p>
                    <p className="text-[12px] text-violet-400 font-mono select-all">UID: {user?.uid}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-[#E6E7EC] hover:bg-[#1C1F26] rounded-md transition"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm text-[#9CA3AF] hover:text-[#E6E7EC] transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 text-sm rounded-md bg-[#22252B] text-[#E6E7EC] border border-[#2d3038] hover:bg-[#1C1F26] transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
