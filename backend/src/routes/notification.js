const express = require("express");
const router = express.Router();
const {
    getNotificationsByAssignedHrId,
    getBuNotifications
} = require("../controllers/notificationController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/assigned_notifications", authMiddleware, getNotificationsByAssignedHrId);
router.get("/bu_notifications", authMiddleware, getBuNotifications);

module.exports = router;
