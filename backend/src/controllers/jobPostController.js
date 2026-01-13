const Job = require("../models/jobPost");
const Organization = require("../models/company");
const Candidate = require("../models/candidate");
const { ObjectId } = require("mongoose").Types;
const generateJobId = require("../utils/generateJobId");
const mongoose = require("mongoose");
const NotificationModel = require("../models/notification");
const { jobRequirementEmailHtml } = require("../utils/emailTemplates");
const transporter = require("../utils/mailer");


exports.jobPost = async (req, res) => {
  try {
    const {
      title,
      location,
      organizationName,
      clientName,
      skills,
      priority,
      experienceMin,
      experienceMax,
      noOfPositions,
      description,
      postDate,
      endDate,
      workType,
      jobType,
      budgetMin,
      budgetMax,
      domain
    } = req.body;

    if (
      !title?.trim() ||
      !organizationName?.trim() ||
      !location?.trim() ||
      !description?.trim(),
      !domain?.length
    ) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    /* ================= ORGANIZATION CHECK ================= */
    const org = await Organization.findOne({
      organization: organizationName.trim(),
    });

    if (!org) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    /* ================= GENERATE JOB ID ================= */
    const jobId = await generateJobId();

    /* ================= CREATE JOB ================= */
    const jobPayload = {
      jobId,
      title: title.trim(),
      location: location.trim(),
      organization: org.organization,
      organizationId: org._id,
      clientName: clientName?.trim(),
      skills,
      priority,
      experienceMin,
      experienceMax,
      noOfPositions,
      description: description.trim(),
      postDate,
      endDate,
      workType,
      jobType,
      budgetMin,
      budgetMax,
      createdBy: req.user._id,
      domain: domain,
    };

    const job = await Job.create(jobPayload);

    return res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job,
    });
  } catch (error) {
    console.error("Job Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.updateJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updates = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const existingJob = await Job.findById(jobId);
    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const payload = {};

    /* -------- Budget Update Logic -------- */
    const modifiedMin = Number(updates.modifiedBudgetMin);
    const modifiedMax = Number(updates.modifiedBudgetMax);

    if (modifiedMin < 0 || modifiedMax < 0 || (modifiedMax < modifiedMin)) {
      return res.status(400).json({
        success: false,
        message: "Invalid modified budget values",
      });
    }

    if (
      (!isNaN(modifiedMin) &&
        modifiedMin !== existingJob.budgetMin) || (!isNaN(modifiedMax) &&
          modifiedMax !== existingJob.budgetMax)
    ) {
      payload.modifiedBudgetMin = modifiedMin;
      payload.modifiedBudgetMax = modifiedMax;
    }

    /* -------- Visibility Update -------- */
    if (
      updates.visibility !== undefined &&
      updates.visibility !== existingJob.visibility
    ) {
      payload.visibility = updates.visibility;
    }

    /* -------- Generic Field Updates -------- */
    const allowedFields = ["title", "description", "skills", "location"];

    allowedFields.forEach((field) => {
      if (
        updates[field] !== undefined &&
        updates[field] !== existingJob[field]
      ) {
        payload[field] = updates[field];
      }
    });

    /* -------- No Changes -------- */
    if (Object.keys(payload).length === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes detected",
      });
    }

    console.log("Update Payload:", payload);

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      payload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });

  } catch (error) {
    console.error("Job Update Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


exports.getJobs = async (req, res) => {
  try {
    const {
      searchTerm,
      location,
      organization,
      experience,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (organization) filter.organizationId = organization;

    // Experience filter (minimum experience based on the selected option)
    if (experience && experience !== "All") {
      const minExp = parseInt(experience, 10);

      // Adjust the filter to match jobs with experience greater than or equal to minExp
      filter.experienceMin = { $gte: minExp };
    }

    if (searchTerm) {
      filter.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { location: { $regex: searchTerm, $options: "i" } },
        { priority: { $regex: searchTerm, $options: "i" } },
        { status: { $regex: `^${searchTerm}$`, $options: "i" } },
      ];
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const totalJobs = await Job.countDocuments(filter);

    const jobs = await Job.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate(
        "candidates.candidate",
        "name email mobile skills experienceYears resume status"
      )
      .populate("candidates.addedByHR", "firstName lastName email role");

    jobs.forEach((job) => {
      job.candidates = job.candidates.filter(
        (c) => c.candidate && c.candidate.status !== "rejected"
      );
    });

    res.status(200).json({
      totalJobs,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalJobs / limitNumber),
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
exports.getJobsTa = async (req, res) => {
  try {
    const {
      searchTerm,
      location,
      organization,
      experience,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = {
      visibility: {
        $in: ["ta", "all"]
      }
    };

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (organization) filter.organizationId = organization;

    // Experience filter (minimum experience based on the selected option)
    if (experience && experience !== "All") {
      const minExp = parseInt(experience, 10);

      // Adjust the filter to match jobs with experience greater than or equal to minExp
      filter.experienceMin = { $gte: minExp };
    }

    if (searchTerm) {
      filter.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { location: { $regex: searchTerm, $options: "i" } },
        { priority: { $regex: searchTerm, $options: "i" } },
        { status: { $regex: `^${searchTerm}$`, $options: "i" } },
      ];
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const totalJobs = await Job.countDocuments(filter);

    const jobs = await Job.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate(
        "candidates.candidate",
        "name email mobile skills experienceYears resume status"
      )
      .populate("candidates.addedByHR", "firstName lastName email role");

    jobs.forEach((job) => {
      job.candidates = job.candidates.filter(
        (c) => c.candidate && c.candidate.status !== "rejected"
      );
    });

    res.status(200).json({
      totalJobs,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalJobs / limitNumber),
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getJobsVm = async (req, res) => {
  try {
    const {
      searchTerm,
      location,
      organization,
      experience,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = {
      visibility: {
        $in: ["vendor", "all"]
      }
    };

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (organization) filter.organizationId = organization;

    // Experience filter (minimum experience based on the selected option)
    if (experience && experience !== "All") {
      const minExp = parseInt(experience, 10);

      // Adjust the filter to match jobs with experience greater than or equal to minExp
      filter.experienceMin = { $gte: minExp };
    }

    if (searchTerm) {
      filter.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { location: { $regex: searchTerm, $options: "i" } },
        { priority: { $regex: searchTerm, $options: "i" } },
        { status: { $regex: `^${searchTerm}$`, $options: "i" } },
      ];
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const totalJobs = await Job.countDocuments(filter);

    const jobs = await Job.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate(
        "candidates.candidate",
        "name email mobile skills experienceYears resume status"
      )
      .populate("candidates.addedByHR", "firstName lastName email role");

    jobs.forEach((job) => {
      job.candidates = job.candidates.filter(
        (c) => c.candidate && c.candidate.status !== "rejected"
      );
    });

    res.status(200).json({
      totalJobs,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalJobs / limitNumber),
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.addCandidatesToJob = async (req, res) => {
  try {
    const { jobId } = req.params; // jobId from URL
    const { candidates, hrId } = req.body; // from POST body

    // Validate input
    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      return res
        .status(400)
        .json({ message: "candidates must be a non-empty array" });
    }
    if (!hrId) {
      return res.status(400).json({ message: "hrId is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    let added = [];
    let skipped = [];

    for (const candidateId of candidates) {
      const alreadyAdded = job.candidates.some(
        (c) => c.candidate.toString() === candidateId
      );

      if (alreadyAdded) {
        skipped.push(candidateId);
      } else {
        // Add to job
        job.candidates.push({
          candidate: candidateId,
          addedByHR: hrId,
        });
        added.push(candidateId);
      }

      // 🧩 Update Candidate Record for all candidates (added + skipped)
      await Candidate.findByIdAndUpdate(
        candidateId,
        {
          $set: { isReferred: true },
          $addToSet: { jobsReferred: jobId }, // prevents duplicates
        },
        { new: true }
      );
    }

    await job.save();

    res.status(200).json({
      message: "Candidates processed successfully",
      addedCount: added.length,
      skippedCount: skipped.length,
      added,
      skipped,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.addCandidatesToJobForBu = async (req, res) => {
  try {
    const { jobId } = req.params; // jobId from URL
    const { candidates, hrId } = req.body; // from POST body

    // Validate input
    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      return res
        .status(400)
        .json({ message: "candidates must be a non-empty array" });
    }
    if (!hrId) {
      return res.status(400).json({ message: "hrId is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    let added = [];
    let skipped = [];

    for (const candidateId of candidates) {
      const alreadyAdded = job.candidates.some(
        (c) => c.candidate.toString() === candidateId
      );

      if (alreadyAdded) {
        skipped.push(candidateId);
      } else {
        // Add to job
        job.candidates.push({
          candidate: candidateId,
          addedByHR: hrId,
          approvedByBU: true,
          BuApprovalDate: new Date(),
          BuApprovedBy: req.user._id,
        });
        added.push(candidateId);
      }

      // 🧩 Update Candidate Record for all candidates (added + skipped)
      await Candidate.findByIdAndUpdate(
        candidateId,
        {
          $set: { isReferred: true },
          $addToSet: { jobsReferred: jobId }, // prevents duplicates
        },
        { new: true }
      );
    }

    await job.save();

    await NotificationModel.create({
      title: `New users shortlisted for Job ${job.title}`,
      senderId: req.user._id,
      priority: "high",
      receiverId: job.createdBy,
      entityType: "notification",
      message: `You have shortlisted new candidates for the job "${job.title}".`,
      metadata: { jobId: job._id, candidatesAdded: added.length },
    });

    res.status(200).json({
      message: "Candidates processed successfully",
      addedCount: added.length,
      skippedCount: skipped.length,
      added,
      skipped,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getshortlistedProfilesToMe = async (req, res) => {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const search = req.query.search || "";
  const skip = (page - 1) * limit;
  const jobId = req.query.jobId;

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

    const total = await Candidate.countDocuments(query);

    const allShortlisted = await Candidate.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const referedCandidates = await Job.findById(jobId).select("candidates");

    const referedCandidateIds = referedCandidates
      ? referedCandidates.candidates.map((c) => c.candidate.toString())
      : [];

    const filteredShortlisted = allShortlisted.filter(
      (candidate) => !referedCandidateIds?.includes(candidate?._id?.toString())
    );

    return res.status(200).json({
      status: true,
      data: filteredShortlisted,
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

exports.getshortlistedProfilesForBu = async (req, res) => {
  const candidateType = req.query.candidateType || "internal";
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const search = req.query.search || "";
  const skip = (page - 1) * limit;
  const jobId = req.query.jobId;

  try {
    const query = {
      // assignedTo: user._id,
      status: { $in: ["shortlisted"] },
      candidateType: candidateType,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    };

    const total = await Candidate.countDocuments(query);

    const allShortlisted = await Candidate.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const referedCandidates = await Job.findById(jobId).select("candidates");

    const referedCandidateIds = referedCandidates
      ? referedCandidates.candidates.map((c) => c.candidate.toString())
      : [];

    const filteredShortlisted = allShortlisted.filter(
      (candidate) => !referedCandidateIds?.includes(candidate?._id?.toString())
    );

    return res.status(200).json({
      status: true,
      data: filteredShortlisted,
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

exports.getShortlistedCandidatesForjobId = async (req, res) => {
  const { jobId } = req.params;

  try {
    const shortlistedCandidates = await Job.aggregate([
      {
        $match: { _id: new ObjectId(jobId) }
      },
      {
        $unwind: "$candidates"
      },
      {
        $match: { "candidates.approvedByBU": { $eq: true } }
      },
      {
        $lookup: {
          from: "candidates",
          let: { userId: "$candidates.candidate" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] }
              }
            },
            {
              $match: { status: "shortlisted" }
            }
          ],
          as: "candidateDetails"
        }
      },
      {
        $unwind: "$candidateDetails"
      },
      {
        $project: {
          _id: "$candidateDetails._id",
          status: "$candidateDetails.status",
          firstName: {
            $arrayElemAt: [
              { $split: ["$candidateDetails.name", " "] },
              0
            ]
          },
          lastName: {
            $arrayElemAt: [
              { $split: ["$candidateDetails.name", " "] },
              1
            ]
          },
          email: "$candidateDetails.email",
          mobile: "$candidateDetails.mobile",
          experience: "$candidateDetails.experienceYears",
          skills: "$candidateDetails.skills",
          hrName: "$candidateDetails.poc",
          resumeUrl: "$candidateDetails.resume",
          addedAt: "$candidateDetails.updatedAt"
        }
      }
    ]);

    return res.status(200).json({
      status: true,
      message: "Shortlisted candidates fetched successfully",
      data: shortlistedCandidates
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


exports.getReferredCandidatesForBujobId = async (req, res) => {
  const { jobId } = req.params;
  const {
    page = 1,
    limit = 10,
    search = "",
    candidateType,
  } = req.query;


  const skip = (Number(page) - 1) * Number(limit);

  try {
    const shortlistedCandidates = await Job.aggregate([
      {
        $match: { _id: new ObjectId(jobId) }
      },
      {
        $unwind: "$candidates"
      },

      // 🔥 EXCLUDE BU-APPROVED CANDIDATES
      {
        $match: {
          $or: [
            { "candidates.approvedByBU": { $exists: false } },
            { "candidates.approvedByBU": false }
          ]
        }
      },

      {
        $lookup: {
          from: "candidates",
          let: { userId: "$candidates.candidate" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] },
                status: "shortlisted"
              }
            }
          ],
          as: "candidateDetails"
        }
      },
      {
        $unwind: {
          path: "$candidateDetails",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $match: {
          ...(candidateType && candidateType !== "all" && {
            "candidateDetails.candidateType": candidateType
          }),
          ...(search && {
            $or: [
              { "candidateDetails.name": { $regex: search, $options: "i" } },
              { "candidateDetails.email": { $regex: search, $options: "i" } },
              { "candidateDetails.mobile": { $regex: search, $options: "i" } },
              { "candidateDetails.skills": { $regex: search, $options: "i" } },
              { "candidateDetails.poc": { $regex: search, $options: "i" } },
            ]
          })
        }
      },
      {
        $project: {
          _id: "$candidateDetails._id",
          status: "$candidateDetails.status",
          name: "$candidateDetails.name",
          email: "$candidateDetails.email",
          mobile: "$candidateDetails.mobile",
          experience: "$candidateDetails.experienceYears",
          skills: "$candidateDetails.skills",
          hrName: "$candidateDetails.poc",
          resume: "$candidateDetails.resume",
          addedAt: "$candidateDetails.updatedAt",
          candidateType: "$candidateDetails.candidateType",
          jobTitle: "$title",
          isFreelancer: "$candidateDetails.isFreelancer",
          freelancerName: "$candidateDetails.freelancerName",
          FreelancerId: {
            firstName: "$freelancer.firstName",
            lastName: "$freelancer.lastName",
          },
        },
      },
      {
        $facet: {
          data: [
            { $sort: { addedAt: -1 } },
            { $skip: skip },
            { $limit: Number(limit) }
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      },
      {
        $project: {
          data: 1,
          total: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0]
          }
        }
      }
    ]);


    return res.status(200).json({
      status: true,
      message: "Shortlisted candidates fetched successfully",
      data: shortlistedCandidates[0].data,
      total: shortlistedCandidates[0].total,
      page: Number(page),
      limit: Number(limit),
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


exports.approveSelectedCandidatesByBu = async (req, res) => {
  const { jobId } = req.params;
  const { candidateIds } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid jobId.",
      });
    }

    if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({
        status: false,
        message: "candidateIds must be a non-empty array.",
      });
    }

    const candidateObjectIds = candidateIds
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));

    if (candidateObjectIds.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No valid candidateIds provided.",
      });
    }

    const job = await Job.findOneAndUpdate(
      { _id: jobId },
      {
        $set: {
          "candidates.$[c].approvedByBU": true,
          "candidates.$[c].BuApprovalDate": new Date(),
          "candidates.$[c].BuApprovedBy": req.user._id,
        },
      },
      {
        arrayFilters: [
          { "c.candidate": { $in: candidateObjectIds } },
        ],
        new: true,
      }
    );

    if (!job) {
      return res.status(404).json({
        status: false,
        message: "Job not found.",
      });
    }

    await NotificationModel.create({
      title: `Candidates approved for Job ${job.title}`,
      senderId: req.user._id,
      priority: "high",
      receiverId: job.createdBy,
      entityType: "notification",
      message: `BU has approved selected candidates for the job "${job.title}".`,
      metadata: {
        jobId: job._id,
        approvedCandidates: candidateObjectIds.length,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Candidates approved successfully.",
      approvedCount: candidateObjectIds.length,
    });

  } catch (error) {
    console.error("Error approving candidates:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to approve candidates.",
      error: error.message,
    });
  }
};

exports.sendJobEmailToVendor = async (req, res) => {
  const user = req.user;
  const { jobId, vendorEmails } = req.body;
  try {

    if (!jobId || !Array.isArray(vendorEmails) || vendorEmails.length === 0) {
      return res.status(400).json({
        status: false,
        message: "jobId and vendorEmails are required.",
      });
    }

    // Fetch job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        status: false,
        message: "Job not found.",
      });
    }

    const publicLink = `${process.env.FRONTEND_URL}/profile-submission-form/${user._id}/${job._id}`;

    const html = jobRequirementEmailHtml(job, user, publicLink, process.env.CompanyName);

    const info = await transporter.sendMail({
      from: `${process.env.CompanyName} <${process.env.SMTP_USER}>`,
      to: vendorEmails.join(","),
      subject: `Job Requirement | ${job.title} | ${job.location}`,
      html
    });

    if (info.rejected.length > 0) {
      return res.status(500).json({
        status: false,
        message: "Email rejected. Please provide a valid email.",
        error: `Rejected for: ${info.rejected.join(", ")}`,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Job email sent to vendors successfully."
    });
  } catch (error) {
    console.error("Error sending job email to vendor:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to send job email to vendor.",
      error: error.message,
    });
  }
}

