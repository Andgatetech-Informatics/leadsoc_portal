const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  createOnboarding,
  getAllOnboardings,
  sendOfferLetter,
  getOnboardingCandidateById,
  reinitializeOnboardingForm
} = require("../controllers/onboardingFormController");

const upload = multer({ storage: multer.memoryStorage() });
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/onboarding-form/create", createOnboarding);
router.get("/onboarding-form/all", getAllOnboardings);
router.get("/onboarding-form/candidate/:candidateId", getOnboardingCandidateById);
router.post("/reinitiate-onboarding-form/:candidateId", authMiddleware, reinitializeOnboardingForm);
router.post(
  "/send_offer_letter/:candidateId",
  authMiddleware,
  upload.single("file"),
  sendOfferLetter
);

module.exports = router;
``