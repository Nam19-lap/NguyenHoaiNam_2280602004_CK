const mongoose = require("mongoose");
const ApiError = require("./apiError");
const Project = require("../models/Project");
const Task = require("../models/Task");

const isAdmin = (user) => user?.role === "admin";

const hasProjectAccess = async (user, projectId) => {
  if (isAdmin(user)) {
    return true;
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return false;
  }

  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false,
    members: user._id
  }).lean();

  return Boolean(project);
};

const ensureProjectAccess = async (user, projectId) => {
  if (!(await hasProjectAccess(user, projectId))) {
    throw new ApiError(403, "You do not have access to this project.");
  }
};

const ensureTaskAccess = async (user, taskId) => {
  const task = await Task.findOne({ _id: taskId, isDeleted: false }).select("projectId");

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  await ensureProjectAccess(user, task.projectId);
  return task;
};

module.exports = {
  isAdmin,
  hasProjectAccess,
  ensureProjectAccess,
  ensureTaskAccess
};
