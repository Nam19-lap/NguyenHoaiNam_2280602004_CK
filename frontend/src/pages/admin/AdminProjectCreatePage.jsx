import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AdminProjectForm from "../../components/admin/AdminProjectForm.jsx";
import { useAppContext } from "../../store/AppContext.jsx";

export default function AdminProjectCreatePage() {
  const navigate = useNavigate();
  const { users, loadUsers, createProject, loading } = useAppContext();

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (payload) => {
    await createProject(payload);
    navigate("/admin/projects");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Quick action</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Create new project</h2>
      </section>
      <AdminProjectForm loading={loading} onSubmit={handleSubmit} users={users} />
    </div>
  );
}
