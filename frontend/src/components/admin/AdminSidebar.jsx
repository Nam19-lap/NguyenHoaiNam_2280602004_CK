import { NavLink } from "react-router-dom";

const adminLinks = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/tasks", label: "Tasks" },
  { to: "/admin/users", label: "Users" }
];

export default function AdminSidebar() {
  return (
    <aside className="rounded-xl bg-slate-950 p-5 text-white shadow-md transition hover:shadow-lg lg:sticky lg:top-4">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Admin menu</p>
      <div className="mt-4 flex flex-col gap-2">
        {adminLinks.map((link) => (
          <NavLink
            key={link.to}
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive ? "bg-white text-slate-950 shadow-md" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
            to={link.to}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
