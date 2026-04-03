const bcrypt = require("bcrypt");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require("../utils/tokens");

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const buildAuthResponse = async (user) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  const decoded = verifyRefreshToken(refreshToken);

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(decoded.exp * 1000)
  });

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken
  };
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required.");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase(), isDeleted: false });
  if (existingUser) {
    throw new ApiError(409, "Email is already in use.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: "user"
  });

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    data: await buildAuthResponse(user)
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: String(email || "").toLowerCase(),
    isDeleted: false
  });

  if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  res.json({
    success: true,
    message: "Login successful.",
    data: await buildAuthResponse(user)
  });
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token is required.");
  }

  const decoded = verifyRefreshToken(refreshToken);
  const tokenDoc = await RefreshToken.findOne({
    token: refreshToken,
    userId: decoded.sub,
    isRevoked: false
  });

  if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
    throw new ApiError(401, "Refresh token is invalid or expired.");
  }

  tokenDoc.isRevoked = true;
  await tokenDoc.save();

  const user = await User.findOne({ _id: decoded.sub, isDeleted: false });
  if (!user) {
    throw new ApiError(401, "User session is no longer valid.");
  }

  res.json({
    success: true,
    message: "Token refreshed successfully.",
    data: await buildAuthResponse(user)
  });
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await RefreshToken.updateMany({ token: refreshToken }, { isRevoked: true });
  }

  res.json({
    success: true,
    message: "Logged out successfully."
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  sanitizeUser
};
