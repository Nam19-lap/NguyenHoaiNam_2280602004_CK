import { formatDate } from "../utils/formatters.js";

export default function ActivityLog({ items = [] }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Activity log</p>
        <h3 className="mt-2 text-xl font-bold text-slate-900">Latest admin activity</h3>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" key={item._id}>
            <p className="text-sm font-semibold text-slate-900">{item.message}</p>
            <p className="mt-1 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
          </div>
        ))}
        {!items.length ? <p className="text-sm text-slate-500">No activity found yet.</p> : null}
      </div>
    </div>
  );
}
