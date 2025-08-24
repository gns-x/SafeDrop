import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UnifiedLoginPage from "./pages/UnifiedLoginPage";
import ParentDashboard from "./pages/ParentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentStatusDashboard from "./pages/StudentStatusDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import { useAuth } from "./hooks/useAuth";

function PrivateRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: "PARENT" | "TEACHER" | "ADMIN";
}) {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (userRole && userRole !== allowedRole) {
    return <Navigate to={`/${userRole.toLowerCase()}/dashboard`} />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<UnifiedLoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/parent/dashboard"
            element={
              <PrivateRoute allowedRole="PARENT">
                <ParentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/superparent/dashboard"
            element={
              <PrivateRoute allowedRole="PARENT">
                <StudentStatusDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/dashboard"
            element={
              <PrivateRoute allowedRole="TEACHER">
                <TeacherDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRole="ADMIN">
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
