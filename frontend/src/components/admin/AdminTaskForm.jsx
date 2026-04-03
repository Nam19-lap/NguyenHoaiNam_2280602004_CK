import { useState } from "react";

export default function AdminTaskForm({ projects = [], users = [], tags = [], onSubmit, loading = false }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: [],
    tags: [],
    status: "todo",
    priority: "medium",
    dueDate: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm({
      title: "",
      description: "",
      projectId: "",
      assignedTo: [],
      tags: [],
      status: "todo",
      priority: "medium",
      dueDate: ""
    });
  };

  return (
    <form className="space-y-4 rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg" onSubmit={handleSubmit}>
      <input className="input" onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Task title" value={form.title} />
      <textarea className="input min-h-28" onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Task description" value={form.description} />
      <select className="input" onChange={(event) => setForm({ ...form, projectId: event.target.value })} value={form.projectId}>
        <option value="">Select project</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.name}
          </option>
        ))}
      </select>
      <div className="grid gap-4 md:grid-cols-2">
        <select className="input" onChange={(event) => setForm({ ...form, status: event.target.value })} value={form.status}>
          <option value="todo">todo</option>
          <option value="in progress">in progress</option>
          <option value="done">done</option>
        </select>
        <select className="input" onChange={(event) => setForm({ ...form, priority: event.target.value })} value={form.priority}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </div>
      <input className="input" onChange={(event) => setForm({ ...form, dueDate: event.target.value })} type="date" value={form.dueDate} />
      <select
        className="input min-h-28"
        multiple
        onChange={(event) => setForm({ ...form, assignedTo: Array.from(event.target.selectedOptions).map((option) => option.value) })}
        value={form.assignedTo}
      >
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
      <select
        className="input min-h-28"
        multiple
        onChange={(event) => setForm({ ...form, tags: Array.from(event.target.selectedOptions).map((option) => option.value) })}
        value={form.tags}
      >
        {tags.map((tag) => (
          <option key={tag._id} value={tag._id}>
            {tag.name}
          </option>
        ))}
      </select>
      <button className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-60" disabled={loading} type="submit">
        Create Task
      </button>
    </form>
  );
}
