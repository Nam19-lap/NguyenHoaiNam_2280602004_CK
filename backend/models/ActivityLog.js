const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true
    },
    entityType: {
      type: String,
      enum: ["project", "task", "comment", "tag", "user"],
      required: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    },
    message: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
