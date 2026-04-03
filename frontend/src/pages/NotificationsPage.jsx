import { useEffect } from "react";

import { useAppContext } from "../store/AppContext.jsx";

export default function NotificationsPage() {
  const { notifications, loadNotifications, markNotificationRead, markAllNotificationsRead } = useAppContext();

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="space-y-6">
      <section className="card flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Notifications</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">Activity feed</h2>
        </div>
        <button className="btn-primary" onClick={markAllNotificationsRead} type="button">
          Mark all as read
        </button>
      </section>

      <section className="space-y-4">
        {notifications.items.map((notification) => (
          <article className="card p-5" key={notification._id}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{notification.message}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">
                  {notification.read ? "read" : "unread"}
                </p>
              </div>
              <button
                className="btn-secondary"
                onClick={() => markNotificationRead(notification._id, !notification.read)}
                type="button"
              >
                Mark as {notification.read ? "unread" : "read"}
              </button>
            </div>
          </article>
        ))}
        {!notifications.items.length ? <p className="text-sm text-slate-500">No notifications yet.</p> : null}
      </section>
    </div>
  );
}
