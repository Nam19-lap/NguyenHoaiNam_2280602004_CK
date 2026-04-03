import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAppContext } from "../store/AppContext.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAppContext();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await register(form);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card w-full max-w-xl p-8 sm:p-10">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Get started</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Create your account</h1>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            className="input"
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Full name"
            value={form.name}
          />
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
          <button className="btn-primary w-full" disabled={loading} type="submit">
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-500">
          Already have an account?{" "}
          <Link className="font-semibold text-sky-700" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
