import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentTasks from "./pages/student/StudentTasks";
import StudentSubmissions from "./pages/student/StudentSubmissions";

// Mentor Pages
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MyGroups from "./pages/mentor/MyGroups";
import Notices from "./pages/mentor/Notices";
import AssignTask from "./pages/mentor/AssignTask";
import Analytics from "./pages/mentor/Analytics";
import MentorGroupChat from "./pages/mentor/MentorGroupChat";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Shared Pages
import GroupDetail from "./pages/group/GroupDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/tasks"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentTasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/submissions"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentSubmissions />
          </ProtectedRoute>
        }
      />

      {/* Mentor Routes */}
      <Route
        path="/mentor/dashboard"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <MentorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/groups"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <MyGroups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/notices"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <Notices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/tasks/assign"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <AssignTask />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/analytics"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/chat"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <MentorGroupChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/groups/create"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <MyGroups />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Shared Routes */}
      <Route
        path="/group/:id"
        element={
          <ProtectedRoute allowedRoles={["student", "mentor", "admin"]}>
            <GroupDetail />
          </ProtectedRoute>
        }
      />

      {/* Default Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
