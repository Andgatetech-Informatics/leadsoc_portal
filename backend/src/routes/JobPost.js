const express = require("express");
const router = express.Router();
const {
  jobPost,
  getJobs,
  addCandidatesToJob,
  getshortlistedProfilesToMe,
  getShortlistedCandidatesForjobId,
  getJobsForBu,
  getReferredCandidatesForBujobId,
  approveSelectedCandidatesByBu,
  getshortlistedProfilesForBu,
  addCandidatesToJobForBu,
  getJobsSales
} = require("../controllers/jobPostController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/jobpost", jobPost);
router.get("/getjobs", getJobs);
router.get("/getjobsSales", getJobsSales);
router.get("/getjobsbu", getJobsForBu);
router.get("/shortlisted_candidates_activeJobs/:jobId", getShortlistedCandidatesForjobId);
router.get("/shortlisted_candidates_activeJobs_bu/:jobId", getReferredCandidatesForBujobId);
router.post("/addcandidatestojob/:jobId", addCandidatesToJob);
router.post("/addcandidatestojobforBu/:jobId", authMiddleware, addCandidatesToJobForBu);
router.get("/getshortlistedProfilesToMe", authMiddleware, getshortlistedProfilesToMe)
router.get("/getshortlistedProfilesForBu", authMiddleware, getshortlistedProfilesForBu)
router.put("/approve_candidates/:jobId", authMiddleware, approveSelectedCandidatesByBu);

module.exports = router;
