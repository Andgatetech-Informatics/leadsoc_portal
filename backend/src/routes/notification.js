const express = require("express");
const router = express.Router();
const {
    getNotificationByEntityType,
    getBuNotifications,
    deleteNotification
} = require("../controllers/notificationController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/notifications_by_entityType", authMiddleware, getNotificationByEntityType);
router.get("/bu_notifications", authMiddleware, getBuNotifications);
router.delete("/delete/:id", authMiddleware, deleteNotification);

module.exports = router;
