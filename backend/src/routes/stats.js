const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { getCandidateStats, getTeamLoad, getDomainStats, getEventChart } = require("../controllers/stats");

router.get("/candidates", authMiddleware, getCandidateStats);
router.get("/teamload", getTeamLoad);
router.get("/domains", getDomainStats);
router.get("/event_chart", authMiddleware, getEventChart);

module.exports = router;