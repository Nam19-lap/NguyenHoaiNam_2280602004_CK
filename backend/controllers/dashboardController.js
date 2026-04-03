const Project = require("../models/Project");
const Task = require("../models/Task");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const { isAdmin } = require("../utils/permissions");

const getDashboardSummary = asyncHandler(async (req, res) => {
  const projectFilter = { isDeleted: false };
  const taskFilter = { isDeleted: false };
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  if (!isAdmin(req.user)) {
    const accessibleProjects = await Project.find({
      members: req.user._id,
      isDeleted: false
    }).select("_id");

    const ids = accessibleProjects.map((project) => project._id);
    projectFilter._id = { $in: ids };
    taskFilter.projectId = { $in: ids };
  }

  const [projects, tasks, todo, inProgress, done, overdueTasks, tasksCompletedToday, myTasks, unreadNotifications, recentTasks] = await Promise.all([
    Project.countDocuments(projectFilter),
    Task.countDocuments(taskFilter),
    Task.countDocuments({ ...taskFilter, status: "todo" }),
    Task.countDocuments({ ...taskFilter, status: "in progress" }),
    Task.countDocuments({ ...taskFilter, status: "done" }),
    Task.countDocuments({
      ...taskFilter,
      status: { $ne: "done" },
      dueDate: { $lt: new Date() }
    }),
    Task.countDocuments({
      ...taskFilter,
      status: "done",
      updatedAt: {
        $gte: startOfToday,
        $lt: endOfToday
      }
    }),
    Task.find({ assignedTo: req.user._id, isDeleted: false }).populate("projectId", "name").sort({ dueDate: 1 }).limit(5),
    Notification.countDocuments({ userId: req.user._id, read: false }),
    Task.find(taskFilter)
      .populate("projectId", "name")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 })
      .limit(10)
  ]);

  res.json({
    success: true,
    data: {
      counts: {
        projects,
        tasks,
        todo,
        inProgress,
        done,
        overdueTasks,
        tasksCompletedToday,
        unreadNotifications
      },
      myTasks,
      recentTasks
    }
  });
});

module.exports = {
  getDashboardSummary
};
