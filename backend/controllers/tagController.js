const Tag = require("../models/Tag");
const Task = require("../models/Task");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { logActivity } = require("../utils/activityLogger");

const listTags = asyncHandler(async (_req, res) => {
  const tags = await Tag.find({ isDeleted: false }).sort({ name: 1 });

  res.json({
    success: true,
    data: tags
  });
});

const createTag = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    throw new ApiError(400, "Tag name is required.");
  }

  const normalizedName = req.body.name.trim();
  if (!normalizedName) {
    throw new ApiError(400, "Tag name is required.");
  }

  const existingTag = await Tag.findOne({ name: normalizedName });
  if (existingTag && !existingTag.isDeleted) {
    throw new ApiError(409, "Tag already exists.");
  }

  if (existingTag && existingTag.isDeleted) {
    existingTag.isDeleted = false;
    existingTag.color = req.body.color || existingTag.color || "#0f172a";
    existingTag.createdBy = req.user._id;
    await existingTag.save();

    await logActivity({
      action: "restore-tag",
      entityType: "tag",
      entityId: existingTag._id,
      message: `${req.user.name} restored tag "${existingTag.name}".`,
      userId: req.user._id,
      metadata: { color: existingTag.color }
    });

    return res.status(201).json({
      success: true,
      message: "Tag restored successfully.",
      data: existingTag
    });
  }

  const tag = await Tag.create({
    name: normalizedName,
    color: req.body.color || "#0f172a",
    createdBy: req.user._id
  });

  await logActivity({
    action: "create-tag",
    entityType: "tag",
    entityId: tag._id,
    message: `${req.user.name} created tag "${tag.name}".`,
    userId: req.user._id,
    metadata: { color: tag.color }
  });

  res.status(201).json({
    success: true,
    message: "Tag created successfully.",
    data: tag
  });
});

const softDeleteTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findOne({ _id: req.params.id, isDeleted: false });

  if (!tag) {
    throw new ApiError(404, "Tag not found.");
  }

  tag.isDeleted = true;
  await tag.save();
  await Task.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } });

  await logActivity({
    action: "delete-tag",
    entityType: "tag",
    entityId: tag._id,
    message: `${req.user.name} deleted tag "${tag.name}".`,
    userId: req.user._id,
    metadata: { color: tag.color }
  });

  res.json({
    success: true,
    message: "Tag deleted successfully."
  });
});

module.exports = {
  listTags,
  createTag,
  softDeleteTag
};
