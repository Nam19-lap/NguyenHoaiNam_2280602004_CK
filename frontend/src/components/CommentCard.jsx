import { formatDate } from "../utils/formatters.js";
import { resolveMediaUrl } from "../utils/media.js";

const reactionOptions = ["👍", "❤️", "🎉", "👀"];

const renderCommentContent = (comment) => {
  const mentionNames = new Set((comment.mentions || []).map((user) => `@${user.name}`));

  return comment.content.split(/(\s+)/).map((part, index) => {
    if (mentionNames.has(part)) {
      return (
        <span className="rounded-lg bg-sky-100 px-2 py-0.5 font-semibold text-sky-700" key={`${part}-${index}`}>
          {part}
        </span>
      );
    }

    return part;
  });
};

export default function CommentCard({ comment, currentUserId, onToggleReaction }) {
  const reactionSummary = reactionOptions.map((emoji) => ({
    emoji,
    users: (comment.reactions || []).filter((reaction) => reaction.emoji === emoji)
  }));

  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {comment.userId?.avatar ? (
            <img alt={comment.userId?.name} className="h-10 w-10 rounded-2xl object-cover" src={resolveMediaUrl(comment.userId.avatar)} />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-black text-white">
              {(comment.userId?.name || "U").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <h4 className="font-semibold text-slate-900">{comment.userId?.name}</h4>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{comment.userId?.role}</p>
          </div>
        </div>
        <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-1 text-sm leading-6 text-slate-600">{renderCommentContent(comment)}</p>
      {comment.files?.length ? (
        <div className="mt-3 flex flex-col gap-2">
          {comment.files.map((file) => (
            <a
              key={file.fileName}
              className="text-sm font-medium text-sky-700 underline"
              href={resolveMediaUrl(file.url)}
              rel="noreferrer"
              target="_blank"
            >
              {file.originalName}
            </a>
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {reactionSummary.map(({ emoji, users }) => {
          const reacted = users.some((reaction) => reaction.userId?._id === currentUserId);

          return (
            <button
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                reacted
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
              key={emoji}
              onClick={() => onToggleReaction?.(comment._id, emoji)}
              type="button"
            >
              {emoji} {users.length || ""}
            </button>
          );
        })}
      </div>
    </article>
  );
}
