import React, { createContext, useContext, useEffect, useState } from "react";
import { get, post } from "../api.js";
import Loader from "../components/Loader.jsx";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when the app starts
  useEffect(() => {
    async function checkUser() {
      try {
        const res = await get("/me");
        if (res?.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Auth check failed", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  const logout = async () => {
    try {
      await post("/auth/logout", {});
      setUser(null);
      window.location.href = "/login";
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {loading ? (
        // You can customize this loading screen
        <div className="h-screen w-full flex items-center justify-center bg-[#0B0E11] text-white">
          <Loader />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}