const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  listNotifications,
  markAsRead,
  markAsUnread,
  markAllAsRead
} = require("../controllers/notificationController");

const router = express.Router();

router.use(authenticate);
router.get("/", listNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.patch("/:id/unread", markAsUnread);

module.exports = router;
