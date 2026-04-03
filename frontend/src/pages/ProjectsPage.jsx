import { useEffect, useMemo, useState } from "react";

import Modal from "../components/Modal.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import { useAppContext } from "../store/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function ProjectsPage() {
  const { projects, users, loadProjects, loadUsers, createProject, updateProject, deleteProject, loading } = useAppContext();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", members: [] });

  useEffect(() => {
    loadProjects();
    if (user?.role === "admin") {
      loadUsers();
    }
  }, []);

  const filteredProjects = useMemo(
    () => projects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase())),
    [projects, search]
  );

  const openCreate = () => {
    setEditingProject(null);
    setForm({ name: "", description: "", members: [] });
    setOpen(true);
  };

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

    if (editingProject) {
      await updateProject(editingProject._id, form);
    } else {
      await createProject(form);
    }

    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <section className="card flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Projects</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">Find, filter, and manage team projects.</h2>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <input
            className="input min-w-[18rem]"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects"
            value={search}
          />
          {user?.role === "admin" ? (
            <button className="btn-primary" onClick={openCreate} type="button">
              New project
            </button>
          ) : null}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {filteredProjects.map((project) => (
          <div className="space-y-3" key={project._id}>
            <ProjectCard project={project} />
            {user?.role === "admin" ? (
              <div className="flex flex-wrap gap-3">
                <button className="btn-secondary" onClick={() => openEdit(project)} type="button">
                  Edit project
                </button>
                <button
                  className="btn-secondary border-red-200 text-red-600"
                  onClick={() => deleteProject(project._id)}
                  type="button"
                >
                  Delete project
                </button>
              </div>
            ) : null}
          </div>
        ))}
        {!filteredProjects.length ? <p className="text-sm text-slate-500">No projects match your search.</p> : null}
      </section>

      <Modal onClose={() => setOpen(false)} open={open} title={editingProject ? "Edit project" : "Create project"}>
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
            {editingProject ? "Save project" : "Create project"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
