const express = require("express");
const router = express.Router();
const {
  jobPost,
  getJobs,
  addCandidatesToJob,
  getshortlistedProfilesToMe,
  getShortlistedCandidatesForjobId,
  getReferredCandidatesForBujobId,
  approveSelectedCandidatesByBu,
  addCandidatesToJobForBu,
  updateJobPost,
  getJobsTa,
  getJobsVm,
  sendJobEmailToVendor,
  getReferredCandidatesByCandidateId,
  getBenchCandidatesByJobId
} = require("../controllers/jobPostController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/jobpost", authMiddleware, jobPost);
router.patch("/update/:jobId", authMiddleware, updateJobPost);
router.get("/getjobs", getJobs);
router.get("/getjobTa", getJobsTa);
router.get("/getjobVm", getJobsVm);
router.get("/shortlisted_candidates_activeJobs/:jobId", getShortlistedCandidatesForjobId);
router.get("/shortlisted_candidates_activeJobs_bu/:jobId", getReferredCandidatesForBujobId);
router.post("/addcandidatestojob/:jobId", authMiddleware, addCandidatesToJob);
router.post("/addcandidatestojobforBu/:jobId", authMiddleware, addCandidatesToJobForBu);
router.get("/getshortlistedProfilesToMe", authMiddleware, getshortlistedProfilesToMe)
router.get("/getBenchCandidatesByJobId/:jobId/:candidateType", authMiddleware, getBenchCandidatesByJobId);
router.put("/approve_candidates/:jobId", authMiddleware, approveSelectedCandidatesByBu);
router.post("/send_job_email_to_vendor", authMiddleware, sendJobEmailToVendor);
router.get("/get_referred_candidates/:candidateId", authMiddleware, getReferredCandidatesByCandidateId);

module.exports = router;
