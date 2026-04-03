const Tag = require("../models/Tag");
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

  const existingTag = await Tag.findOne({ name: req.body.name.trim(), isDeleted: false });
  if (existingTag) {
    throw new ApiError(409, "Tag already exists.");
  }

  const tag = await Tag.create({
    name: req.body.name.trim(),
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

module.exports = {
  listTags,
  createTag
};
