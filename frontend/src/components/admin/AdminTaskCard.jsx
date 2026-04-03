import { formatDate } from "../../utils/formatters.js";

const priorityTone = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-sky-100 text-sky-700",
  high: "bg-orange-100 text-orange-700"
};

const statusTone = {
  todo: "bg-slate-200 text-slate-700",
  "in progress": "bg-sky-100 text-sky-700",
  done: "bg-emerald-100 text-emerald-700"
};

export default function AdminTaskCard({ task }) {
  const isOverdue = task.status !== "done" && task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <article className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{task.projectId?.name || "Task"}</p>
          <h4 className="mt-2 text-lg font-bold text-slate-900">{task.title}</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[task.status] || "bg-slate-100 text-slate-700"}`}>
            {task.status}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityTone[task.priority] || "bg-slate-100 text-slate-700"}`}>
            {task.priority || "medium"}
          </span>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p className={isOverdue ? "font-semibold text-red-600" : ""}>Deadline: {formatDate(task.dueDate)}</p>
        <p>Assigned: {task.assignedTo?.map((user) => user.name).join(", ") || "Unassigned"}</p>
      </div>
    </article>
  );
}
