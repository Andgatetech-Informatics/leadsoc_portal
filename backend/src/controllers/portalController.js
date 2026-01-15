const UploadModel = require("../models/upload");
const path = require("path");
const CandidateModel = require("../models/candidate");
const User = require("../models/User");
const transporter = require("../utils/mailer");
const { htmlTemplate, rejectCandidate } = require("../utils/emailTemplates");
const NotificationModel = require("../models/notification");
const Job = require("../models/jobPost");

exports.getAllUnassignedCanditates = async (req, res) => {
  const search = req.query.search;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  const searchConditions = search
    ? {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { domain: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
        { experienceYears: { $regex: search, $options: "i" } },
      ],
    }
    : {};

  // Build date range filter if provided
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) {
      dateFilter.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      // set endDate to the end of the day
      dateFilter.createdAt.$lte = new Date(
        new Date(endDate).setHours(23, 59, 59, 999)
      );
    }
  }

  const baseFilter = {
    isAssigned: false,
    status: "pending",
    $or: [{ vendorReferred: false }, { vendorReferred: { $exists: false } }],
  };

  const filter = {
    ...baseFilter,
    ...searchConditions,
    ...dateFilter,
  };

  try {
    const [registrationForms, total] = await Promise.all([
      CandidateModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),

      CandidateModel.countDocuments({
        ...baseFilter,
        ...searchConditions,
        ...dateFilter,
      }),
    ]);

    return res.status(200).json({
      status: true,
      data: registrationForms,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching unassigned candidates:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch unassigned candidates.",
      error: error.message,
    });
  }
};

exports.getAssignedCanditatesToMe = async (req, res) => {
  const user = req.user;

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 6, 1);
  const skip = (page - 1) * limit;

  const search = (req.query.search || "").trim();
  const domainParam = req.query.domain;
  const status = (req.query.status || "").trim();
  const experience = (req.query.experience || "").trim();

  try {
    const matchStage = {
      assignedTo: user._id,
      vendorReferred: { $ne: true },
    };

    if (!status || status.toLowerCase() === "all") {
      matchStage.status = { $nin: ["rejected", "shortlisted"] };
    } else {
      matchStage.status = status;
    }

    if (domainParam) {
      const domainFilter = Array.isArray(domainParam)
        ? domainParam
        : domainParam
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean);

      if (domainFilter.length > 0) {
        matchStage.domain = { $in: domainFilter };
      }
    }

    if (search) {
      const regex = new RegExp(search, "i");
      matchStage.$or = [{ name: regex }, { email: regex }, { mobile: regex }];
    }

    let experienceExpr = null;

    if (experience) {
      if (experience.toLowerCase() === "fresher") {
        // If you use a boolean flag for freshers
        matchStage.isExperienced = false;
      } else if (experience.includes("-")) {
        // e.g. "1-3"
        const [minStr, maxStr] = experience.split("-");
        const min = Number(minStr);
        const max = Number(maxStr);

        if (!Number.isNaN(min) && !Number.isNaN(max)) {
          experienceExpr = {
            $and: [
              { $gte: ["$experienceNum", min] },
              { $lt: ["$experienceNum", max] },
            ],
          };
        }
      } else if (experience.endsWith("+")) {
        // e.g. "5+"
        const min = Number(experience.replace("+", ""));
        if (!Number.isNaN(min)) {
          experienceExpr = { $gte: ["$experienceNum", min] };
        }
      } else {
        // Fallback: exact match (if you ever send "2" etc from UI)
        const exact = Number(experience);
        if (!Number.isNaN(exact)) {
          experienceExpr = { $eq: ["$experienceNum", exact] };
        }
      }
    }

    // -------- Base pipeline (used for both count & data) --------
    const basePipeline = [{ $match: matchStage }];

    if (experienceExpr) {
      basePipeline.push(
        {
          $addFields: {
            // SAFE conversion: trim + convert, ignore invalid values
            experienceNum: {
              $convert: {
                input: {
                  $trim: {
                    input: "$experienceYears", // e.g. "8 " -> "8"
                  },
                },
                to: "double",
                onError: null, // if "N/A", "", etc.
                onNull: null,
              },
            },
          },
        },
        {
          $match: {
            $expr: experienceExpr,
          },
        }
      );
    }

    // -------- Count with same filters --------
    const countResult = await CandidateModel.aggregate([
      ...basePipeline,
      { $count: "total" },
    ]);

    const total = countResult[0]?.total || 0;

    // -------- Data aggregation --------
    const pipeline = [
      ...basePipeline,

      // Lookup latest matching event for this candidate
      {
        $lookup: {
          from: "events",
          let: { candidateId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    // join on candidateId
                    {
                      $eq: [
                        { $toString: "$candidate.candidateId" },
                        { $toString: "$$candidateId" },
                      ],
                    },
                    // status in [pending, submitted, approved]
                    {
                      $in: ["$status", ["pending", "submitted", "approved"]],
                    },
                  ],
                },
              },
            },
            // get the LATEST event for this candidate (by event createdAt)
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
          ],
          as: "matchingEvents",
        },
      },

      // Add:
      // - latestEvent: the event object (or null)
      // - isEventPending: true if there is at least one matching event
      {
        $addFields: {
          latestEvent: { $arrayElemAt: ["$matchingEvents", 0] },
          isEventPending: { $gt: [{ $size: "$matchingEvents" }, 0] },
        },
      },

      // Clean internal fields
      {
        $project: {
          matchingEvents: 0, // remove temp array
          experienceNum: 0,
        },
      },

      // Sort & paginate candidates
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const allAssigned = await CandidateModel.aggregate(pipeline);

    return res.status(200).json({
      status: true,
      data: allAssigned,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Error fetching assigned candidates:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch assigned candidates.",
      error: error.message,
    });
  }
};

// Shortlisted Candidates for Particular HR with Pagination and Search
exports.getShortlistedCanditatesToParticularHr = async (req, res) => {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const query = {
    assignedTo: user._id,
    status: "shortlisted",
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { mobile: { $regex: search, $options: "i" } },
      { domain: { $regex: search, $options: "i" } },
      { status: { $regex: search, $options: "i" } },
      { experienceYears: { $regex: search, $options: "i" } },
    ],
  };

  try {
    const total = await CandidateModel.countDocuments(query);
    const allShortlisted = await CandidateModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      status: true,
      data: allShortlisted,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching shortlisted candidates:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch shortlisted candidates.",
      error: error.message,
    });
  }
};
exports.getAllShortlistedCanditates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search?.trim() || "";
    const candidateType = req.query.candidateType;

    const matchStage = {
      status: "shortlisted",
    };

    if (candidateType !== "all") {
      matchStage.candidateType = candidateType;
    }

    if (search) {
      const orConditions = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { domain: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
        { experienceYears: { $regex: search, $options: "i" } },
      ];

      const asNumber = Number(search);
      if (!isNaN(asNumber)) {
        orConditions.push({ experienceYears: asNumber });
      }

      matchStage.$or = orConditions;
    }

    const result = await CandidateModel.aggregate([
      { $match: matchStage },

      { $sort: { updatedAt: -1 } },

      {
        $facet: {
          data: [
            {
              '$unwind': {
                'path': '$jobsReferred'
              }
            }, {
              '$lookup': {
                'from': 'jobs',
                'localField': 'jobsReferred',
                'foreignField': '_id',
                'as': 'jobDetails'
              }
            }, {
              '$unwind': {
                'path': '$jobDetails'
              }
            },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          totalCount: [
            { $count: "count" },
          ],
        },
      },
    ]);

    const data = result[0]?.data || [];
    const total = result[0]?.totalCount[0]?.count || 0;

    return res.status(200).json({
      status: true,
      data,
      totalCount: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching shortlisted candidates:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch shortlisted candidates.",
      error: error.message,
    });
  }
};


exports.getAllAsssignedAndShortlisted = async (req, res) => {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const search = req.query.search || "";
  const skip = (page - 1) * limit;

  try {
    const query = {
      assignedTo: user._id,
      status: { $in: ["shortlisted"] },
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    };

    const total = await CandidateModel.countDocuments(query);

    const allAssigned = await CandidateModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      status: true,
      data: allAssigned,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching assigned candidates:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch assigned candidates.",
      error: error.message,
    });
  }
};

exports.getAllAssignedCanditates = async (req, res) => {
  const search = req.query.search?.trim();
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  // Date filter on updatedAt
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.updatedAt = {};
    if (startDate) {
      dateFilter.updatedAt.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.updatedAt.$lte = new Date(
        new Date(endDate).setHours(23, 59, 59, 999)
      );
    }
  }

  try {
    const pipeline = [
      {
        $match: {
          isAssigned: true,
          ...dateFilter,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$user" },
    ];

    // Search filter on HR name, candidate name/email, status
    if (search) {
      const searchRegex = new RegExp(search, "i");
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: searchRegex } }, // Candidate Name
            { email: { $regex: searchRegex } }, // Candidate Email
            { status: { $regex: searchRegex } }, // Candidate Status
            { "user.firstName": { $regex: searchRegex } }, // HR First Name
            { "user.lastName": { $regex: searchRegex } }, // HR Last Name
          ],
        },
      });
    }

    // Count total filtered documents
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await CandidateModel.aggregate(countPipeline);
    const totalCount = countResult[0]?.total || 0;

    // Apply sorting, pagination
    pipeline.push({ $sort: { updatedAt: -1 } });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const candidates = await CandidateModel.aggregate(pipeline);

    return res.status(200).json({
      status: true,
      data: candidates,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error fetching assigned candidates:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch assigned candidates.",
      error: error.message,
    });
  }
};

exports.uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const ext = path
    .extname(req.file.originalname)
    .toLowerCase()
    .replace(".", "");

  const allowedTypes = ["pdf", "doc", "docx"];
  if (!allowedTypes.includes(ext)) {
    return res.status(400).json({ error: "Invalid file type" });
  }

  try {
    const uploadDoc = new UploadModel({
      fileName: req.file.originalname,
      fileType: ext,
      filePath: req.file.path,
    });

    await uploadDoc.save();

    res.status(200).json({
      status: true,
      file: {
        fileName: uploadDoc.fileName,
        filePath: uploadDoc.filePath,
      },
    });
  } catch (err) {
    console.error("Upload save error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.uploadConsentForm = async (req, res) => {
  const user = req.user;
  try {
    const { candidateId } = req.params;
    const { consentRequired } = req.body;

    if (!candidateId) {
      return res.status(400).json({ error: "Candidate ID is required" });
    }

    // Normalize consentRequired value
    const isConsentRequired =
      consentRequired === true || consentRequired === "true";

    // If consent is NOT required → just update status
    if (!isConsentRequired) {
      await CandidateModel.findByIdAndUpdate(
        candidateId,
        { status: "shortlisted" },
        { new: true }
      );

      return res.status(200).json({
        status: true,
        message: "Candidate shortlisted successfully.",
      });
    }

    // Consent is required → validate file
    if (!req.file) {
      return res.status(400).json({ error: "Consent form PDF is required" });
    }

    const fileExt = path.extname(req.file.originalname).toLowerCase();

    if (fileExt !== ".pdf") {
      return res.status(400).json({
        error: "Invalid file type. Only PDF files are allowed",
      });
    }

    // Convert file buffer to base64
    const base64Pdf = `data:application/pdf;base64,${req.file.buffer.toString(
      "base64"
    )}`;

    // Update candidate with consent form
    const updatedCandidate = await CandidateModel.findByIdAndUpdate(
      candidateId,
      {
        status: "shortlisted",
        consentForm: base64Pdf,
        isConsentUploaded: true,
      },
      { new: true }
    );

    if (user.role === "vendor") {
      await NotificationModel.create({
        title: `New candidate shortlisted by the ${user.firstName} ${user.lastName}`,
        senderId: user._id,
        priority: "high",
        // receiverId: job.createdBy,
        entityType: "bu_notification",
        message: `New vendor candidate is shortlisted by ${user.firstName} ${user.lastName}.`,
        metadata: { candidateId: updatedCandidate._id },
      });
    }

    return res.status(200).json({
      status: true,
      message: "Consent form uploaded successfully",
    });
  } catch (error) {
    console.error("Upload consent form error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.fresherRegistration = async (req, res) => {
  const {
    availability,
    degree,
    domain,
    email,
    graduationYear,
    mobile,
    name,
    poc,
    preferredLocation,
    currentLocation,
    resume,
    skills,
    dob,
  } = req.body;

  const requiredFields = {
    name,
    email,
    mobile,
    degree,
    domain,
    graduationYear,
    resume,
    availability,
    preferredLocation,
    currentLocation,
    skills,
    dob,
  };

  const missingFields = Object.entries(requiredFields)
    .filter(
      ([_, value]) =>
        !value || (typeof value === "string" && value.trim() === "")
    )
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: false,
      message: `The following fields are required: ${missingFields.join(", ")}`,
      missingFields,
    });
  }

  try {
    const existingCandidate = await CandidateModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (
      existingCandidate &&
      existingCandidate.mobile.trim() === mobile.trim()
    ) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 2);

      if (
        existingCandidate.status === "rejected" &&
        existingCandidate.updatedAt >= sixMonthsAgo
      ) {
        return res.status(403).json({
          success: false,
          message: "You cannot apply again within 6 months of being rejected.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "You have already applied.",
      });
    }

    const candidateData = {
      availability,
      degree,
      domain,
      email,
      graduationYear,
      mobile,
      name,
      poc,
      preferredLocation,
      currentLocation,
      resume,
      skills,
      dob,
      ...(poc && { assignedTo: poc, isAssigned: true }),
    };

    if (poc) {
      let user = await User.findById(poc);
      candidateData.poc = user.firstName + " " + user.lastName;
    }

    const candidate = new CandidateModel(candidateData);
    await candidate.save();

    // 📧 Send mail
    const personalizedHtml = htmlTemplate
      .replace(/{{candidateName}}/g, candidate.name)
      .replace(/{{company}}/g, process.env.CompanyName || "")
      .replace(/{{companyEmail}}/g, process.env.SMTP_USER || "")
      .replace(/{{year}}/g, new Date().getFullYear());

    const mailOptions = {
      from: `"Andgate HR Team" <${process.env.SMTP_USER}>`,
      to: candidate.email,
      subject: "Thanks for applying to Andgate",
      text: `Dear ${candidate.name},\n\nYour application has been accepted. We will contact you soon with next steps.\n\n- Andgate HR Team`,
      html: personalizedHtml,
    };

    const info = await transporter.sendMail(mailOptions);

    if (info.rejected.length > 0) {
      return res.status(500).json({
        status: false,
        message: "Email rejected, Please provide valid Email.",
        error: `Email rejected for: ${info.rejected.join(", ")}`,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Registration Successful.",
      candidateId: candidate._id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.experiencedRegistration = async (req, res) => {
  const {
    availability,
    bondDetails,
    bondWilling,
    companiesAppliedSixMonths,
    currentCTC,
    degree,
    domain,
    email,
    expIncludingTraining,
    expectedCTC,
    experienceYears,
    foreignWork,
    graduationYear,
    individualRole,
    interviewsAttended,
    jobChangeReason,
    mobile,
    name,
    offerDetails,
    poc,
    preferredLocation,
    currentLocation,
    releventExp,
    resume,
    selfRating,
    skills,
    dob,
  } = req.body;

  const requiredFields = {
    availability,
    bondDetails,
    bondWilling,
    companiesAppliedSixMonths,
    currentCTC,
    degree,
    domain,
    email,
    expIncludingTraining,
    expectedCTC,
    experienceYears,
    foreignWork,
    graduationYear,
    individualRole,
    interviewsAttended,
    jobChangeReason,
    mobile,
    name,
    offerDetails,
    preferredLocation,
    currentLocation,
    releventExp,
    resume,
    selfRating,
    skills,
    dob,
  };

  const missingFields = [];

  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: false,
      message: `The following fields are required: ${missingFields.join(", ")}`,
      missingFields,
    });
  }

  try {
    const existingCandidate = await CandidateModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (
      existingCandidate &&
      existingCandidate.mobile.trim() === mobile.trim()
    ) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 3);

      if (
        existingCandidate.status === "rejected" &&
        existingCandidate.updatedAt >= sixMonthsAgo
      ) {
        return res.status(403).json({
          success: false,
          message: "You cannot apply again within 6 months of being rejected.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "You have already applied.",
      });
    }

    const candidate = new CandidateModel({
      availability,
      bondDetails,
      bondWilling,
      companiesAppliedSixMonths,
      currentCTC,
      degree,
      domain,
      email,
      expIncludingTraining,
      expectedCTC,
      experienceYears,
      foreignWork,
      graduationYear,
      individualRole,
      interviewsAttended,
      jobChangeReason,
      mobile,
      name,
      offerDetails,
      preferredLocation,
      currentLocation,
      releventExp,
      resume,
      selfRating,
      skills,
      dob,
      isExperienced: true,
    });

    if (poc) {
      try {
        const user = await User.findById(poc);
        if (user) {
          candidate.poc = `${user.firstName} ${user.lastName}`; // set full name
          candidate.assignedTo = user._id;
          candidate.isAssigned = true;
        }
      } catch (err) {
        console.error("Failed to find user for poc ID:", err);
      }
    }

    await candidate.save();

    const personalizedHtml = htmlTemplate
      .replace(/{{candidateName}}/g, candidate.name)
      .replace(/{{company}}/g, process.env.CompanyName || "")
      .replace(/{{companyEmail}}/g, process.env.SMTP_USER || "")
      .replace(/{{year}}/g, new Date().getFullYear());

    const mailOptions = {
      from: `"Andgate HR Team" <${process.env.SMTP_USER}>`,
      to: candidate.email,
      subject: "Thanks for applying to Andgate",
      text: `Dear ${candidate.name},\n\nYour application has been accepted. We will contact you soon with next steps.\n\n- Andgate HR Team`,
      html: personalizedHtml,
    };

    const info = await transporter.sendMail(mailOptions);

    if (info.rejected.length > 0) {
      return res.status(500).json({
        status: false,
        message: "Email rejected, Please provide valid Email.",
        error: `Email rejected for: ${info.rejected.join(", ")}`,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Registration Successful.",
      candidateId: candidate._id,
    });
  } catch (error) {
    console.error("Registration save error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.assignedToMe = async (req, res) => {
  const user = req.user;
  const candidateId = req.params.candidateId;

  try {
    const candidate = await CandidateModel.findOneAndUpdate(
      {
        _id: candidateId,
      },
      {
        assignedTo: user._id,
        isAssigned: true,
        poc: user.firstName + " " + user.lastName,
      },
      {
        new: true,
      }
    );

    if (!candidate) {
      return res.status(404).json({
        status: false,
        message: "Candidate not found or not assigned to you.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Candidate updated successfully.",
      candidate,
    });
  } catch (error) {
    console.error("Error updating assigned candidate:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to update assigned candidate.",
      error: error.message,
    });
  }
};

exports.statusChange = async (req, res) => {
  const user = req.user;
  const candidateId = req.params.candidateId;
  const { status } = req.body;

  try {
    const candidate = await CandidateModel.findOneAndUpdate(
      { _id: candidateId },
      { status },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({
        status: false,
        message: "Candidate not found or not assigned to you.",
      });
    }

    if (status === "shortlisted") {
      await NotificationModel.create({
        title: `${user.firstName} Shortlisted ${candidate.name}`,
        senderId: user._id,
        priority: "high",
        entityType: "activity",
        message: `Candidate ${candidate.name} has been shortlisted by ${user.firstName} ${user.lastName}.`,
        metadata: { candidateId: candidate._id },
      });
    }

    if (status === "bench") {
      await NotificationModel.create({
        title: `${user.firstName} Hired ${candidate.name} for Bench.`,
        senderId: user._id,
        priority: "high",
        entityType: "activity",
        message: `New candidate ${candidate.name} has been hired by ${user.firstName} ${user.lastName}.`,
        metadata: { candidateId: candidate._id },
      });
    }

    if (status === "rejected") {
      const rejectionEmail = {
        from: `"Andgate HR Team" <${process.env.SMTP_USER}>`,
        to: candidate.email,
        subject: `Thank You for Applying – ${process.env.CompanyName}`,
        text: `Dear ${candidate.name}, we appreciate your interest.`,
        html: rejectCandidate
          .replace(/{{candidateName}}/g, candidate.name)
          .replace(/{{organization}}/g, process.env.CompanyName)
          .replace(/{{year}}/g, new Date().getFullYear()),
      };

      try {
        await transporter.sendMail(rejectionEmail);
      } catch (emailError) {
        console.error("Error sending rejection email:", emailError);
      }
    }

    return res.status(200).json({
      status: true,
      message: "Candidate status updated successfully.",
      candidate,
    });
  } catch (error) {
    console.error("Error updating candidate status:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to update candidate status.",
      error: error.message,
    });
  }
};

exports.addRemark = async (req, res) => {
  const user = req.user;
  const candidateId = req.params.candidateId;
  const remark = req.body.remark;

  try {
    const candidate = await CandidateModel.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        status: false,
        message: "Candidate not found or not assigned to you.",
      });
    }
    candidate.remark.push({
      title: remark,
      by: user._id,
      name: user.firstName + " " + user.lastName,
      date: new Date(),
    });

    await candidate.save();

    return res.status(200).json({
      status: true,
      message: "Candidate remark updated successfully.",
      candidate,
    });
  } catch (error) {
    console.error("Error updating candidate remark:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to update candidate remark.",
      error: error.message,
    });
  }
};

exports.getCandidateDetails = async (req, res) => {
  const { candidateId } = req.params;
  try {
    const candidate = await CandidateModel.findById(candidateId).lean();

    if (!candidate) {
      return res.status(400).json({
        status: false,
        message: "Candidate Not available.",
      });
    }

    if (candidate.isReferred) {
      const referrerJobs = await Job.find({
        _id: { $in: candidate.jobsReferred },
      }).select("jobId title organization");

      candidate.referredJobDetails = referrerJobs;
    }

    return res.status(200).json({
      status: true,
      data: candidate,
    });
  } catch (error) {
    console.log("Failed to get Candidates", error);
    res.status(500).json({
      status: false,
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

exports.dummyRegistration = async (req, res) => {
  try {
    const {
      email,
      name,
      mobile,
      dob,
      degree,
      graduationYear,
      skills,
      currentLocation,
      preferredLocation,
      availability,
      resume,
      isDummy,
    } = req.body;

    // Check if email or mobile already exists
    const existingCandidate = await CandidateModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingCandidate) {
      return res.status(400).json({
        status: false,
        message:
          existingCandidate.email === email
            ? "Email already registered."
            : "Mobile number already registered.",
      });
    }

    // Create candidate
    const candidateData = await CandidateModel.create({
      email,
      name,
      mobile,
      dob,
      degree,
      graduationYear,
      skills,
      currentLocation,
      preferredLocation,
      availability,
      resume,
      isDummy: true,
    });

    return res.status(200).json({
      status: true,
      message: "Registration successful.",
    });
  } catch (error) {
    console.error("Error Registration:", error);
    return res.status(500).json({
      status: false,
      message: "Failed Registration.",
      error: error.message,
    });
  }
};

exports.getAssignedHrToCandidate = async (req, res) => {
  const { hrId } = req.params;
  try {
    const user = await User.findById(hrId).select(
      "firstName lastName email role"
    );
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "HR not found.",
      });
    }
    return res.status(200).json({
      status: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching HR details:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch HR details.",
      error: error.message,
    });
  }
};

exports.initiateOnboarding = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const {
      position,
      joiningDate,
      organizarionId,
      joiningFeedback = "",
    } = req.body;
    const user = req.user;

    if (!candidateId) {
      return res.status(400).json({
        status: false,
        message: "Candidate ID is required.",
      });
    }

    if (!joiningDate || !organizarionId || !position) {
      return res.status(400).json({
        status: false,
        message: "Joining Date and Organization ID are required.",
      });
    }

    const candidate = await CandidateModel.findByIdAndUpdate(
      candidateId,
      {
        status: "approved",
        joiningDate,
        organizarionId,
        joiningFeedback,
        designation: position,
      },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({
        status: false,
        message: "Candidate not found.",
      });
    }

    // --- Create onboarding notification ---
    await NotificationModel.create({
      title: `Onboarding initiated for ${candidate.name}`,
      senderId: user._id,
      receiverId: candidate.assignedTo,
      priority: "high",
      entityType: "notification",
      message: `Please initiate Onboarding for candidate ${candidate.name}.`,
      metadata: { candidateId: candidate._id },
    });

    return res.status(200).json({
      status: true,
      message: `Onboarding successfully initiated for ${candidate.name}.`,
      data: candidate,
    });
  } catch (error) {
    console.error("[Onboarding] Failed to initiate:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to initiate onboarding.",
      error: error.message,
    });
  }
};

exports.getOnboardingCandidates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search?.trim() || "";
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const statusFilter = Array.isArray(status)
      ? status
      : typeof status === "string"
        ? status.split(",")
        : [];

    const query = {
      status: {
        $in: statusFilter
      },
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    const total = await CandidateModel.countDocuments(query);

    const onboardingCandidates = await CandidateModel.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: true,
      data: onboardingCandidates,
      totalCount: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching onboarding candidates:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch onboarding candidates.",
      error: error.message,
    });
  }
};

exports.getHiredCandidates = async (req, res) => {
  const user = req.user;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search?.trim() || "";
    const skip = (page - 1) * limit;

    const query = {
      assignedTo: user._id,
      status: "hired",
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    const total = await CandidateModel.countDocuments(query);

    const hiredCandidates = await CandidateModel.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: true,
      data: hiredCandidates,
      totalCount: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching onboarding candidates:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch onboarding candidates.",
      error: error.message,
    });
  }
};

// Freelance Recruiter - Get Candidates Assigned to Them
exports.getVenderManagerCandidates = async (req, res) => {
  try {
    const user = req.user;
    const vendorManagerId = user?._id;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    if (!vendorManagerId) {
      return res.status(400).json({
        success: false,
        message: "Vendor Manager ID is required",
      });
    }

    const excludedStatuses = [
      "shortlisted",
      "approved",
      "review",
      "employee",
      "trainee",
      "deployed",
      "rejected",
      "hired",
    ];

    const filter = {
      vendorReferred: true,
      vendorManagerId,
      status: { $nin: excludedStatuses },
    };

    const [total, candidates] = await Promise.all([
      CandidateModel.countDocuments(filter),
      CandidateModel.find(filter)
        .select(
          "name email mobile domain releventExp experienceYears currentLocation preferredLocation resume poc jobsReferred status availability createdAt remark"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      success: true,
      total,
      count: candidates.length,
      page,
      totalPages: Math.ceil(total / limit),
      candidates,
    });
  } catch (error) {
    console.error("Error fetching vendor manager candidates:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


exports.freelancerProfileToBeRefered = async (req, res) => {
  try {
    const { vendorManagerId, jobId } = req.params;

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Basic validations
    if (!vendorManagerId) {
      return res
        .status(400)
        .json({ success: false, message: "Freelancer ID is required" });
    }

    if (!jobId) {
      return res
        .status(400)
        .json({ success: false, message: "Job ID is required" });
    }

    const jobIdStr = String(jobId);

    // Only candidates of this freelancer that are NOT yet referred to this job
    // jobsReferred is assumed to be an array (or scalar) of job IDs.
    const filter = {
      vendorManagerId: vendorManagerId,
      jobsReferred: { $nin: [jobIdStr] }, // exclude already referred to this job
    };

    // Run count and query in parallel
    const [total, candidates] = await Promise.all([
      CandidateModel.countDocuments(filter),
      CandidateModel.find(filter)
        .select(
          "name email mobile domain releventExp experienceYears currentLocation preferredLocation resume poc jobsReferred status availability createdAt"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    if (!candidates.length) {
      return res.status(404).json({
        success: false,
        message: "No candidates available to be referred for this job",
      });
    }

    return res.status(200).json({
      success: true,
      total, // total NOT-yet-referred candidates
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      count: candidates.length, // count on this page
      candidates, // all are not referred to this job
    });
  } catch (error) {
    console.error("Error fetching candidates by freelancer:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.freelancerRegistration = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      domain,
      dob,
      degree,
      releventExp,
      experienceYears,
      currentLocation,
      preferredLocation,
      resume,
      skills,
      availability,
      jobId,
      vendorId,
      vendorName,
      vendorEmail
    } = req.body;

    /* -------------------- BASIC VALIDATION -------------------- */
    if (!name || !email || !mobile || !jobId || !vendorId) {
      return res.status(400).json({
        success: false,
        message: "Name, email, mobile, jobId and vendorId are required",
      });
    }

    /* -------------------- VALIDATE VENDOR -------------------- */
    const user = await User.findById(vendorId);
    console.log("user", user)
    if (!user || user.role !== "vendor") {
      return res.status(400).json({
        success: false,
        message: "Invalid freelancer/vendor ID.",
      });
    }

    /* -------------------- VALIDATE JOB -------------------- */
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    /* -------------------- CHECK EXISTING CANDIDATE -------------------- */
    const existingCandidate = await CandidateModel.findOne({
      $or: [{ email }, { mobile }],
    });

    /* =========================================================
       EXISTING CANDIDATE FLOW
    ========================================================= */
    if (existingCandidate) {
      const alreadyReferred = existingCandidate.jobsReferred?.some(
        (id) => id.toString() === job._id.toString()
      );

      if (alreadyReferred) {
        return res.status(400).json({
          success: false,
          message: "Candidate already referred to this job",
        });
      }

      // update candidate
      await CandidateModel.findByIdAndUpdate(existingCandidate._id, {
        $addToSet: { jobsReferred: job._id },
        vendorReferred: true,
        vendorManagerId: user._id,
        vendorManagerName: `${user.firstName} ${user.lastName}`,
      });

      // prevent duplicate job entry
      const alreadyInJob = job.candidates.some(
        (c) => c.candidate.toString() === existingCandidate._id.toString()
      );

      if (!alreadyInJob) {
        await Job.findByIdAndUpdate(job._id, {
          $push: {
            candidates: {
              candidate: existingCandidate._id,
              addedBy: user._id,
              addedAt: new Date(),
              approvedByBU: false,
            },
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Candidate referred successfully",
      });
    }

    /* =========================================================
       NEW CANDIDATE FLOW
    ========================================================= */
    const newCandidate = new CandidateModel({
      name,
      email,
      mobile,
      domain,
      dob,
      degree,
      releventExp,
      experienceYears,
      currentLocation,
      preferredLocation,
      resume,
      skills,
      availability,
      jobsReferred: [job._id],
      isReferred: true,
      candidateType: "vendor",
      vendorReferred: true,
      vendorName,
      vendorEmail,
      vendorManagerId: user._id,
      vendorManagerName: `${user.firstName} ${user.lastName}`,
    });

    await newCandidate.save();

    await Job.findByIdAndUpdate(job._id, {
      $push: {
        candidates: {
          candidate: newCandidate._id,
          addedBy: user._id,
          addedAt: new Date(),
          approvedByBU: false,
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Candidate created and referred successfully",
    });

  } catch (error) {
    console.error("Freelancer Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



exports.getFreelanceCandidatesByHR = async (req, res) => {
  try {
    const { hrId } = req.params;
    const { search = "", page = 1, limit = 10 } = req.query;

    // Validate HR user
    const hrUser = await User.findById(hrId);
    if (!hrUser || (hrUser.role !== "hr" && hrUser.role !== "ta")) {
      return res
        .status(404)
        .json({ success: false, message: "HR not found or invalid role" });
    }

    const hrFullName = `${hrUser.firstName} ${hrUser.lastName}`.trim();

    const searchFilter = search
      ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
        ],
      }
      : {};

    const query = {
      isFreelancer: true,
      poc: hrFullName,
      ...searchFilter,
    };

    const skip = (Number(page) - 1) * Number(limit);

    const [candidates, total] = await Promise.all([
      CandidateModel.find(
        query,
        "name email mobile domain dob degree releventExp experienceYears currentLocation preferredLocation resume vendorManagerId jobsReferred status availability createdAt"
      )
        .populate("vendorManagerId", "firstName lastName email role")
        .populate("jobsReferred", "title jobCode location status")
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(Number(limit)),
      CandidateModel.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      perPage: Number(limit),
      message:
        total > 0
          ? "Freelance candidates fetched successfully"
          : "No freelance candidates assigned to this HR",
      candidates,
    });
  } catch (error) {
    console.error("Error fetching freelance candidates:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching freelance candidates",
      error: error.message,
    });
  }
};

exports.getAllFreelanceCandidates = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filters = {
      vendorReferred: true,
      status: {
        $ne: "hired",
      },
    };

    // ✅ If search query exists, add OR conditions
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search, "i");
      filters.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex },
        { currentLocation: searchRegex },
        { preferredLocation: searchRegex },
        { domain: { $elemMatch: searchRegex } },
      ];
    }

    // ✅ Count total candidates (for pagination metadata)
    const total = await CandidateModel.countDocuments(filters);

    // ✅ Fetch paginated results
    const candidates = await CandidateModel.find(filters)
      .select(
        "name email mobile domain dob degree preferredLocation currentLocation availability resume assignedTo status jobsReferred createdAt poc releventExp experienceYears vendorManagerName remark"
      )
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      candidates,
    });
  } catch (error) {
    console.error("Error fetching freelance candidates:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching freelance candidates",
      error: error.message,
    });
  }
};

exports.changeAssignedHR = async (req, res) => {
  try {
    const candidateId = req.params.id;
    const user = req.user;
    const { assignedTo, poc } = req.body;

    if (!assignedTo || !poc) {
      return res.status(400).json({
        success: false,
        message: "Both assignedTo and poc fields are required",
      });
    }

    const updateData = {
      assignedTo,
      poc,
      isAssigned: true,
    };

    const updatedCandidate = await CandidateModel.findByIdAndUpdate(
      candidateId,
      updateData,
      { new: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    // Send notification to the newly assigned HR
    await NotificationModel.create({
      title: `New candidate assigned: ${updatedCandidate.name}`,
      receiverId: updatedCandidate.assignedTo._id,
      priority: "normal",
      entityType: "candidate-assigned",
      senderID: user._id,
      message: `You have been assigned a new candidate (${updatedCandidate.name}) by ${user.firstName}.`,
      metadata: {
        candidateId: updatedCandidate._id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      data: updatedCandidate,
    });
  } catch (error) {
    console.error("Assign Candidate Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.filterCandidatesStatusWise = async (req, res) => {
  const user = req.user;
  try {
    let {
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      search = "",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const filter = {};

    // 🟡 Status Filter
    if (status && status !== "all") {
      filter.status = status;
    }

    if (user.role === "vendor") {
      filter.vendorReferred = true;
    }

    // 🟡 Search Filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    // 🔥 Date validation
    const isValidDate = (d) => !isNaN(new Date(d).getTime());

    // 🟡 Date Range Filter (only if valid)
    if (
      startDate &&
      endDate &&
      isValidDate(startDate) &&
      isValidDate(endDate)
    ) {
      filter.updatedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // 🟢 Main Query
    const candidates = await CandidateModel.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    // 🟢 Total Count
    const totalCount = await CandidateModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      candidates,
    });
  } catch (error) {
    console.log("Fetching Candidates Status Wise:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
