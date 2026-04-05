import { NavLink } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

const baseLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/notifications", label: "Notifications" },
  { to: "/profile", label: "Profile" }
];

export default function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === "admin" ? [...baseLinks, { to: "/users", label: "Users" }] : baseLinks;

  return (
    <aside className="card h-fit self-start p-5 lg:sticky lg:top-4">
      <div className="rounded-3xl bg-slate-950 p-5 text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Navigation</p>
        <div className="mt-4 flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              end={link.to === "/"}
              key={link.to}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}
