const mongoose = require("mongoose");

const onboardingForm = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true },
    mobile: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    emergencyContactPerson: { type: String, required: true },
    emergencyContact: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    country: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    dob: { type: Date, required: true },
    maritalStatus: {
      type: String,
      required: true,
      enum: ["Single", "Married", "Divorced", "Widowed", ""],
      default: "",
    },
    dateOfMarriage: { type: Date },
    bloodGroup: { type: String, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
      required: true,
    },

    // Work Info
    domain: { type: String, required: true },
    internship: { type: String },
    totalExperience: { type: String },
    relevantExperience: { type: String },
    aadharNumber: { type: Number, required: true },
    panNumber: { type: String, required: true },
    lastCompanyName: { type: String },
    lastCompanyStreet: { type: String },
    lastCompanyCity: { type: String },
    lastCompanyPincode: { type: Number },
    lastCompanyState: { type: String },

    lastDesignation: { type: String },
    lastCompanyHrContact: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[0-9]{10,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    lastCompanyHrEmail: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      lowercase: true,
      trim: true,
    },
    immediateManagerContact: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[0-9]{10,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    immediateManagerEmail: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      lowercase: true,
      trim: true,
    },
    lastWorkingDay: { type: Date },
    joiningDate: { type: Date, required: true },
    offeredDesignation: { type: String, required: true },
    pfNumber: { type: String },
    orientationLocation: { type: String, required: true },
    bankName: { type: String, required: true },
    accountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    confirmAccountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    branchName: { type: String, required: true },

    // File uploads (store URLs or filenames)
    tenthMarksheet: { type: String, required: true },
    twelfthMarksheet: { type: String, required: true },
    graduationMarksheet: { type: String, required: true }, // multiple files
    postGraduation: { type: String },
    lastCompanyOfferLetter: { type: String },
    lastCompanyExperienceLetter: { type: String },
    lastCompanyRelievingLetter: { type: String },
    lastCompanySalarySlips: [{ type: String }],
    cancelledCheque: { type: String, required: true },
    aadhar: { type: String, required: true },
    pan: { type: String, required: true },
    passport: { type: String },
    signedOfferLetter: { type: String, required: true },
    passportPhoto: { type: String, required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "candidate" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("onboarding", onboardingForm);
