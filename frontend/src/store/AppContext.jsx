import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { authService } from "../services/authService";
import { authStorage } from "../services/authStorage";
import { dashboardService } from "../services/dashboardService";
import { projectService } from "../services/projectService";
import { taskService } from "../services/taskService";
import { commentService } from "../services/commentService";
import { notificationService } from "../services/notificationService";
import { activityService } from "../services/activityService";
import { userService } from "../services/userService";
import { tagService } from "../services/tagService";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [auth, setAuth] = useState({
    user: authStorage.getUser(),
    accessToken: authStorage.getAccessToken(),
    refreshToken: authStorage.getRefreshToken()
  });
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState({ items: [], unreadCount: 0 });
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    window.clearTimeout(window.__taskManagerAlertTimer);
    window.__taskManagerAlertTimer = window.setTimeout(() => setAlert(null), 3000);
  };

  const setSession = (session) => {
    authStorage.setSession(session);
    setAuth(session);
  };

  const clearSession = () => {
    authStorage.clear();
    setAuth({ user: null, accessToken: null, refreshToken: null });
    setProjects([]);
    setNotifications({ items: [], unreadCount: 0 });
    setUsers([]);
    setTags([]);
    setDashboard(null);
  };

  const guarded = async (callback, options = { silent: false }) => {
    try {
      setLoading(true);
      return await callback();
    } catch (error) {
      if (!options.silent) {
        showAlert("error", error.response?.data?.message || error.message || "Something went wrong.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = (payload) =>
    guarded(async () => {
      const session = await authService.login(payload);
      setSession(session);
      showAlert("success", "Signed in successfully.");
      return session;
    });

  const register = (payload) =>
    guarded(async () => {
      const session = await authService.register(payload);
      setSession(session);
      showAlert("success", "Account created successfully.");
      return session;
    });

  const logout = () =>
    guarded(async () => {
      await authService.logout(auth.refreshToken);
      clearSession();
    }, { silent: true });

  const refreshProfile = () =>
    guarded(async () => {
      const user = await authService.me();
      setSession({ ...auth, user });
      return user;
    }, { silent: true });

  const updateProfile = (payload) =>
    guarded(async () => {
      const user = await authService.updateProfile(payload);
      setSession({ ...auth, user });
      showAlert("success", "Profile updated.");
      return user;
    });

  const changePassword = (payload) =>
    guarded(async () => {
      await authService.changePassword(payload);
      clearSession();
      showAlert("success", "Password updated. Please sign in again.");
    });

  const loadProjects = (search = "") =>
    guarded(async () => {
      const items = await projectService.list(search);
      setProjects(items);
      return items;
    }, { silent: true });

  const loadProject = (id) => guarded(async () => projectService.getById(id), { silent: true });
  const createProject = (payload) =>
    guarded(async () => {
      const project = await projectService.create(payload);
      await loadProjects();
      showAlert("success", "Project created.");
      return project;
    });
  const updateProject = (id, payload) =>
    guarded(async () => {
      const project = await projectService.update(id, payload);
      await loadProjects();
      showAlert("success", "Project updated.");
      return project;
    });
  const deleteProject = (id) =>
    guarded(async () => {
      await projectService.remove(id);
      await loadProjects();
      showAlert("success", "Project removed.");
    });

  const loadTask = (id) => guarded(async () => taskService.getById(id), { silent: true });
  const loadTasks = (params) => guarded(async () => taskService.list(params), { silent: true });
  const exportTasksCsv = (params) =>
    guarded(async () => {
      const blob = await taskService.exportCsv(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "tasks-export.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showAlert("success", "CSV exported.");
    });
  const createTask = (payload) =>
    guarded(async () => {
      const task = await taskService.create(payload);
      showAlert("success", "Task created.");
      return task;
    });
  const updateTask = (id, payload) =>
    guarded(async () => {
      const task = await taskService.update(id, payload);
      showAlert("success", "Task updated.");
      return task;
    });
  const deleteTask = (id) =>
    guarded(async () => {
      await taskService.remove(id);
      showAlert("success", "Task removed.");
    });

  const loadComments = (taskId) => guarded(async () => commentService.listByTask(taskId), { silent: true });
  const createComment = (payload) =>
    guarded(async () => {
      const comment = await commentService.create(payload);
      showAlert("success", "Comment added.");
      return comment;
    });
  const updateComment = (id, payload) =>
    guarded(async () => {
      const comment = await commentService.update(id, payload);
      showAlert("success", "Comment updated.");
      return comment;
    });
  const deleteComment = (id) =>
    guarded(async () => {
      await commentService.remove(id);
      showAlert("success", "Comment removed.");
    });

  const loadNotifications = () =>
    guarded(async () => {
      const nextNotifications = await notificationService.list();
      setNotifications(nextNotifications);
      return nextNotifications;
    }, { silent: true });

  const markNotificationRead = (id, read = true) =>
    guarded(async () => {
      await (read ? notificationService.markRead(id) : notificationService.markUnread(id));
      return loadNotifications();
    }, { silent: true });

  const markAllNotificationsRead = () =>
    guarded(async () => {
      await notificationService.markAllRead();
      await loadNotifications();
    });

  const loadUsers = () =>
    guarded(async () => {
      const items = await userService.list();
      setUsers(items);
      return items;
    }, { silent: true });

  const loadTags = () =>
    guarded(async () => {
      const items = await tagService.list();
      setTags(items);
      return items;
    }, { silent: true });

  const createTag = (payload) =>
    guarded(async () => {
      const tag = await tagService.create(payload);
      await loadTags();
      showAlert("success", "Tag created.");
      return tag;
    });

  const loadActivities = (params) => guarded(async () => activityService.list(params), { silent: true });

  const saveUser = (id, payload) =>
    guarded(async () => {
      const user = await userService.update(id, payload);
      await loadUsers();
      showAlert("success", "User updated.");
      return user;
    });

  const removeUser = (id) =>
    guarded(async () => {
      await userService.remove(id);
      await loadUsers();
      showAlert("success", "User removed.");
    });

  const loadDashboard = () =>
    guarded(async () => {
      const summary = await dashboardService.getSummary();
      setDashboard(summary);
      return summary;
    }, { silent: true });

  useEffect(() => {
    if (!auth.accessToken || !auth.refreshToken) {
      return;
    }

    refreshProfile()
      .then(() => Promise.all([loadNotifications(), loadProjects(), loadDashboard(), loadTags()]))
      .catch(() => clearSession());
  }, []);

  const value = useMemo(
    () => ({
      auth,
      projects,
      notifications,
      users,
      tags,
      dashboard,
      loading,
      alert,
      setAlert,
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
      changePassword,
      loadProjects,
      loadProject,
      createProject,
      updateProject,
      deleteProject,
      loadTasks,
      exportTasksCsv,
      loadTask,
      createTask,
      updateTask,
      deleteTask,
      loadComments,
      createComment,
      updateComment,
      deleteComment,
      loadNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      loadUsers,
      loadTags,
      createTag,
      loadActivities,
      saveUser,
      removeUser,
      loadDashboard,
      showAlert
    }),
    [auth, projects, notifications, users, tags, dashboard, loading, alert]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);
