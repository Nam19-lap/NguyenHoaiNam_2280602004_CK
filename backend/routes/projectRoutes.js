const express = require("express");
const { authenticate, authorizeRoles } = require("../middlewares/authMiddleware");
const {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  softDeleteProject
} = require("../controllers/projectController");

const router = express.Router();

router.use(authenticate);
router.get("/", listProjects);
router.get("/:id", getProjectById);
router.post("/", authorizeRoles("admin"), createProject);
router.patch("/:id", authorizeRoles("admin"), updateProject);
router.delete("/:id", authorizeRoles("admin"), softDeleteProject);

module.exports = router;
