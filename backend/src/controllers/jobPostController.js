const Job = require("../models/jobPost");
const Organization = require("../models/company");
const Candidate = require("../models/candidate");
const { ObjectId } = require("mongoose").Types;
const generateJobId = require("../utils/generateJobId");

exports.jobPost = async (req, res) => {
  try {
    const {
      title,
      location,
      organizationName,
      clientName,
      experienceMin,
      experienceMax,
      noOfPositions,
      description,
      postDate,
      endDate,
      skills,
      priority,
      status,
      referralAmount,
      visibility,
    } = req.body;

    if (
      !title?.trim() ||
      !organizationName?.trim() ||
      !location?.trim() ||
      !description?.trim() ||
      !visibility
    ) {
      return res.status(400).json({
        message:
          "Title, organization name, location, description and visibility are required.",
      });
    }

    const org = await Organization.findOne({
      organization: organizationName.trim(),
    });

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    /* ✅ Year-Wise Auto-Increment Job ID */
    const jobId = await generateJobId();

    const job = await Job.create({
      jobId,
      title: title.trim(),
      location: location.trim(),
      organization: org.organization,
      clientName: clientName?.trim(),
      experienceMin,
      experienceMax,
      noOfPositions,
      description: description.trim(),
      postDate,
      endDate,
      skills,
      priority,
      status,
      referralAmount,
      visibility: visibility.toLowerCase(),
    });

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

    if (organization) filter.organization = organization.trim();

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
      .sort({ createdAt: -1 })
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
