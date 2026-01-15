const express = require("express");
const router = express.Router();
const portalController = require("../controllers/portalController");
const uploadFile = require("../middlewares/upload");
const obtainFile = require("../middlewares/obtain_file");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post(
  "/upload_resume",
  uploadFile.single("file"),
  portalController.uploadResume
);
router.post("/dummy_registration", portalController.dummyRegistration);
router.post("/fresher_registration", portalController.fresherRegistration);
router.post(
  "/freelancer_registration",
  portalController.freelancerRegistration
);
router.post(
  "/experienced_registration",
  portalController.experiencedRegistration
);
router.get(
  "/get_all_candidates",
  authMiddleware,
  portalController.getAllUnassignedCanditates
);
router.patch(
  "/assign_candidate_to_me/:candidateId",
  authMiddleware,
  portalController.assignedToMe
);
router.get(
  "/get_all_assigned_to_me",
  authMiddleware,
  portalController.getAssignedCanditatesToMe
);
router.get(
  "/get_all_shortlisted_candidates",
  authMiddleware,
  portalController.getAllShortlistedCanditates
);
router.get(
  "/get_all_assigned_shortlisted_to_me",
  authMiddleware,
  portalController.getAllAsssignedAndShortlisted
);
router.get(
  "/get_all_shortlisted_candidates_to_particular_hr",
  authMiddleware,
  portalController.getShortlistedCanditatesToParticularHr
);
router.get(
  "/get_all_assigned",
  authMiddleware,
  portalController.getAllAssignedCanditates
);
router.patch(
  "/change_candidate_status/:candidateId",
  authMiddleware,
  portalController.statusChange
);
router.patch(
  "/add_remark/:candidateId",
  authMiddleware,
  portalController.addRemark
);
router.post(
  "/upload_consent/:candidateId",
  obtainFile.single("file"),
  authMiddleware,
  portalController.uploadConsentForm
);
router.get(
  "/candidate_details/:candidateId",
  portalController.getCandidateDetails
);
router.get(
  "/get_assigned_hr_to_candidate/:hrId",
  authMiddleware,
  portalController.getAssignedHrToCandidate
);
router.get(
  "/bench_candidates",
  authMiddleware,
  portalController.getHiredCandidates
);

// Onboarding Routes
router.post(
  "/initiate_onboarding/:candidateId",
  authMiddleware,
  portalController.initiateOnboarding
);
router.get(
  "/get_onboarding_candidates",
  authMiddleware,
  portalController.getOnboardingCandidates
);
// router.post('initiate_onboarding/:candidateId', authMiddleware, portalController.initiateOnboardingForm);

//Freelance Recruiter Routes
router.get(
  "/candidates/vendor_manager",
  authMiddleware,
  portalController.getVenderManagerCandidates
);

router.get(
  "/freelancer_profiles_to_refered/:freelancerId/:jobId",
  portalController.freelancerProfileToBeRefered
);

router.get("/freelance/hr/:hrId", portalController.getFreelanceCandidatesByHR);

router.get(
  "/all_freelancer_candidates",
  portalController.getAllFreelanceCandidates
);

router.patch(
  "/changeAssignedHR/:id",
  authMiddleware,
  portalController.changeAssignedHR
);

router.get("/candidates_statuswise", authMiddleware, portalController.filterCandidatesStatusWise)

module.exports = router;
