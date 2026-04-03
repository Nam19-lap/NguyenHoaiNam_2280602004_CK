const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const { listActivities } = require("../controllers/activityController");

const router = express.Router();

router.use(authenticate);
router.get("/", listActivities);

module.exports = router;
