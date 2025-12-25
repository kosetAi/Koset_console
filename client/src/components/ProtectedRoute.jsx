import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // If not logged in, redirect to Landing Page (or Login)
    // Note: We redirect to landing page "/" where we handle the toggle
    return <Navigate to="/welcome" replace />;
  }

  return children;
}