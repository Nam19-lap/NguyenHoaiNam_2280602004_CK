const bcrypt = require("bcrypt");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { sanitizeUser } = require("./authController");

const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find({ isDeleted: false }).select("-passwordHash").sort({ createdAt: -1 });

  res.json({
    success: true,
    data: users
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: false }).select("-passwordHash");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  res.json({
    success: true,
    data: user
  });
});

const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name ?? req.user.name,
      avatar: req.body.avatar ?? req.user.avatar
    },
    { new: true }
  ).select("-passwordHash");

  res.json({
    success: true,
    message: "Profile updated successfully.",
    data: user
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!(await bcrypt.compare(currentPassword || "", user.passwordHash))) {
    throw new ApiError(400, "Current password is incorrect.");
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });

  res.json({
    success: true,
    message: "Password changed successfully. Please sign in again."
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: false });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (req.body.email && req.body.email !== user.email) {
    const emailTaken = await User.findOne({
      email: req.body.email.toLowerCase(),
      _id: { $ne: user._id },
      isDeleted: false
    });

    if (emailTaken) {
      throw new ApiError(409, "Email is already in use.");
    }

    user.email = req.body.email.toLowerCase();
  }

  if (req.body.name) {
    user.name = req.body.name;
  }

  if (req.body.role) {
    user.role = req.body.role;
  }

  if (typeof req.body.avatar === "string") {
    user.avatar = req.body.avatar;
  }

  await user.save();

  res.json({
    success: true,
    message: "User updated successfully.",
    data: sanitizeUser(user)
  });
});

const softDeleteUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    throw new ApiError(400, "You cannot delete your own account.");
  }

  const user = await User.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  ).select("-passwordHash");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });

  res.json({
    success: true,
    message: "User deleted successfully.",
    data: user
  });
});

module.exports = {
  listUsers,
  getUserById,
  getProfile,
  updateProfile,
  changePassword,
  updateUser,
  softDeleteUser
};
