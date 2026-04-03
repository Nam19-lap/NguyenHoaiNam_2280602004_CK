import { useState } from "react";

export default function AdminProjectForm({ users = [], onSubmit, loading = false }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    members: []
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm({ name: "", description: "", members: [] });
  };

  return (
    <form className="space-y-4 rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg" onSubmit={handleSubmit}>
      <input className="input" onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Project name" value={form.name} />
      <textarea className="input min-h-28" onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Project description" value={form.description} />
      <select
        className="input min-h-36"
        multiple
        onChange={(event) => setForm({ ...form, members: Array.from(event.target.selectedOptions).map((option) => option.value) })}
        value={form.members}
      >
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.role})
          </option>
        ))}
      </select>
      <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-60" disabled={loading} type="submit">
        Create Project
      </button>
    </form>
  );
}
