import { Outlet } from "react-router-dom";

import AlertMessage from "../components/AlertMessage.jsx";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useAppContext } from "../store/AppContext.jsx";

export default function AppLayout() {
  const { alert, setAlert } = useAppContext();

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6">
      <Header />
      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <Sidebar />
        <main className="space-y-6">
          <AlertMessage alert={alert} onClose={() => setAlert(null)} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
