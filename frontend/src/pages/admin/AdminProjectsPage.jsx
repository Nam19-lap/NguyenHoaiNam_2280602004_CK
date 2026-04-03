import { useEffect } from "react";
import { Link } from "react-router-dom";

import ProjectCard from "../../components/ProjectCard.jsx";
import { useAppContext } from "../../store/AppContext.jsx";

export default function AdminProjectsPage() {
  const { projects, loadProjects, deleteProject } = useAppContext();

  useEffect(() => {
    loadProjects();
  }, []);

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
            <ProjectCard project={project} />
            <div className="flex gap-3">
              <Link className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-md transition hover:shadow-lg" to={`/projects/${project._id}`}>
                View detail
              </Link>
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
    </div>
  );
}
