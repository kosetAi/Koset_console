import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Context & Wrappers
import { AuthProvider } from "./context/AuthContext";
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

export default function App() {
  // Global state to sync Sidebar and Navbar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <AuthProvider>
      {/* Pass toggle function to Navbar */}
      <Navbar onMenuClick={toggleSidebar} />
      
      <main className="">
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/welcome" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<OtpVerify />} />
          <Route path="/onboarding/phone" element={<OnboardingPhone />} />

          {/* --- PROTECTED ROUTES --- */}
          {[
            { path: "/", Component: Home },
            { path: "/home", Component: Home },
            { path: "/profile", Component: Profile },
            { path: "/pods", Component: Pods },
            { path: "/serverless", Component: Serverless },
            { path: "/storage", Component: Storage },
            { path: "/templates", Component: PodTemplates },
            { path: "/InstantCluster", Component: InstantClusters },
            { path: "/repos", Component: ServerlessRepos },
            { path: "/endpoints", Component: PublicEndpoints },
            { path: "/tuning", Component: FineTuning },
            { path: "/secrets", Component: Secrets },
            { path: "/billing", Component: Billing },
            { path: "/team", Component: Team },
            { path: "/savings-plans", Component: SavingsPlans },
            { path: "/audit-logs", Component: AuditLogs },
            { path: "/remote-access", Component: RemoteAccess },
            { path: "/settings", Component: Settings },
          ].map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute>
                  <DashboardLayout 
                    sidebarCollapsed={sidebarCollapsed} 
                    setSidebarCollapsed={setSidebarCollapsed}
                  >
                    <Component />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
          ))}
        </Routes>
      </main>
    </AuthProvider>
  );
}