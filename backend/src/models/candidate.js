const mongoose = require("mongoose");

const remarkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      validate: {
        validator: function (v) {
          return /^[6-9]\d{9}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid mobile number`,
      },
    },
    degree: { type: String },
    domain: { type: Array },
    dob: { type: String },
    graduationYear: { type: String },
    skills: { type: String },
    selfRating: { type: String },
    releventExp: { type: String },
    expIncludingTraining: { type: String },
    experienceYears: { type: String },
    currentCTC: { type: String },
    expectedCTC: { type: String },
    jobChangeReason: { type: String },
    interviewsAttended: { type: String },
    companiesAppliedSixMonths: { type: String },
    offerDetails: { type: String },
    individualRole: { type: String },
    foreignWork: { type: String },
    preferredLocation: { type: String },
    currentLocation: { type: String },
    availability: { type: String },
    bondWilling: { type: String },
    bondDetails: { type: String },
    poc: { type: String },
    resume: { type: String },
    isExperienced: { type: Boolean, default: false },
    isAssigned: { type: Boolean, default: false },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    status: {
      type: String,
      enum: [
        "pending",
        "assigned",
        "onhold",
        "shortlisted",
        "pipeline",
        "bench",
        "approved",
        "review",
        "employee",
        "trainee",
        "deployed",
        "rejected",
        "hired"
      ],
      default: "pending",
      required: true,
    },
    remark: [remarkSchema],
    consentForm: { type: String },
    isConsentUploaded: { type: Boolean, default: false },
    isDummy: { type: Boolean, default: false },
    isReferred: { type: Boolean, default: false },
    vendorReferred: { type: Boolean, default: false },
    vendorName: { type: String },
    vendorEmail: {
      type: String,
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      lowercase: true,
      trim: true
    },
    vendorManagerName: { type: String },
    vendorManagerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    jobsReferred: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    onboardingInitiated: { type: Boolean, default: false },
    onboardingInitiateDate: { type: Date, default: null },
    joiningDate: { type: Date },
    organizarionId: { type: String },
    joiningFeedback: { type: String, default: "" },
    designation: { type: String },
    candidateType: { type: String, enum: ["internal", "external", "vendor"], default: "internal" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

candidateSchema.index({ status: 1, candidateType: 1, updatedAt: -1 });
candidateSchema.index({ jobsReferred: 1 });
candidateSchema.index({ name: "text", email: "text", skills: "text" });

module.exports = mongoose.model("candidate", candidateSchema);
