import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CommentCard from "../components/CommentCard.jsx";
import { useAppContext } from "../store/AppContext.jsx";
import { formatDate, statusTone } from "../utils/formatters.js";

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const { loadTask, updateTask, loadComments, createComment } = useAppContext();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ content: "", files: [] });

  const refresh = async () => {
    const [taskData, commentData] = await Promise.all([loadTask(taskId), loadComments(taskId)]);
    setTask(taskData);
    setComments(commentData);
  };

  useEffect(() => {
    refresh();
  }, [taskId]);

  const handleStatusChange = async (status) => {
    await updateTask(taskId, { status });
    await refresh();
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    await createComment({
      taskId,
      content: commentForm.content,
      files: commentForm.files
    });
    setCommentForm({ content: "", files: [] });
    await refresh();
  };

  if (!task) {
    return <p className="text-sm text-slate-500">Loading task...</p>;
  }

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{task.projectId?.name}</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">{task.title}</h2>
          </div>
          <span className={`badge ${statusTone[task.status] || "bg-slate-100 text-slate-700"}`}>{task.status}</span>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-600">{task.description}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Due date</p>
            <p className="mt-2 font-semibold text-slate-900">{formatDate(task.dueDate)}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Assignees</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {task.assignedTo?.map((member) => (
                <span className="badge bg-slate-200 text-slate-700" key={member._id}>
                  {member.name}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Priority</p>
            <p className="mt-2 font-semibold text-slate-900">{task.priority || "medium"}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 md:col-span-3">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Change status</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["todo", "in progress", "done"].map((status) => (
                <button className="btn-secondary" key={status} onClick={() => handleStatusChange(status)} type="button">
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
        {task.files?.length ? (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Attachments</p>
            <div className="mt-3 flex flex-col gap-2">
              {task.files.map((file) => (
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
          </div>
        ) : null}
      </section>

      <section className="card p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Comments</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">Discussion</h3>
        <form className="mt-5 space-y-4" onSubmit={handleCommentSubmit}>
          <textarea
            className="input min-h-28"
            onChange={(event) => setCommentForm({ ...commentForm, content: event.target.value })}
            placeholder="Add a comment"
            value={commentForm.content}
          />
          <input className="input" multiple onChange={(event) => setCommentForm({ ...commentForm, files: event.target.files })} type="file" />
          <button className="btn-primary" type="submit">
            Post comment
          </button>
        </form>
        <div className="mt-6 space-y-4">
          {comments.map((comment) => (
            <CommentCard comment={comment} key={comment._id} />
          ))}
          {!comments.length ? <p className="text-sm text-slate-500">No comments yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
