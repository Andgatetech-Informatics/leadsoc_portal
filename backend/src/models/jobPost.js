const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "On Hold", "Filled"],
      default: "Active",
    },
    organization: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organization",
      required: true,
    },
    clientName: {
      type: String,
      trim: true,
      default: "",
    },
    experienceMin: {
      type: Number,
      required: true,
      min: 0,
    },
    experienceMax: {
      type: Number,
      required: true,
      min: 0,
    },
    noOfPositions: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    skills: {
      type: [String],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    postDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    candidates: [
      {
        candidate: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "candidate",
        },
        addedByHR: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        approvedByBU: {
          type: Boolean,
          default: false,
        },
        BuApprovalDate: {
          type: Date,
        },
        BuApprovedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    visibility: {
      type: String,
      enum: ["ta", "bu", "vendor", "all "],
      default: "bu",
    },
    workType: {
      type: String,
      enum: ["Hybrid", "Remote", "Onsite"],
      default: "Onsite"
    },
    jobType: {
      type: String,
      enum: ["Full Time", "Contract"],
      default: "Full Time"
    },
    budgetMin: {
      type: Number,
    },
    budgetMax: {
      type: Number,
    },
    modifiedBudgetMin : {
      type : Number
    },
    modifiedBudgetMax : {
      type : Number
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.models.Job || mongoose.model("Job", JobSchema);
