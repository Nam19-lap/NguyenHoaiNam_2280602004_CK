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

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, trim: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    files: [fileSchema],
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
