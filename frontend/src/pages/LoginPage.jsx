import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAppContext } from "../store/AppContext.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAppContext();
  const [form, setForm] = useState({ email: "admin@example.com", password: "Password123!" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(form);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1.1fr,0.9fr]">
        <div className="bg-slate-950 p-10 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-orange-300">FlowForge</p>
          <h1 className="mt-6 text-4xl font-black leading-tight">Build projects, assign work, and keep every task moving.</h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
            This starter includes JWT auth, refresh token rotation, project access control, task attachments, comments, notifications, and admin tooling.
          </p>
        </div>
        <form className="p-8 sm:p-10" onSubmit={handleSubmit}>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Welcome back</p>
          <h2 className="mt-3 text-3xl font-black text-slate-900">Sign in</h2>
          <div className="mt-8 space-y-4">
            <input
              className="input"
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="Email"
              type="email"
              value={form.email}
            />
            <input
              className="input"
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Password"
              type="password"
              value={form.password}
            />
          </div>
          <button className="btn-primary mt-6 w-full" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Login"}
          </button>
          <p className="mt-6 text-sm text-slate-500">
            Need an account?{" "}
            <Link className="font-semibold text-sky-700" to="/register">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
