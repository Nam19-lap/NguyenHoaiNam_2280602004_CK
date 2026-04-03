const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    originalName: String,
    fileName: String,
    mimeType: String,
    size: Number,
    url: String
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["todo", "in progress", "done"], default: "todo" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate: Date,
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    files: [fileSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
