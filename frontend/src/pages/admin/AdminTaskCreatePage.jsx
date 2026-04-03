import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AdminTaskForm from "../../components/admin/AdminTaskForm.jsx";
import { useAppContext } from "../../store/AppContext.jsx";

export default function AdminTaskCreatePage() {
  const navigate = useNavigate();
  const { projects, users, tags, loadProjects, loadUsers, loadTags, createTask, loading } = useAppContext();

  useEffect(() => {
    Promise.all([loadProjects(), loadUsers(), loadTags()]);
  }, []);

  const handleSubmit = async (payload) => {
    await createTask(payload);
    navigate("/admin/tasks");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Quick action</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Create new task</h2>
      </section>
      <AdminTaskForm loading={loading} onSubmit={handleSubmit} projects={projects} tags={tags} users={users} />
    </div>
  );
}
