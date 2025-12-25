import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Context & Wrappers
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Components & Layouts
import Navbar from "./components/Navbar.jsx";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import OtpVerify from "./pages/OtpVerify.jsx";
import OnboardingPhone from "./pages/OnboardingPhone.jsx";

// Protected Pages
import Pods from "./pages/Pods";
import Serverless from "./pages/Serverless";
import Storage from "./pages/Storage";
import Templates from "./pages/Templates";
import PodTemplates from "./pages/PodTemplates.jsx";
import InstantClusters from "./pages/InstantClusters.jsx";
import ServerlessRepos from "./pages/ServerlessRepos.jsx";
import PublicEndpoints from "./pages/PublicEndpoints.jsx";
import FineTuning from "./pages/FineTuning.jsx";
import Secrets from "./pages/Secrets.jsx";
import Billing from "./pages/Billing.jsx";
import Team from "./pages/Team.jsx";
import SavingsPlans from "./pages/SavingsPlans.jsx";
import AuditLogs from "./pages/AuditLogs.jsx";
import RemoteAccess from "./pages/RemoteAccess.jsx";
import Settings from "./pages/Settings.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";


// Helper component to handle the Root "/" route
function RootRoute() {
  const { user } = useAuth();
  // If user is logged in, show Dashboard Home. If not, show Landing Page.
  return user ? (
    <DashboardLayout>
      <Home />
    </DashboardLayout>
  ) : (
    <LandingPage />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
     
      
      <main className="pt-16">
         {/* <MVPpage/> */}
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/welcome" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<OtpVerify />} />
          <Route path="/onboarding/phone" element={<OnboardingPhone />} />

          {/* --- PROTECTED ROUTES --- */}
          {/* Root Path Decision */}
          <Route path="/" element={<RootRoute />} />

          {/* All other Dashboard Pages */}
          <Route path="/home" element={
            <ProtectedRoute>
              <DashboardLayout><Home /></DashboardLayout>
            </ProtectedRoute>
          } />
           <Route path="/profile" element={
            <ProtectedRoute>
              <DashboardLayout><Profile /></DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/pods" element={
            <ProtectedRoute>
              <DashboardLayout><Pods /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/serverless" element={
            <ProtectedRoute>
              <DashboardLayout><Serverless /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/storage" element={
            <ProtectedRoute>
              <DashboardLayout><Storage /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/templates" element={
            <ProtectedRoute>
              <DashboardLayout><PodTemplates /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/InstantCluster" element={
            <ProtectedRoute>
              <DashboardLayout><InstantClusters /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/repos" element={
            <ProtectedRoute>
              <DashboardLayout><ServerlessRepos /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/endpoints" element={
            <ProtectedRoute>
              <DashboardLayout><PublicEndpoints /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/tuning" element={
            <ProtectedRoute>
              <DashboardLayout><FineTuning /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/secrets" element={
            <ProtectedRoute>
              <DashboardLayout><Secrets /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/billing" element={
            <ProtectedRoute>
              <DashboardLayout><Billing /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/team" element={
            <ProtectedRoute>
              <DashboardLayout><Team /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/savings-plans" element={
            <ProtectedRoute>
              <DashboardLayout><SavingsPlans /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/audit-logs" element={
            <ProtectedRoute>
              <DashboardLayout><AuditLogs /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/remote-access" element={
            <ProtectedRoute>
              <DashboardLayout><RemoteAccess /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <DashboardLayout><Settings /></DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </AuthProvider>
  );

}
