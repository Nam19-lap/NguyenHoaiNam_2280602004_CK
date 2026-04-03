const Notification = require("../models/Notification");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Tag = require("../models/Tag");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { logActivity } = require("../utils/activityLogger");
const { ensureProjectAccess } = require("../utils/permissions");
const { mapUploadedFiles } = require("../utils/upload");

const taskPopulate = [
  { path: "projectId", select: "name description members" },
  { path: "assignedTo", select: "name email avatar role" },
  { path: "tags", select: "name color" },
  { path: "createdBy", select: "name email avatar role" }
];

const createNotificationsForUsers = async (userIds, message, entityId) => {
  const uniqueUserIds = [...new Set(userIds.map(String))];

  if (!uniqueUserIds.length) {
    return;
  }

  await Notification.insertMany(
    uniqueUserIds.map((userId) => ({
      userId,
      message,
      type: "task",
      entityId
    }))
  );
};

const listTasks = asyncHandler(async (req, res) => {
  const filter = { isDeleted: false };

  if (req.query.projectId) {
    await ensureProjectAccess(req.user, req.query.projectId);
    filter.projectId = req.query.projectId;
  } else if (req.user.role !== "admin") {
    const projects = await Project.find({ members: req.user._id, isDeleted: false }).select("_id");
    filter.projectId = { $in: projects.map((project) => project._id) };
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.priority) {
    filter.priority = req.query.priority;
  }

  if (req.query.assignedTo) {
    filter.assignedTo = req.query.assignedTo;
  }

  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } }
    ];
  }

  if (req.query.tagId) {
    filter.tags = req.query.tagId;
  }

  if (req.query.due === "overdue") {
    filter.dueDate = { $lt: new Date() };
  }

  if (req.query.due === "upcoming") {
    filter.dueDate = { $gte: new Date() };
  }

  const tasks = await Task.find(filter).populate(taskPopulate).sort({ dueDate: 1, updatedAt: -1 });

  res.json({
    success: true,
    data: tasks
  });
});

const exportTasksCsv = asyncHandler(async (req, res) => {
  const filter = { isDeleted: false };

  if (req.query.projectId) {
    await ensureProjectAccess(req.user, req.query.projectId);
    filter.projectId = req.query.projectId;
  } else if (req.user.role !== "admin") {
    const projects = await Project.find({ members: req.user._id, isDeleted: false }).select("_id");
    filter.projectId = { $in: projects.map((project) => project._id) };
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const tasks = await Task.find(filter)
    .populate(taskPopulate)
    .sort({ createdAt: -1 });

  const rows = [
    ["Title", "Project", "Status", "Due Date", "Assigned To", "Tags"].join(","),
    ...tasks.map((task) =>
      [
        task.title,
        task.projectId?.name || "",
        task.status,
        task.dueDate ? new Date(task.dueDate).toISOString() : "",
        task.assignedTo?.map((user) => user.name).join(" | ") || "",
        task.tags?.map((tag) => tag.name).join(" | ") || ""
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    )
  ];

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="tasks-export.csv"');
  res.send(rows.join("\n"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, isDeleted: false }).populate(taskPopulate);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  await ensureProjectAccess(req.user, task.projectId._id);

  res.json({
    success: true,
    data: task
  });
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, projectId, assignedTo, status, priority, dueDate, tags } = req.body;

  await ensureProjectAccess(req.user, projectId);

  const normalizedTags = Array.isArray(tags) ? tags : tags ? [tags] : [];
  if (normalizedTags.length) {
    const validTags = await Tag.countDocuments({ _id: { $in: normalizedTags }, isDeleted: false });
    if (validTags !== normalizedTags.length) {
      throw new ApiError(400, "One or more tags are invalid.");
    }
  }

  const task = await Task.create({
    title,
    description,
    projectId,
    assignedTo: Array.isArray(assignedTo) ? assignedTo : assignedTo ? [assignedTo] : [],
    status: status || "todo",
    priority: priority || "medium",
    dueDate: dueDate || null,
    tags: normalizedTags,
    files: mapUploadedFiles(req),
    createdBy: req.user._id
  });

  await task.populate(taskPopulate);

  await createNotificationsForUsers(
    task.assignedTo.map((user) => user._id).filter((userId) => userId.toString() !== req.user._id.toString()),
    `A new task "${task.title}" was assigned to you.`,
    task._id
  );

  await logActivity({
    action: "create-task",
    entityType: "task",
    entityId: task._id,
    projectId: task.projectId._id,
    taskId: task._id,
    message: `${req.user.name} created task "${task.title}".`,
    userId: req.user._id,
    metadata: {
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo.map((member) => member._id.toString())
    }
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully.",
    data: task
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, isDeleted: false });

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  await ensureProjectAccess(req.user, task.projectId);

  if (req.body.projectId) {
    await ensureProjectAccess(req.user, req.body.projectId);
    task.projectId = req.body.projectId;
  }

  if (req.body.title) {
    task.title = req.body.title;
  }

  if (typeof req.body.description === "string") {
    task.description = req.body.description;
  }

  if (req.body.status) {
    task.status = req.body.status;
  }

  if (req.body.priority) {
    task.priority = req.body.priority;
  }

  if (req.body.dueDate !== undefined) {
    task.dueDate = req.body.dueDate || null;
  }

  if (req.body.assignedTo !== undefined) {
    task.assignedTo = Array.isArray(req.body.assignedTo)
      ? req.body.assignedTo
      : req.body.assignedTo
        ? [req.body.assignedTo]
        : [];
  }

  if (req.body.tags !== undefined) {
    const normalizedTags = Array.isArray(req.body.tags) ? req.body.tags : req.body.tags ? [req.body.tags] : [];
    if (normalizedTags.length) {
      const validTags = await Tag.countDocuments({ _id: { $in: normalizedTags }, isDeleted: false });
      if (validTags !== normalizedTags.length) {
        throw new ApiError(400, "One or more tags are invalid.");
      }
    }

    task.tags = normalizedTags;
  }

  const incomingFiles = mapUploadedFiles(req);
  if (incomingFiles.length) {
    task.files = [...task.files, ...incomingFiles];
  }

  await task.save();
  await task.populate(taskPopulate);

  await logActivity({
    action: "update-task",
    entityType: "task",
    entityId: task._id,
    projectId: task.projectId._id || task.projectId,
    taskId: task._id,
    message: `${req.user.name} updated task "${task.title}".`,
    userId: req.user._id,
    metadata: {
      status: task.status,
      priority: task.priority,
      tags: task.tags.map((tag) => (tag._id ? tag._id.toString() : String(tag)))
    }
  });

  res.json({
    success: true,
    message: "Task updated successfully.",
    data: task
  });
});

const softDeleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, isDeleted: false });

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  await ensureProjectAccess(req.user, task.projectId);

  task.isDeleted = true;
  await task.save();

  await logActivity({
    action: "delete-task",
    entityType: "task",
    entityId: task._id,
    projectId: task.projectId,
    taskId: task._id,
    message: `${req.user.name} deleted task "${task.title}".`,
    userId: req.user._id
  });

  res.json({
    success: true,
    message: "Task deleted successfully."
  });
});

module.exports = {
  listTasks,
  exportTasksCsv,
  getTaskById,
  createTask,
  updateTask,
  softDeleteTask
};
