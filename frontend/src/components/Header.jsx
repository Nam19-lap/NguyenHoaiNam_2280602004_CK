import { Link } from "react-router-dom";

import { useAppContext } from "../store/AppContext.jsx";

export default function Header() {
  const { auth, notifications, logout } = useAppContext();

  return (
    <header className="card sticky top-4 z-30 mb-6 flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">FlowForge workspace</p>
        <h1 className="text-2xl font-black text-slate-900">Project Task Management System</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link className="btn-secondary" to="/notifications">
          Notifications ({notifications.unreadCount})
        </Link>
        <div className="flex items-center gap-3 rounded-2xl bg-slate-950 px-4 py-2 text-sm text-white">
          {auth.user?.avatar ? (
            <img alt="User avatar" className="h-10 w-10 rounded-xl object-cover" src={auth.user.avatar} />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 font-black text-white">
              {(auth.user?.name || "U").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold">{auth.user?.name}</p>
            <p className="text-xs uppercase text-slate-300">{auth.user?.role}</p>
          </div>
        </div>
        <button className="btn-primary" onClick={logout} type="button">
          Logout
        </button>
      </div>
    </header>
  );
}
