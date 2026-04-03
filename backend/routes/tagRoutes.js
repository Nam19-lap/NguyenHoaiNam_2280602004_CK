const express = require("express");
const { authenticate, authorizeRoles } = require("../middlewares/authMiddleware");
const { listTags, createTag } = require("../controllers/tagController");

const router = express.Router();

router.use(authenticate);
router.get("/", listTags);
router.post("/", authorizeRoles("admin"), createTag);

module.exports = router;
