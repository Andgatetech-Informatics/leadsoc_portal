const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
    isRead: { type: Boolean, default: false },
    entityType: { type: String, enum: ['notification', 'activity'] },
    AdditionalDate: { type: Date },
    message: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model("notification", notificationSchema);
