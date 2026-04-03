const express = require("express");
const { authenticate, authorizeRoles } = require("../middlewares/authMiddleware");
const {
  listUsers,
  getUserById,
  getProfile,
  updateProfile,
  changePassword,
  updateUser,
  softDeleteUser
} = require("../controllers/userController");

const router = express.Router();

router.use(authenticate);
router.get("/me", getProfile);
router.patch("/me", updateProfile);
router.patch("/me/password", changePassword);
router.get("/", authorizeRoles("admin"), listUsers);
router.get("/:id", authorizeRoles("admin"), getUserById);
router.patch("/:id", authorizeRoles("admin"), updateUser);
router.delete("/:id", authorizeRoles("admin"), softDeleteUser);

module.exports = router;
