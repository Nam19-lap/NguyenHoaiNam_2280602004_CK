const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ["task", "comment", "system"], default: "system" },
    entityId: { type: mongoose.Schema.Types.ObjectId }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
