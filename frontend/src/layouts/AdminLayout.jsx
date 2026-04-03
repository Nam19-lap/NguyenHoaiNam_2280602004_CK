import { Outlet } from "react-router-dom";

import AlertMessage from "../components/AlertMessage.jsx";
import AdminHeader from "../components/admin/AdminHeader.jsx";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import { useAppContext } from "../store/AppContext.jsx";

export default function AdminLayout() {
  const { alert, setAlert } = useAppContext();

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6">
      <AdminHeader />
      <div className="mt-6 grid gap-6 lg:grid-cols-[280px,1fr]">
        <AdminSidebar />
        <main className="space-y-6">
          <AlertMessage alert={alert} onClose={() => setAlert(null)} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
