const express = require("express");
const router = express.Router();
const { getNotificationsByAssignedHrId } = require("../controllers/notificationController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/assigned_notifications", authMiddleware, getNotificationsByAssignedHrId);

module.exports = router;
