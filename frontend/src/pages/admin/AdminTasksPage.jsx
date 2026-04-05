import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminTaskCard from "../../components/admin/AdminTaskCard.jsx";
import { useAppContext } from "../../store/AppContext.jsx";

export default function AdminTasksPage() {
  const { loadTasks, loadProjects, projects, deleteTask } = useAppContext();
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: "", priority: "", projectId: "" });

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    loadTasks({
      status: filters.status || undefined,
      priority: filters.priority || undefined,
      projectId: filters.projectId || undefined
    }).then(setTasks);
  }, [filters.status, filters.priority, filters.projectId]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Admin tasks</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Task management</h2>
          </div>
          <Link className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg" to="/admin/tasks/create">
            + New Task
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <select className="input" onChange={(event) => setFilters({ ...filters, status: event.target.value })} value={filters.status}>
            <option value="">All status</option>
            <option value="todo">todo</option>
            <option value="in progress">in progress</option>
            <option value="done">done</option>
          </select>
          <select className="input" onChange={(event) => setFilters({ ...filters, priority: event.target.value })} value={filters.priority}>
            <option value="">All priority</option>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <select className="input" onChange={(event) => setFilters({ ...filters, projectId: event.target.value })} value={filters.projectId}>
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        {tasks.map((task) => (
          <div className="space-y-3" key={task._id}>
            <AdminTaskCard task={task} />
            <div className="flex gap-3">
              <Link className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-md transition hover:shadow-lg" to={`/admin/tasks/${task._id}`}>
                View detail
              </Link>
              <button
                className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 shadow-md transition hover:shadow-lg"
                onClick={async () => {
                  await deleteTask(task._id);
                  const nextTasks = await loadTasks({
                    status: filters.status || undefined,
                    priority: filters.priority || undefined,
                    projectId: filters.projectId || undefined
                  });
                  setTasks(nextTasks);
                }}
                type="button"
              >
                Delete task
              </button>
            </div>
          </div>
        ))}
        {!tasks.length ? <p className="text-sm text-slate-500">No tasks found for the selected filters.</p> : null}
      </section>
    </div>
  );
}
