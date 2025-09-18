// front/src/App.tsx

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/contexts";
import {
  Login,
  Dashboard,
  CourseDetails,
  CourseForm,
  LessonForm,
  LessonView,
} from "@/pages";
import { Loader } from "@/components/atoms";
import { useAuth } from "./hooks/useAuth";
import Register from "./pages/Register";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute>
            <Register />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/new"
        element={
          <ProtectedRoute>
            <CourseForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/:id/edit"
        element={
          <ProtectedRoute>
            <CourseForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/:courseId/lessons/new"
        element={
          <ProtectedRoute>
            <LessonForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lessons/:id/edit"
        element={
          <ProtectedRoute>
            <LessonForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lessons/:id"
        element={
          <ProtectedRoute>
            <LessonView />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
