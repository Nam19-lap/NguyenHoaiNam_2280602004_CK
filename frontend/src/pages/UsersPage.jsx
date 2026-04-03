import { useEffect, useState } from "react";

import { useAppContext } from "../store/AppContext.jsx";
import { roleTone } from "../utils/formatters.js";

export default function UsersPage() {
  const { users, loadUsers, saveUser, removeUser } = useAppContext();
  const [editingUserId, setEditingUserId] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    loadUsers();
  }, []);

  const startEditing = (user) => {
    setEditingUserId(user._id);
    setForm({ name: user.name, email: user.email, role: user.role, avatar: user.avatar || "" });
  };

  const submit = async (event) => {
    event.preventDefault();
    await saveUser(editingUserId, form);
    setEditingUserId(null);
  };

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">User management</h2>
      </section>

      <section className="grid gap-4">
        {users.map((user) => (
          <article className="card p-5" key={user._id}>
            {editingUserId === user._id ? (
              <form className="space-y-4" onSubmit={submit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="input" onChange={(event) => setForm({ ...form, name: event.target.value })} value={form.name || ""} />
                  <input className="input" onChange={(event) => setForm({ ...form, email: event.target.value })} value={form.email || ""} />
                </div>
                <select className="input" onChange={(event) => setForm({ ...form, role: event.target.value })} value={form.role || "user"}>
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                </select>
                <div className="flex gap-3">
                  <button className="btn-primary" type="submit">
                    Save
                  </button>
                  <button className="btn-secondary" onClick={() => setEditingUserId(null)} type="button">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`badge ${roleTone[user.role] || "bg-slate-100 text-slate-700"}`}>{user.role}</span>
                  <button className="btn-secondary" onClick={() => startEditing(user)} type="button">
                    Edit
                  </button>
                  <button className="btn-secondary border-red-200 text-red-600" onClick={() => removeUser(user._id)} type="button">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
