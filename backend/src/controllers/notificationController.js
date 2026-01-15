const Notifications = require("../models/notification");


exports.getNotificationsByAssignedHrId = async (req, res) => {
    const HrId = req.user._id;
    try {

        const notifications = await Notifications.find({ receiverId: HrId }).sort({ createdAt: -1 });
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