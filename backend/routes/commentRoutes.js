const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  listCommentsByTask,
  createComment,
  updateComment,
  softDeleteComment
} = require("../controllers/commentController");
const { upload } = require("../utils/upload");

const router = express.Router();

router.use(authenticate);
router.get("/task/:taskId", listCommentsByTask);
router.post("/", upload.array("files", 5), createComment);
router.patch("/:id", upload.array("files", 5), updateComment);
router.delete("/:id", softDeleteComment);

module.exports = router;
