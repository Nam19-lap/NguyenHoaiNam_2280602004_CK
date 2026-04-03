const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

const listNotifications = asyncHandler(async (req, res) => {
  const items = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: {
      items,
      unreadCount: items.filter((item) => !item.read).length
    }
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found.");
  }

  res.json({
    success: true,
    message: "Notification marked as read.",
    data: notification
  });
});

const markAsUnread = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: false },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found.");
  }

  res.json({
    success: true,
    message: "Notification marked as unread.",
    data: notification
  });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });

  res.json({
    success: true,
    message: "All notifications marked as read."
  });
});

module.exports = {
  listNotifications,
  markAsRead,
  markAsUnread,
  markAllAsRead
};
