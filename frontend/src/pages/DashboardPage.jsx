import { useEffect } from "react";
import { Link } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner.jsx";
import TaskCard from "../components/TaskCard.jsx";
import { useAppContext } from "../store/AppContext.jsx";

export default function DashboardPage() {
  const { dashboard, loadDashboard, loading, auth } = useAppContext();

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!dashboard && loading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  const cards = [
    { label: "Projects", value: dashboard?.counts?.projects ?? 0, tone: "bg-slate-950 text-white" },
    { label: "Tasks", value: dashboard?.counts?.tasks ?? 0, tone: "bg-white text-slate-900" },
    { label: "Todo", value: dashboard?.counts?.todo ?? 0, tone: "bg-orange-100 text-orange-700" },
    { label: "In Progress", value: dashboard?.counts?.inProgress ?? 0, tone: "bg-sky-100 text-sky-700" },
    { label: "Done", value: dashboard?.counts?.done ?? 0, tone: "bg-emerald-100 text-emerald-700" }
  ];

  return (
    <div className="space-y-6">
      <section className="card overflow-hidden">
        <div className="grid gap-8 bg-slate-950 px-6 py-8 text-white lg:grid-cols-[1.2fr,0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-orange-300">Dashboard</p>
            <h2 className="mt-4 text-3xl font-black">Hello {auth.user?.name}, here is the latest team pulse.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Track active work, jump into assigned tasks, and keep projects on schedule from a single workspace.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20" to="/projects">
              Open projects
            </Link>
            <Link className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20" to="/notifications">
              Review notifications
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <article className={`card p-5 ${card.tone}`} key={card.label}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-70">{card.label}</p>
            <p className="mt-4 text-4xl font-black">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">My tasks</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Assigned to me</h3>
            </div>
            <Link className="btn-secondary" to="/projects">
              Browse all
            </Link>
          </div>
          <div className="space-y-4">
            {dashboard?.myTasks?.length ? (
              dashboard.myTasks.map((task) => <TaskCard key={task._id} task={task} />)
            ) : (
              <p className="text-sm text-slate-500">No assigned tasks yet.</p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Recent activity</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">Latest tasks across accessible projects</h3>
          <div className="mt-5 space-y-4">
            {dashboard?.recentTasks?.length ? (
              dashboard.recentTasks.map((task) => (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4" key={task._id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{task.projectId?.name}</p>
                      <h4 className="mt-1 font-semibold text-slate-900">{task.title}</h4>
                    </div>
                    <Link className="btn-secondary" to={`/tasks/${task._id}`}>
                      Open
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No recent activity yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
