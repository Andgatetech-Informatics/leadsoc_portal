const Incentive = require("../models/incentive");
const Job = require("../models/jobPost");
const mongoose = require("mongoose");

exports.addIncentive = async (req, res) => {
  try {
    const user = req.user;
    const freelancerId = user._id;
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid jobId" });
    }
    const job = await Job.findById(jobId).select("referralAmount");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const referralAmount = job.referralAmount || 0;

    let incentive = await Incentive.findOne({ freelancerId });

    if (!incentive) {
      incentive = await Incentive.create({
        freelancerId,
        jobIds: [jobId],
        incentiveAmount: referralAmount,
      });

      return res.status(201).json({
        message: "Incentive record created",
        incentive,
      });
    }

    if (incentive.jobIds.includes(jobId)) {
      return res.status(400).json({
        message: "Job already added",
      });
    }

    incentive.jobIds.push(jobId);

    const jobs = await Job.find(
      { _id: { $in: incentive.jobIds } },
      { referralAmount: 1 }
    );

    const totalIncentive = jobs.reduce(
      (sum, job) => sum + (job.referralAmount || 0),
      0
    );

    incentive.incentiveAmount = totalIncentive;

    await incentive.save();

    return res.status(200).json({
      message: "Job added successfully",
      incentiveAmount: totalIncentive,
      incentive,
    });
  } catch (error) {
    console.error("Error in addIncentive:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getTotalIncentive = async (req, res) => {
  try {
    const user = req.user;
    const freelancerId = user._id;

    const incentive = await Incentive.findOne({ freelancerId }).populate(
      "jobIds",
      "title referralAmount"
    );

    if (!incentive) {
      return res.status(200).json({
        totalIncentive: 0,
        jobCount: 0,
        jobs: [],
      });
    }

    return res.status(200).json({
      totalIncentive: incentive.incentiveAmount,
      jobCount: incentive.jobIds.length,
      jobs: incentive.jobIds,
    });
  } catch (error) {
    console.error("Error in getTotalIncentive:", error);
    return res.status(500).json({ error: error.message });
  }
};
