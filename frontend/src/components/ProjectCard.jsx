import { Link } from "react-router-dom";

export default function ProjectCard({ project, actionLabel = "View", actionTo, onAction }) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Project</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">{project.name}</h3>
        </div>
        <span className="badge bg-orange-100 text-orange-700">{project.members?.length || 0} members</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{project.description || "No description provided yet."}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {project.members?.slice(0, 3).map((member) => (
            <span className="badge bg-slate-100 text-slate-700" key={member._id}>
              {member.name}
            </span>
          ))}
        </div>
        {onAction ? (
          <button className="btn-secondary" onClick={() => onAction(project)} type="button">
            {actionLabel}
          </button>
        ) : (
          <Link className="btn-secondary" to={actionTo || `/projects/${project._id}`}>
            {actionLabel}
          </Link>
        )}
      </div>
    </article>
  );
}
