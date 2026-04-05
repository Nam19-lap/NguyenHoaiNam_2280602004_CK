const Project = require("../models/Project");
const Task = require("../models/Task");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { logActivity } = require("../utils/activityLogger");
const { isAdmin } = require("../utils/permissions");

const projectPopulate = [
  { path: "members", select: "name email role avatar" },
  { path: "createdBy", select: "name email role avatar" }
];

const listProjects = asyncHandler(async (req, res) => {
  const filter = { isDeleted: false };

  if (!isAdmin(req.user)) {
    filter.members = req.user._id;
  }

  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: "i" };
  }

  const projects = await Project.find(filter).populate(projectPopulate).sort({ updatedAt: -1 });

  res.json({
    success: true,
    data: projects
  });
});

const getProjectById = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id, isDeleted: false };

  if (!isAdmin(req.user)) {
    filter.members = req.user._id;
  }

  const project = await Project.findOne(filter).populate(projectPopulate);
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const tasks = await Task.find({ projectId: project._id, isDeleted: false })
    .populate("assignedTo", "name email avatar role")
    .populate("tags", "name color")
    .populate("createdBy", "name email avatar role")
    .sort({ dueDate: 1, createdAt: -1 });

  res.json({
    success: true,
    data: {
      ...project.toObject(),
      tasks
    }
  });
});

const createProject = asyncHandler(async (req, res) => {
  const members = Array.isArray(req.body.members) ? req.body.members : [];
  const uniqueMembers = [...new Set([req.user._id.toString(), ...members])];

  const project = await Project.create({
    name: req.body.name,
    description: req.body.description || "",
    members: uniqueMembers,
    createdBy: req.user._id
  });

  await project.populate(projectPopulate);

  await logActivity({
    action: "create-project",
    entityType: "project",
    entityId: project._id,
    projectId: project._id,
    message: `${req.user.name} created project "${project.name}".`,
    userId: req.user._id
  });

  res.status(201).json({
    success: true,
    message: "Project created successfully.",
    data: project
  });
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, isDeleted: false });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  if (req.body.name) {
    project.name = req.body.name;
  }

  if (typeof req.body.description === "string") {
    project.description = req.body.description;
  }

  if (Array.isArray(req.body.members)) {
    project.members = [...new Set([project.createdBy.toString(), ...req.body.members])];
  }

  await project.save();
  await project.populate(projectPopulate);

  await logActivity({
    action: "update-project",
    entityType: "project",
    entityId: project._id,
    projectId: project._id,
    message: `${req.user.name} updated project "${project.name}".`,
    userId: req.user._id
  });

  res.json({
    success: true,
    message: "Project updated successfully.",
    data: project
  });
});

const softDeleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  await Task.updateMany({ projectId: project._id, isDeleted: false }, { isDeleted: true });

  await logActivity({
    action: "delete-project",
    entityType: "project",
    entityId: project._id,
    projectId: project._id,
    message: `${req.user.name} deleted project "${project.name}".`,
    userId: req.user._id
  });

  res.json({
    success: true,
    message: "Project deleted successfully."
  });
});

module.exports = {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  softDeleteProject
};
