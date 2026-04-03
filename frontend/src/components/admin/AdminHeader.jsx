import { Link, useNavigate } from "react-router-dom";

import { useAppContext } from "../../store/AppContext.jsx";

export default function AdminHeader() {
  const navigate = useNavigate();
  const { auth, notifications, logout } = useAppContext();

  return (
    <header className="rounded-xl bg-white px-5 py-4 shadow-md transition hover:shadow-lg">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Admin workspace</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950">Management Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg" onClick={() => navigate("/admin/projects/create")} type="button">
            + New Project
          </button>
          <button className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg" onClick={() => navigate("/admin/tasks/create")} type="button">
            + New Task
          </button>
          <Link className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-md transition hover:shadow-lg" to="/notifications">
            Notifications ({notifications.unreadCount})
          </Link>
          <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-2 text-sm">
            {auth.user?.avatar ? (
              <img alt="Admin avatar" className="h-10 w-10 rounded-xl object-cover" src={auth.user.avatar} />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-black text-white">
                {(auth.user?.name || "A").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-900">{auth.user?.name}</p>
              <p className="text-xs uppercase text-slate-500">{auth.user?.role}</p>
            </div>
          </div>
          <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-md transition hover:shadow-lg" onClick={logout} type="button">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
