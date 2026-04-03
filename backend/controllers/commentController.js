const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const Task = require("../models/Task");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { logActivity } = require("../utils/activityLogger");
const { ensureTaskAccess } = require("../utils/permissions");
const { mapUploadedFiles } = require("../utils/upload");

const commentPopulate = [{ path: "userId", select: "name email avatar role" }];

const listCommentsByTask = asyncHandler(async (req, res) => {
  await ensureTaskAccess(req.user, req.params.taskId);

  const comments = await Comment.find({
    taskId: req.params.taskId,
    isDeleted: false
  })
    .populate(commentPopulate)
    .sort({ createdAt: 1 });

  res.json({
    success: true,
    data: comments
  });
});

const createComment = asyncHandler(async (req, res) => {
  const task = await ensureTaskAccess(req.user, req.body.taskId);

  const comment = await Comment.create({
    content: req.body.content,
    taskId: req.body.taskId,
    userId: req.user._id,
    files: mapUploadedFiles(req)
  });

  await comment.populate(commentPopulate);

  const fullTask = await Task.findById(task._id).populate("assignedTo", "_id").populate("createdBy", "_id title");
  const recipients = new Set([
    ...fullTask.assignedTo.map((user) => user._id.toString()),
    fullTask.createdBy._id.toString()
  ]);
  recipients.delete(req.user._id.toString());

  if (recipients.size) {
    await Notification.insertMany(
      [...recipients].map((userId) => ({
        userId,
        message: `${req.user.name} commented on task "${fullTask.title}".`,
        type: "comment",
        entityId: fullTask._id
      }))
    );
  }

  await logActivity({
    action: "create-comment",
    entityType: "comment",
    entityId: comment._id,
    projectId: fullTask.projectId,
    taskId: fullTask._id,
    message: `${req.user.name} commented on task "${fullTask.title}".`,
    userId: req.user._id
  });

  res.status(201).json({
    success: true,
    message: "Comment added successfully.",
    data: comment
  });
});

const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.id, isDeleted: false });

  if (!comment) {
    throw new ApiError(404, "Comment not found.");
  }

  await ensureTaskAccess(req.user, comment.taskId);

  if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You can only edit your own comments.");
  }

  comment.content = req.body.content ?? comment.content;
  const incomingFiles = mapUploadedFiles(req);
  if (incomingFiles.length) {
    comment.files = [...comment.files, ...incomingFiles];
  }

  await comment.save();
  await comment.populate(commentPopulate);

  const task = await Task.findById(comment.taskId).select("projectId title");
  await logActivity({
    action: "update-comment",
    entityType: "comment",
    entityId: comment._id,
    projectId: task?.projectId,
    taskId: comment.taskId,
    message: `${req.user.name} updated a comment on task "${task?.title || "task"}".`,
    userId: req.user._id
  });

  res.json({
    success: true,
    message: "Comment updated successfully.",
    data: comment
  });
});

const softDeleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.id, isDeleted: false });

  if (!comment) {
    throw new ApiError(404, "Comment not found.");
  }

  await ensureTaskAccess(req.user, comment.taskId);

  if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You can only delete your own comments.");
  }

  comment.isDeleted = true;
  await comment.save();

  const task = await Task.findById(comment.taskId).select("projectId title");
  await logActivity({
    action: "delete-comment",
    entityType: "comment",
    entityId: comment._id,
    projectId: task?.projectId,
    taskId: comment.taskId,
    message: `${req.user.name} deleted a comment on task "${task?.title || "task"}".`,
    userId: req.user._id
  });

  res.json({
    success: true,
    message: "Comment deleted successfully."
  });
});

module.exports = {
  listCommentsByTask,
  createComment,
  updateComment,
  softDeleteComment
};
