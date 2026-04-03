const ActivityLog = require("../models/ActivityLog");

const logActivity = async ({
  action,
  entityType,
  entityId,
  projectId,
  taskId,
  message,
  userId,
  metadata = {}
}) => {
  await ActivityLog.create({
    action,
    entityType,
    entityId,
    projectId,
    taskId,
    message,
    userId,
    metadata
  });
};

module.exports = {
  logActivity
};
