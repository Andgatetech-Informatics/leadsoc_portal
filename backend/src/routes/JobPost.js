const express = require("express");
const router = express.Router();
const {
  jobPost,
  getJobs,
  addCandidatesToJob,
  getshortlistedProfilesToMe,
  getShortlistedCandidatesForjobId
} = require("../controllers/jobPostController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/jobpost", jobPost);
router.get("/getjobs", getJobs);
router.get("/shortlisted_candidates_activeJobs/:jobId", getShortlistedCandidatesForjobId);
router.post("/addcandidatestojob/:jobId", addCandidatesToJob);
router.get("/getshortlistedProfilesToMe", authMiddleware, getshortlistedProfilesToMe)

module.exports = router;
