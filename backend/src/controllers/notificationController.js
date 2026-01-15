const Notifications = require("../models/notification");


exports.getNotificationByEntityType = async (req, res) => {
    const { notificationType } = req.query;
    try {

        const notifications = await Notifications.find({ entityType: notificationType, isRead: false }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });

    } catch (error) {
        console.log("Error fetuching notifications:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

exports.getBuNotifications = async (req, res) => {
    try {
        const bu_notifications = await Notifications.find({ entityType: 'bu_notification' }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: bu_notifications.length,
            data: bu_notifications,
        });
    } catch (error) {
        console.log("Error fetching BU notifications:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

exports.getActivities = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const activities = await Notifications.find({
            entityType: 'activity', createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: activities.length,
            data: activities,
        });
    } catch (error) {
        console.log("Error fetching activities:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

exports.deleteNotification = async (req, res) => {
    const notificationId = req.params.id;
    try {
        const notification = await Notifications.findByIdAndDelete(notificationId);
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.status(200).json({ success: true, data: "Notification deleted successfully." });
    } catch (error) {
        console.log("Error updating read status:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}