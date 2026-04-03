import { formatDate } from "../utils/formatters.js";

export default function CommentCard({ comment }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="font-semibold text-slate-900">{comment.userId?.name}</h4>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{comment.userId?.role}</p>
        </div>
        <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{comment.content}</p>
      {comment.files?.length ? (
        <div className="mt-3 flex flex-col gap-2">
          {comment.files.map((file) => (
            <a
              key={file.fileName}
              className="text-sm font-medium text-sky-700 underline"
              href={`${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"}${file.url}`}
              rel="noreferrer"
              target="_blank"
            >
              {file.originalName}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
