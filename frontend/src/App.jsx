import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProjectCreatePage from "./pages/admin/AdminProjectCreatePage.jsx";
import AdminProjectsPage from "./pages/admin/AdminProjectsPage.jsx";
import AdminTaskCreatePage from "./pages/admin/AdminTaskCreatePage.jsx";
import AdminTasksPage from "./pages/admin/AdminTasksPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import TaskDetailPage from "./pages/TaskDetailPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import { useAuth } from "./hooks/useAuth.js";

function App() {
  const { isAuthenticated, user } = useAuth();
  const defaultHome = user?.role === "admin" ? "/admin" : "/";

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate replace to={defaultHome} /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate replace to={defaultHome} /> : <RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/projects" element={<AdminProjectsPage />} />
          <Route path="/admin/projects/create" element={<AdminProjectCreatePage />} />
          <Route path="/admin/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/admin/tasks" element={<AdminTasksPage />} />
          <Route path="/admin/tasks/create" element={<AdminTaskCreatePage />} />
          <Route path="/admin/tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate replace to={isAuthenticated ? defaultHome : "/login"} />} />
    </Routes>
  );
}

export default App;
