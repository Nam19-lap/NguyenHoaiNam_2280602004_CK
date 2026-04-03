const ActivityLog = require("../models/ActivityLog");
const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");
const { ensureProjectAccess, ensureTaskAccess } = require("../utils/permissions");

const listActivities = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.projectId) {
    await ensureProjectAccess(req.user, req.query.projectId);
    filter.projectId = req.query.projectId;
  }

  if (req.query.taskId) {
    const task = await ensureTaskAccess(req.user, req.query.taskId);
    filter.projectId = task.projectId;
    filter.taskId = req.query.taskId;
  }

  if (req.user.role !== "admin" && !req.query.projectId && !req.query.taskId) {
    const projects = await Project.find({ members: req.user._id, isDeleted: false }).select("_id");
    filter.projectId = { $in: projects.map((project) => project._id) };
  }

  const items = await ActivityLog.find(filter)
    .populate("userId", "name email role")
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({
    success: true,
    data: items
  });
});

module.exports = {
  listActivities
};
