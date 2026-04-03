const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  createTask,
  exportTasksCsv,
  getTaskById,
  listTasks,
  updateTask,
  softDeleteTask
} = require("../controllers/taskController");
const { upload } = require("../utils/upload");

const router = express.Router();

router.use(authenticate);
router.get("/", listTasks);
router.get("/export/csv", exportTasksCsv);
router.get("/:id", getTaskById);
router.post("/", upload.array("files", 5), createTask);
router.patch("/:id", upload.array("files", 5), updateTask);
router.delete("/:id", softDeleteTask);

module.exports = router;
