const mongoose = require("mongoose");
const OnboardingForm = require("../models/onboardingForm");
const Candidate = require("../models/candidate");
const transporter = require("../utils/mailer");
const { OnboardingEmailTemplate } = require("../utils/emailTemplates");
const { ReviewRequestEmailTemplate } = require("../utils/emailTemplates")
const moment = require("moment");
const NotificationModel = require("../models/notification");

exports.createOnboarding = async (req, res) => {
  try {
    const newForm = new OnboardingForm({
      ...req.body,
      candidateId: req.body.candidateId,
    });
    await newForm.save();

    const updatedCandidateStatus = await Candidate.findByIdAndUpdate(
      req.body.candidateId,
      { status: "review" },
      { new: true }
    );

    await NotificationModel.create({
      title: `Onboarding form submitted by ${updatedCandidateStatus.name}`,
      receiverId: updatedCandidateStatus.assignedTo,
      priority: "high",
      entityType: "hr_notification",
      message: `Please review onboarding details for candidate ${updatedCandidateStatus.name}.`,
      metadata: { candidateId: updatedCandidateStatus._id },
    });

    res.status(201).json({
      success: true,
      message: "Onboarding form submitted successfully",
      data: newForm,
    });
  } catch (error) {
    console.error("Error creating onboarding form:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Duplicate field value entered: ${Object.keys(
          error.keyValue
        ).join(", ")}`,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error while creating onboarding form",
    });
  }
};

exports.getAllOnboardings = async (req, res) => {
  try {
    const forms = await OnboardingForm.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: forms.length,
      data: forms,
    });
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getOnboardingCandidateById = async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Fetch onboarding form by candidateId and populate candidate details
    const onboardingData = await OnboardingForm.findOne({
      candidateId,
    }).populate({
      path: "candidateId",
      select:
        "name email mobile status designation isExperienced assignedTo joiningDate",
    });

    if (!onboardingData) {
      return res.status(404).json({
        success: false,
        message: "Onboarding data not found for this candidate",
      });
    }

    res.status(200).json({
      success: true,
      data: onboardingData,
    });
  } catch (error) {
    console.error("❌ Error fetching onboarding data by candidateId:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching onboarding data",
      error: error.message,
    });
  }
};

exports.sendOfferLetter = async (req, res) => {
  const { user } = req;
  const { candidateId } = req.params;
  const { joiningDate, designation } = req.body;
  const file = req.file;

  if (!file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  if (!joiningDate || !designation) {
    return res.status(400).json({
      success: false,
      message: "Joining date and designation are required",
    });
  }

  try {
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      {
        status: "pipeline",
        onboardingInitiated: true,
        onboardingInitiateDate: new Date(),
        joiningDate: joiningDate,
        designation: designation
      },
      { new: true }
    );
    if (!candidate) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }

    const onboardingLink = candidate.isExperienced
      ? `${process.env.FRONTEND_URL}/experienced-onboarding-form/${candidateId}`
      : `${process.env.FRONTEND_URL}/fresher-onboarding-form/${candidateId}`;


    const companyFirstName = process.env.CompanyName.split(" ")[0];
    const candidateFirstName = candidate.name.split(" ")[0];

    const emailContent = {
      from: `"Andgate HR Team" <${process.env.SMTP_USER}>`,
      to: candidate.email,
      subject: `Employment offer_form ${companyFirstName}_${candidateFirstName}_${candidate.designation}`,
      // subject: `Welcome to ${process.env.CompanyName}! Offer for ${candidate.designation}`,
      text: `Dear ${candidate.name}, we are excited to offer you the position of ${candidate.designation} at ${process.env.CompanyName}.`,
      html: OnboardingEmailTemplate(
        candidate.name,
        process.env.CompanyName,
        candidate.designation,
        moment(candidate.joiningDate).format("MMMM D, YYYY"),
        onboardingLink,
        user.email || process.env.DummyHrEmail,
        new Date().getFullYear()
      ),
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype,
        },
      ],
    };

    await transporter.sendMail(emailContent);
    return res.status(200).json({
      success: true,
      data: candidate,
      message: "Offer letter sent successfully",
    });
  } catch (error) {
    console.error("❌ Error sending offer letter:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send offer letter",
      error: error.message,
    });
  }
};

exports.reinitializeOnboardingForm = async (req, res) => {
  const { user, params: { candidateId }, body: { reason } } = req;

  if (!reason || reason.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Reason for resubmission is required" });
  }


  try {

    const deleteExistingForm = await OnboardingForm.findOneAndDelete({ candidateId });
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { onboardingReinitiated: true },
      { new: true }
    );

    if (!candidate) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }

    const onboardingLink = candidate.isExperienced
      ? `${process.env.FRONTEND_URL}/experienced-onboarding-form/${candidateId}`
      : `${process.env.FRONTEND_URL}/fresher-onboarding-form/${candidateId}`;


    const companyFirstName = process.env.CompanyName.split(" ")[0];
    const candidateFirstName = candidate.name.split(" ")[0];

    const emailContent = {
      from: `"Andgate HR Team" <${process.env.SMTP_USER}>`,
      to: candidate.email,
      subject: `Employment offer_form ${companyFirstName}_${candidateFirstName}_${candidate.designation}`,
      text: `Dear ${candidate.name}, we are excited to offer you the position of ${candidate.designation} at ${process.env.CompanyName}.`,
      html: ReviewRequestEmailTemplate(
        candidate.name,
        reason,
        process.env.CompanyName,
        onboardingLink,
        user.email || process.env.DummyHrEmail,
        new Date().getFullYear()
      )
    };

    await transporter.sendMail(emailContent);
    return res.status(200).json({
      success: true,
      data: candidate,
      message: "Sent successfully",
    });
  } catch (error) {
    console.log("❌ Error reinitializing onboarding form:", error);
    res.status(500).json({
      success: false,
      message: "Server error while reinitializing onboarding form",
      error: error.message,
    });
  }
}
