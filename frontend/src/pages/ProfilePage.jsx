import { useState } from "react";

import { useAppContext } from "../store/AppContext.jsx";

export default function ProfilePage() {
  const { auth, updateProfile, changePassword } = useAppContext();
  const [profileForm, setProfileForm] = useState({
    name: auth.user?.name || "",
    avatar: auth.user?.avatar || ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: ""
  });

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="card p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Profile</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">Personal information</h2>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4 rounded-3xl bg-slate-50 p-4">
            {profileForm.avatar ? (
              <img
                alt="Avatar preview"
                className="h-20 w-20 rounded-2xl object-cover"
                src={profileForm.avatar}
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-black text-white">
                {(profileForm.name || auth.user?.name || "U").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-slate-900">Avatar preview</p>
              <p className="text-sm text-slate-500">Dán link ảnh vào ô Avatar URL để cập nhật ảnh đại diện.</p>
            </div>
          </div>
          <input className="input" onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} value={profileForm.name} />
          <input
            className="input"
            onChange={(event) => setProfileForm({ ...profileForm, avatar: event.target.value })}
            placeholder="Avatar URL"
            value={profileForm.avatar}
          />
          <button className="btn-primary" onClick={() => updateProfile(profileForm)} type="button">
            Save profile
          </button>
        </div>
      </section>

      <section className="card p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Security</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">Change password</h2>
        <div className="mt-6 space-y-4">
          <input
            className="input"
            onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })}
            placeholder="Current password"
            type="password"
            value={passwordForm.currentPassword}
          />
          <input
            className="input"
            onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })}
            placeholder="New password"
            type="password"
            value={passwordForm.newPassword}
          />
          <button className="btn-primary" onClick={() => changePassword(passwordForm)} type="button">
            Update password
          </button>
        </div>
      </section>
    </div>
  );
}
