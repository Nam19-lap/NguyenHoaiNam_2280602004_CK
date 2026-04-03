import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import ActivityLog from "../../components/ActivityLog.jsx";
import AdminTaskCard from "../../components/admin/AdminTaskCard.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { useAppContext } from "../../store/AppContext.jsx";

export default function AdminDashboard() {
  const { dashboard, projects, loadDashboard, loadProjects, loadTasks, loadActivities, loading } = useAppContext();
  const [filters, setFilters] = useState({ status: "", projectId: "" });
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  const loadPage = async () => {
    const [summary, projectList, activityList, taskList] = await Promise.all([
      loadDashboard(),
      loadProjects(),
      loadActivities(),
      loadTasks({
        status: filters.status || undefined,
        projectId: filters.projectId || undefined
      })
    ]);

    setTasks(taskList);
    setActivities(activityList);
    return { summary, projectList };
  };

  useEffect(() => {
    loadPage();
  }, [filters.status, filters.projectId]);

  const stats = useMemo(
    () => [
      {
        title: "Total Projects",
        value: dashboard?.counts?.projects ?? 0,
        subLabel: `+${projects.length} visible now`
      },
      {
        title: "Total Tasks",
        value: dashboard?.counts?.tasks ?? 0,
        subLabel: `${dashboard?.counts?.todo ?? 0} todo`
      },
      {
        title: "Tasks Completed Today",
        value: dashboard?.counts?.tasksCompletedToday ?? 0,
        subLabel: `Done today`
      },
      {
        title: "Overdue Tasks",
        value: dashboard?.counts?.overdueTasks ?? 0,
        subLabel: `${dashboard?.counts?.inProgress ?? 0} in progress`
      }
    ],
    [dashboard, projects]
  );

  if (!dashboard && loading) {
    return <LoadingSpinner label="Loading admin dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg" key={stat.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{stat.title}</p>
            <p className="mt-4 text-4xl font-black text-slate-950">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-500">{stat.subLabel}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Quick filters</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Task overview</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <select className="input" onChange={(event) => setFilters({ ...filters, status: event.target.value })} value={filters.status}>
              <option value="">All status</option>
              <option value="todo">todo</option>
              <option value="in progress">in progress</option>
              <option value="done">done</option>
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
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr,0.9fr]">
        <div className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Tasks</p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">Admin task snapshot</h3>
            </div>
            <Link className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-md transition hover:shadow-lg" to="/admin/tasks">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {tasks.slice(0, 6).map((task) => (
              <AdminTaskCard key={task._id} task={task} />
            ))}
            {!tasks.length ? <p className="text-sm text-slate-500">No tasks match current filters.</p> : null}
          </div>
        </div>

        <ActivityLog items={activities.slice(0, 8)} />
      </section>
    </div>
  );
}
