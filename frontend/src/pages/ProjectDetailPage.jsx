import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Modal from "../components/Modal.jsx";
import TaskCard from "../components/TaskCard.jsx";
import { useAppContext } from "../store/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { formatDate, getTagTextColor } from "../utils/formatters.js";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const {
    loadProject,
    users,
    tags,
    loadUsers,
    loadTags,
    createTag,
    deleteTag,
    loadActivities,
    createTask,
    updateTask,
    deleteTask,
    deleteProject,
    exportTasksCsv
  } = useAppContext();
  const [project, setProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activities, setActivities] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    tagId: "",
    due: ""
  });
  const [tagForm, setTagForm] = useState({ name: "", color: "#0f172a" });
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: [],
    tags: [],
    status: "todo",
    priority: "medium",
    dueDate: "",
    files: []
  });

  const refreshProject = async () => {
    const [data, nextActivities] = await Promise.all([loadProject(projectId), loadActivities({ projectId })]);
    setProject(data);
    setActivities(nextActivities);
  };

  useEffect(() => {
    refreshProject();
    loadTags();
    if (user?.role === "admin") {
      loadUsers();
    }
  }, [projectId]);

  const canManageTasks = useMemo(
    () => user?.role === "admin" || project?.members?.some((member) => member._id === user?._id),
    [project, user]
  );

  const openCreate = () => {
    setEditingTask(null);
    setForm({ title: "", description: "", assignedTo: [], tags: [], status: "todo", priority: "medium", dueDate: "", files: [] });
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo?.map((member) => member._id) || [],
      tags: task.tags?.map((tag) => tag._id) || [],
      status: task.status,
      priority: task.priority || "medium",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      files: []
    });
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...form, projectId };

    if (editingTask) {
      await updateTask(editingTask._id, payload);
    } else {
      await createTask(payload);
    }

    setModalOpen(false);
    await refreshProject();
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    await refreshProject();
  };

  const handleDeleteProject = async () => {
    await deleteProject(projectId);
    navigate(location.pathname.startsWith("/admin") ? "/admin/projects" : "/projects");
  };

  const handleCreateTag = async (event) => {
    event.preventDefault();
    await createTag(tagForm);
    setTagForm({ name: "", color: "#0f172a" });
  };

  const handleDeleteTag = async (tagId) => {
    await deleteTag(tagId);
    await refreshProject();
  };

  if (!project) {
    return <p className="text-sm text-slate-500">Loading project...</p>;
  }

  const assigneeOptions = user?.role === "admin" ? users : project.members || [];
  const filteredTasks = (project.tasks || []).filter((task) => {
    const matchesSearch =
      !filters.search ||
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesTag = !filters.tagId || task.tags?.some((tag) => tag._id === filters.tagId);
    const matchesDue =
      !filters.due ||
      (filters.due === "overdue" ? task.dueDate && new Date(task.dueDate) < new Date() : task.dueDate && new Date(task.dueDate) >= new Date());

    return matchesSearch && matchesStatus && matchesTag && matchesDue;
  });

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Project detail</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">{project.name}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {canManageTasks ? (
              <button className="btn-primary" onClick={openCreate} type="button">
                New task
              </button>
            ) : null}
            {user?.role === "admin" ? (
              <button className="btn-secondary" onClick={() => setTagModalOpen(true)} type="button">
                New tag
              </button>
            ) : null}
            <button className="btn-secondary" onClick={() => exportTasksCsv({ projectId })} type="button">
              Export CSV
            </button>
            {user?.role === "admin" ? (
              <button className="btn-secondary border-red-200 text-red-600" onClick={handleDeleteProject} type="button">
                Delete project
              </button>
            ) : null}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.members?.map((member) => (
            <span className="badge bg-slate-100 text-slate-700" key={member._id}>
              {member.name}
            </span>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            className="input"
            onChange={(event) => setFilters({ ...filters, search: event.target.value })}
            placeholder="Search task"
            value={filters.search}
          />
          <select className="input" onChange={(event) => setFilters({ ...filters, status: event.target.value })} value={filters.status}>
            <option value="">All status</option>
            <option value="todo">todo</option>
            <option value="in progress">in progress</option>
            <option value="done">done</option>
          </select>
          <select className="input" onChange={(event) => setFilters({ ...filters, tagId: event.target.value })} value={filters.tagId}>
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.name}
              </option>
            ))}
          </select>
          <select className="input" onChange={(event) => setFilters({ ...filters, due: event.target.value })} value={filters.due}>
            <option value="">All due dates</option>
            <option value="overdue">Overdue</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {filteredTasks.map((task) => (
          <div className="space-y-3" key={task._id}>
            <TaskCard task={task} />
            {canManageTasks ? (
              <div className="flex gap-3">
                <button className="btn-secondary" onClick={() => openEdit(task)} type="button">
                  Edit
                </button>
                <button className="btn-secondary border-red-200 text-red-600" onClick={() => handleDeleteTask(task._id)} type="button">
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        ))}
        {!filteredTasks.length ? <p className="text-sm text-slate-500">No tasks match the current filters.</p> : null}
      </section>

      <section className="card p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Activity log</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">Latest project activity</h3>
        <div className="mt-5 space-y-3">
          {activities.map((item) => (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4" key={item._id}>
              <p className="text-sm font-semibold text-slate-900">{item.message}</p>
              <p className="mt-1 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
            </div>
          ))}
          {!activities.length ? <p className="text-sm text-slate-500">No activity recorded yet.</p> : null}
        </div>
      </section>

      <Modal onClose={() => setModalOpen(false)} open={modalOpen} title={editingTask ? "Edit task" : "Create task"}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="input"
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Task title"
            value={form.title}
          />
          <textarea
            className="input min-h-28"
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Description"
            value={form.description}
          />
          <select
            className="input min-h-28"
            multiple
            onChange={(event) =>
              setForm({ ...form, assignedTo: Array.from(event.target.selectedOptions).map((option) => option.value) })
            }
            value={form.assignedTo}
          >
            {assigneeOptions.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
          <select
            className="input min-h-28"
            multiple
            onChange={(event) =>
              setForm({ ...form, tags: Array.from(event.target.selectedOptions).map((option) => option.value) })
            }
            value={form.tags}
          >
            {tags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.name}
              </option>
            ))}
          </select>
          <div className="grid gap-4 sm:grid-cols-3">
            <select
              className="input"
              onChange={(event) => setForm({ ...form, status: event.target.value })}
              value={form.status}
            >
              <option value="todo">todo</option>
              <option value="in progress">in progress</option>
              <option value="done">done</option>
            </select>
            <select
              className="input"
              onChange={(event) => setForm({ ...form, priority: event.target.value })}
              value={form.priority}
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
            <input
              className="input"
              onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
              type="date"
              value={form.dueDate}
            />
          </div>
          <input className="input" multiple onChange={(event) => setForm({ ...form, files: event.target.files })} type="file" />
          <button className="btn-primary" type="submit">
            {editingTask ? "Save task" : "Create task"}
          </button>
        </form>
      </Modal>

      <Modal onClose={() => setTagModalOpen(false)} open={tagModalOpen} title="Create tag">
        <div className="space-y-6">
          <form className="space-y-4" onSubmit={handleCreateTag}>
            <input
              className="input"
              onChange={(event) => setTagForm({ ...tagForm, name: event.target.value })}
              placeholder="Tag name"
              value={tagForm.name}
            />
            <div className="flex items-center gap-3">
              <input
                className="h-12 w-16 cursor-pointer rounded-2xl border border-slate-200 bg-white p-2"
                onChange={(event) => setTagForm({ ...tagForm, color: event.target.value })}
                type="color"
                value={tagForm.color}
              />
              <span
                className="badge border border-slate-200/30"
                style={{
                  backgroundColor: tagForm.color,
                  color: getTagTextColor(tagForm.color)
                }}
              >
                {tagForm.name.trim() || "Preview tag"}
              </span>
            </div>
            <button className="btn-primary" type="submit">
              Create tag
            </button>
          </form>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Existing tags</p>
            <div className="mt-4 space-y-3">
              {tags.map((tag) => (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" key={tag._id}>
                  <div className="flex items-center gap-3">
                    <span
                      className="badge border border-slate-200/30"
                      style={{
                        backgroundColor: tag.color || "#0f172a",
                        color: getTagTextColor(tag.color || "#0f172a")
                      }}
                    >
                      {tag.name || "Untitled tag"}
                    </span>
                    <span className="text-xs text-slate-500">{tag.color || "#0f172a"}</span>
                  </div>
                  <button
                    className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 shadow-md transition hover:shadow-lg"
                    onClick={() => handleDeleteTag(tag._id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {!tags.length ? <p className="text-sm text-slate-500">No tags created yet.</p> : null}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
