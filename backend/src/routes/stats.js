const express = require("express");
const router = express.Router();
const { getCandidateStats, getTeamLoad, getDomainStats, getEventChart } = require("../controllers/stats");

router.get("/candidates", getCandidateStats);
router.get("/teamload", getTeamLoad);
router.get("/domains", getDomainStats);
router.get("/event_chart", getEventChart);

module.exports = router;