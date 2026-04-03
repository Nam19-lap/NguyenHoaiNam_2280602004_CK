const User = require("../models/User");
const ApiError = require("../utils/apiError");
const { verifyAccessToken } = require("../utils/tokens");

const authenticate = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      throw new ApiError(401, "Authentication required.");
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findOne({ _id: decoded.sub, isDeleted: false }).select("-passwordHash");

    if (!user) {
      throw new ApiError(401, "User session is no longer valid.");
    }

    req.user = user;
    next();
  } catch (_error) {
    next(new ApiError(401, "Invalid or expired access token."));
  }
};

const authorizeRoles = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, "You do not have permission for this action."));
  }

  next();
};

module.exports = {
  authenticate,
  authorizeRoles
};
