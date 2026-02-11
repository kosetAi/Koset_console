import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
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
    <header className="fixed top-0 left-0 w-full z-100 transition-all duration-300">
      {/* THEME UPDATE: 
          Using bg-[#09090B]/90 for deep black with high transparency.
          Added border-white/5 for that razor-thin modern look.
      */}
      <nav className="w-full backdrop-blur-xl bg-[#09090B]/90 border-b border-white/5">
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
               <img
                src="/logo.jpeg"
                alt="Koset Logo"
                className="h-9 w-9 rounded-lg shadow-2xl border border-white/10 group-hover:border-violet-500/50 transition-all"
              />
              <div className="absolute inset-0 rounded-lg bg-violet-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-[18px] font-bold text-white tracking-tight group-hover:text-violet-400 transition-colors">
              Koset<span className="text-violet-500">.</span>io
            </span>
          </Link>

          {/* Profile Section (Only visible when logged in) */}
          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center gap-3 px-2 py-1.5 rounded-xl transition-all duration-200 border ${
                  menuOpen ? "bg-white/10 border-white/10" : "bg-transparent border-transparent hover:bg-white/5"
                }`}
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={displayName}
                    className="h-8 w-8 rounded-full border border-white/20 object-cover shadow-inner"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 text-white flex items-center justify-center text-xs font-bold border border-white/10">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-200 hidden sm:block">
                  {displayName}
                </span>
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#121217] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 animate-in fade-in zoom-in slide-in-from-top-2 duration-200">
                  {/* User Info Header */}
                  <div className="px-4 py-4 border-b border-white/5 mb-1 bg-white/[0.02] rounded-t-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.1em]">Identity</p>
                    <p className="text-xs text-violet-400 font-mono mt-1 break-all bg-violet-500/5 px-2 py-1 rounded border border-violet-500/10">
                      {user?.uid}
                    </p>
                  </div>
                  
                  <div className="p-1 space-y-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                    >
                      <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-violet-500/20 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      Profile
                    </Link>
                    
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all group"
                    >
                      <div className="p-1.5 rounded-lg bg-red-500/5 group-hover:bg-red-500/20 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}