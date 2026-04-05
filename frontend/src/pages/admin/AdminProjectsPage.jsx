import { useEffect } from "react";
import { Link } from "react-router-dom";

import Modal from "../../components/Modal.jsx";
import ProjectCard from "../../components/ProjectCard.jsx";
import { useAppContext } from "../../store/AppContext.jsx";
import { useState } from "react";

export default function AdminProjectsPage() {
  const { projects, users, loadProjects, loadUsers, updateProject, deleteProject, loading } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", members: [] });

  useEffect(() => {
    loadProjects();
    loadUsers();
  }, []);

  const openEdit = (project) => {
    setEditingProject(project);
    setForm({
      name: project.name,
      description: project.description,
      members: project.members?.map((member) => member._id) || []
    });
    setOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await updateProject(editingProject._id, form);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Admin projects</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">All projects</h2>
          </div>
          <Link className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg" to="/admin/projects/create">
            + New Project
          </Link>
        </div>
      </section>
      <section className="grid gap-5 xl:grid-cols-2">
        {projects.map((project) => (
          <div className="space-y-3" key={project._id}>
            <ProjectCard actionLabel="View" actionTo={`/admin/projects/${project._id}`} project={project} />
            <div className="flex gap-3">
              <button
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-md transition hover:shadow-lg"
                onClick={() => openEdit(project)}
                type="button"
              >
                Edit project
              </button>
              <button
                className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 shadow-md transition hover:shadow-lg"
                onClick={() => deleteProject(project._id)}
                type="button"
              >
                Delete project
              </button>
            </div>
          </div>
        ))}
      </section>

      <Modal onClose={() => setOpen(false)} open={open} title="Edit project">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="input"
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Project name"
            value={form.name}
          />
          <textarea
            className="input min-h-28"
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Description"
            value={form.description}
          />
          <select
            className="input min-h-36"
            multiple
            onChange={(event) =>
              setForm({ ...form, members: Array.from(event.target.selectedOptions).map((option) => option.value) })
            }
            value={form.members}
          >
            {users.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name} ({member.role})
              </option>
            ))}
          </select>
          <button className="btn-primary" disabled={loading} type="submit">
            Save project
          </button>
        </form>
      </Modal>
    </div>
  );
}
