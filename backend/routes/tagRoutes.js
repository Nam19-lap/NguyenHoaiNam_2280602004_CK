const express = require("express");
const { authenticate, authorizeRoles } = require("../middlewares/authMiddleware");
const { listTags, createTag, softDeleteTag } = require("../controllers/tagController");

const router = express.Router();

router.use(authenticate);
router.get("/", listTags);
router.post("/", authorizeRoles("admin"), createTag);
router.delete("/:id", authorizeRoles("admin"), softDeleteTag);

module.exports = router;
