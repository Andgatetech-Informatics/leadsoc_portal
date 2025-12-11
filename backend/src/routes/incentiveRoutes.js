const express = require("express");
const router = express.Router();
const {
  addIncentive,
  getTotalIncentive,
} = require("../controllers/incentiveController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/add-incentive/:jobId", authMiddleware, addIncentive);
router.get("/get-total-incentive", authMiddleware, getTotalIncentive);

module.exports = router;
