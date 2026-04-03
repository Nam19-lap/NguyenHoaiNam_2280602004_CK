const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const { getDashboardSummary } = require("../controllers/dashboardController");

const router = express.Router();

router.use(authenticate);
router.get("/", getDashboardSummary);
router.get("/stats", getDashboardSummary);

module.exports = router;
