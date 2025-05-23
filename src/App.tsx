import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ParentLoginPage from './pages/ParentLoginPage';
import TeacherLoginPage from './pages/TeacherLoginPage';
import ParentDashboard from './pages/ParentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentStatusDashboard from './pages/StudentStatusDashboard';
import AdminLoginPage from './pages/AdminLoginPage';

import { useAuth } from './hooks/useAuth';

function PrivateRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: 'PARENT' | 'TEACHER';
}) {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={allowedRole === 'TEACHER' ? '/teacher' : '/'} />;
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
          <Route path="/" element={<ParentLoginPage />} />
          <Route path="/teacher" element={<TeacherLoginPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />

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

          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;