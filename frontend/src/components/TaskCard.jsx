import { Link } from "react-router-dom";

import { formatDate, statusTone } from "../utils/formatters.js";

export default function TaskCard({ task }) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{task.projectId?.name || "Task"}</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">{task.title}</h3>
        </div>
        <span className={`badge ${statusTone[task.status] || "bg-slate-100 text-slate-700"}`}>{task.status}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{task.description || "No description provided."}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {task.assignedTo?.map((member) => (
          <span className="badge bg-slate-100 text-slate-700" key={member._id}>
            {member.name}
          </span>
        ))}
      </div>
      {task.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {task.tags.map((tag) => (
            <span
              className="badge text-white"
              key={tag._id}
              style={{ backgroundColor: tag.color || "#0f172a" }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>Due {formatDate(task.dueDate)}</span>
        <Link className="btn-secondary" to={`/tasks/${task._id}`}>
          Open
        </Link>
      </div>
    </article>
  );
}
