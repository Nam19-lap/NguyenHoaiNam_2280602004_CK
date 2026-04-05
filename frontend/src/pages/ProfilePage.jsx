import { useEffect, useState } from "react";

import { useAppContext } from "../store/AppContext.jsx";
import { resolveMediaUrl } from "../utils/media.js";

export default function ProfilePage() {
  const { auth, updateProfile, changePassword } = useAppContext();
  const [profileForm, setProfileForm] = useState({
    name: auth.user?.name || "",
    avatar: auth.user?.avatar || "",
    avatarFile: null
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: ""
  });
  const [avatarPreview, setAvatarPreview] = useState(auth.user?.avatar ? resolveMediaUrl(auth.user.avatar) : "");

  useEffect(() => {
    setProfileForm({
      name: auth.user?.name || "",
      avatar: auth.user?.avatar || "",
      avatarFile: null
    });
    setAvatarPreview(auth.user?.avatar ? resolveMediaUrl(auth.user.avatar) : "");
  }, [auth.user?.name, auth.user?.avatar]);

  const handleAvatarFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setProfileForm((current) => ({ ...current, avatarFile: file }));
    setAvatarPreview(file ? URL.createObjectURL(file) : resolveMediaUrl(profileForm.avatar));
  };

  const handleAvatarUrlChange = (event) => {
    const nextAvatar = event.target.value;
    setProfileForm((current) => ({ ...current, avatar: nextAvatar, avatarFile: null }));
    setAvatarPreview(nextAvatar ? resolveMediaUrl(nextAvatar) : "");
  };

  const handleSaveProfile = async () => {
    const updatedUser = await updateProfile(profileForm);
    setProfileForm({
      name: updatedUser.name || "",
      avatar: updatedUser.avatar || "",
      avatarFile: null
    });
    setAvatarPreview(updatedUser.avatar ? resolveMediaUrl(updatedUser.avatar) : "");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="card p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Profile</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">Personal information</h2>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4 rounded-3xl bg-slate-50 p-4">
            {avatarPreview ? (
              <img alt="Avatar preview" className="h-20 w-20 rounded-2xl object-cover" src={avatarPreview} />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-black text-white">
                {(profileForm.name || auth.user?.name || "U").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-slate-900">Avatar preview</p>
              <p className="text-sm text-slate-500">Upload anh that hoac dan Avatar URL de cap nhat anh dai dien.</p>
            </div>
          </div>
          <input className="input" onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} value={profileForm.name} />
          <input accept="image/*" className="input" onChange={handleAvatarFileChange} type="file" />
          <input className="input" onChange={handleAvatarUrlChange} placeholder="Avatar URL" value={profileForm.avatar} />
          <button className="btn-primary" onClick={handleSaveProfile} type="button">
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
