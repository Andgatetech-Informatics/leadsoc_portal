import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl, companyName } from "../../api";
import { useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const experienceSteps = ["Experience Info", "Tech & Offers"];
const SKILL_OPTIONS = [
  "Python",
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "DFT",
  "PD",
  "DV",
  "PDK",
  "RLT",
  "Analog Mixed Signaling",
  "Analog Layout Design",
  "Design Engineer",
  "Synthesis",
  "Physical Verification",
  "Embedded",
  "FPGA",
  "STA",
  "Software",
].map((s) => ({ label: s, value: s }));

const domainOptions = [
  { value: "DFT", label: "DFT" },
  { value: "PD", label: "PD" },
  { value: "DV", label: "DV" },
  { value: "PDK", label: "PDK" },
  { value: "Analog Mixed Signaling", label: "Analog Mixed Signaling" },
  { value: "Analog Layout Design", label: "Analog Layout Design" },
  { value: "Design Engineer", label: "Design Engineer" },
  { value: "Synthesis", label: "Synthesis" },
  { value: "Physical Verification", label: "Physical Verification" },
  { value: "Embedded", label: "Embedded" },
  { value: "FPGA", label: "FPGA" },
  { value: "Design", label: "Design" },
  { value: "Analog Design", label: "Analog Design" },
  { value: "Formal Verification", label: "Formal Verification" },
  { value: "Software", label: "Software" },
  { value: "STA", label: "STA" },
];

const CandidateRegistration = () => {
  const [isExperienced, setIsExperienced] = useState(false);
  const [step, setStep] = useState(0);
  const [experienceStep, setExperienceStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [hrList, setHrList] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
  });

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateMobile = (mobile) => {
    const regex = /^[6-9]\d{9}$/; // Indian mobile numbers
    return regex.test(mobile);
  };

  const initialFormState = {
    email: "",
    poc: "",
    name: "",
    mobile: "",
    graduationYear: "",
    degree: "",
    domain: [],
    currentLocation: "",
    preferredLocation: "",
    availability: "",
    resume: "",
    dob: "",
    experienceYears: "",
    selfRating: "",
    individualRole: "",
    bondDetails: "",
    bondWilling: "",
    releventExp: "",
    expIncludingTraining: "",
    jobChangeReason: "",
    interviewsAttended: "",
    foreignWork: "",
    skills: [],
    companiesAppliedSixMonths: "",
    currentCTC: "",
    expectedCTC: "",
    offerDetails: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleSkillsChange = (values) => {
    setFormData((prev) => ({
      ...prev,
      skills: values ? values.map((v) => v.label) : [],
    }));
  };

  const handleDomainChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      domain: selectedOptions || [],
    }));
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "resume" && files?.length > 0) {
      const file = files[0];
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);

      try {
        const response = await axios.post(
          `${baseUrl}/api/upload_resume`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const uploadedPath = response.data?.file?.filePath;

        setFormData((prev) => ({
          ...prev,
          resume: uploadedPath,
        }));
      } catch (error) {
        console.error("Upload error:", error.response?.data || error.message);
      }

      return;
    }

    // ===== Email Validation =====
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Enter a valid email address",
      }));
    }

    // ===== Mobile Validation =====
    if (name === "mobile") {
      setErrors((prev) => ({
        ...prev,
        mobile: validateMobile(value)
          ? ""
          : "Enter valid 10-digit mobile number",
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateExperienceForm = () => {
    const {
      experienceYears,
      selfRating,
      individualRole,
      bondDetails,
      bondWilling,
      releventExp,
      expIncludingTraining,
      jobChangeReason,
      interviewsAttended,
      foreignWork,
      currentCTC,
      expectedCTC,
      offerDetails,
      companiesAppliedSixMonths,
    } = formData;

    if (
      !experienceYears ||
      !selfRating ||
      !individualRole ||
      !bondDetails ||
      !bondWilling ||
      !releventExp ||
      !expIncludingTraining ||
      !jobChangeReason ||
      !interviewsAttended ||
      !foreignWork ||
      !currentCTC ||
      !expectedCTC ||
      !offerDetails ||
      !companiesAppliedSixMonths
    ) {
      toast.error("Please fill all required experience fields.");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setStep(1);
  };

  const fresherCandidateSubmit = async () => {
    setSubmitLoading(true);

    // Convert domain from array of { value, label } to comma-separated string
    const cleanedData = Object.fromEntries(
      Object.entries({
        ...formData,
        skills: Array.isArray(formData.skills)
          ? formData.skills.join(", ")
          : formData.skills,
        domain: Array.isArray(formData.domain)
          ? formData.domain.map((d) => d.value)
          : [formData.domain],
      }).filter(
        ([, value]) =>
          value !== null &&
          value !== undefined &&
          (Array.isArray(value) ? value.length > 0 : value !== "")
      )
    );

    if (cleanedData.poc === "others") {
      delete cleanedData.poc;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/api/fresher_registration`,
        cleanedData
      );

      const { status, message, error } = response.data;

      if (response.status === 200 && status) {
        setSubmitted(true);
      } else {
        toast.error(message || "Something went wrong.");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ?? error?.response?.data?.message;
      toast.error(errorMessage || "Failed to register fresher candidate.");
      console.error(
        "Fresher Candidate Submit Error:",
        errorMessage || error.message
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const experienceCandidateSubmit = async () => {
    if (!isExperienced || !validateExperienceForm()) return;

    setSubmitLoading(true);

    // Create a copy to avoid mutating original state
    const payload = {
      ...formData,
      skills: Array.isArray(formData.skills)
        ? formData.skills.join(", ")
        : formData.skills,
      domain: Array.isArray(formData.domain)
        ? formData.domain.map((d) => d.value)
        : [formData.domain],
    };

    try {
      const response = await axios.post(
        `${baseUrl}/api/experienced_registration`,
        payload
      );

      const { status, message } = response.data ?? {};

      if (response.status === 200 && status) {
        handleSuccessfulSubmission();
      } else {
        toast.error(message || "Something went wrong.");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ??
        error?.response?.data?.message ??
        error.message;

      toast.error(errorMessage || "Failed to register experienced candidate.");
      console.error("Experienced Candidate Submit Error:", errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSuccessfulSubmission = () => {
    setFormData(initialFormState);
    setIsExperienced(false);
    setStep(0);
    setExperienceStep(0);
    setSubmitted(true);
    toast.success("Registration submitted successfully!");
  };

  useEffect(() => {
    const getAllHrs = async () => {
      try {
        let response = await axios.get(`${baseUrl}/api/auth/get_all_ta`);

        if (response.status === 200) {
          setHrList(response.data.data);
        }
      } catch (error) {
        console.log("Error fetching Hr list:", error.message);
      }
    };
    getAllHrs();
  }, []);

  const renderStyledStepper = () => {
    return (
      <div className="w-full flex items-center justify-between relative mb-6 px-2">
        {experienceSteps.map((label, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1 relative z-10"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${experienceStep >= index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
                }`}
            >
              {index + 1}
            </div>
            <span className="text-sm text-center mt-2 font-medium text-gray-800">
              {label}
            </span>
          </div>
        ))}

        {experienceSteps.map((_, index) => {
          if (index === experienceSteps.length - 1) return null;

          const leftPos = `calc(${(index / (experienceSteps.length - 1)) * 100
            }% + 16px)`;
          const segmentWidth = `calc(${100 / (experienceSteps.length - 1)
            }% - 32px)`;

          let background = "#d1d5db";
          if (experienceStep > index) {
            background = "#2563eb";
          } else if (experienceStep === index) {
            background = "linear-gradient(to right, #2563eb 50%, #d1d5db 50%)";
          }

          return (
            <div
              key={index}
              className="absolute top-4 h-0.5 z-0 transition-all duration-300"
              style={{
                left: leftPos,
                width: segmentWidth,
                background,
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex  justify-center overflow-hidden">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-4 space-y-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Candidate Registration Form
        </h2>

        {submitted ? (
          <div className=" mx-auto mt-10">
            {/* Success Message */}
            <div className="text-center text-green-700 text-lg font-semibold py-6">
              {/* Company Logo */}
              <div className="text-center mb-6 ">
                <img
                  src="/leadsoclogo.png"
                  alt="AndGate Informatics Pvt Ltd"
                  className="mx-auto h-12"
                />
              </div>

              <div className="mt-4">
                Your form has been successfully submitted! 🎉
              </div>
            </div>

            {/* Main Content */}
            <div className="text-center text-gray-800 space-y-4">
              <div className="text-lg font-medium">
                Thank you for registering with <strong>{companyName}</strong>
              </div>
              <div className="text-base">
                Our HR team will review your details shortly. If your profile
                matches our requirements, you will hear from us via email or
                phone.
              </div>
              <div className="text-base">
                In the meantime, feel free to explore our website or connect
                with us on LinkedIn for the latest updates and opportunities.
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-sm text-gray-500 italic mt-6 text-center">
              We appreciate your interest and wish you the very best in your
              career journey!
            </div>

            {/* Optional Call to Action */}
            <div className="flex justify-center mt-6">
              <a
                href="https://www.linkedin.com/company/leadsoc-technologies-india-pvt-ltd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 font-semibold transition duration-300"
              >
                Connect with us on LinkedIn
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Step 0: Fresher Form */}
            {step === 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                  <div className="flex flex-col">
                    <label>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`border px-3 py-2 rounded ${errors.email ? "border-red-500" : ""
                        }`}
                      required
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label>
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      maxLength={10}
                      className={`border px-3 py-2 rounded ${errors.mobile ? "border-red-500" : ""
                        }`}
                      required
                    />
                    {errors.mobile && (
                      <span className="text-red-500 text-sm">
                        {errors.mobile}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label>
                      Date of Birth
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      onChange={handleChange}
                      className="border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label>
                      Degree <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      className="border px-3 py-2 rounded"
                      required
                    >
                      <option value="">Select</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label>
                      Year of completion <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="month"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      className="border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Domain <span className="text-red-500">*</span>
                    </label>

                    <CreatableSelect
                      isMulti
                      name="domain"
                      options={domainOptions}
                      value={formData.domain}
                      onChange={handleDomainChange}
                      className="text-sm"
                      classNamePrefix="select"
                      placeholder="Select or create domains"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label>
                      Technical skills, tools, strengths{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <CreatableSelect
                      isMulti
                      options={SKILL_OPTIONS}
                      value={formData.skills.map((s) => ({
                        label: s,
                        value: s,
                      }))}
                      onChange={handleSkillsChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label>
                      Current Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="currentLocation"
                      value={formData.currentLocation}
                      onChange={handleChange}
                      className="border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label>
                      Preferred Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="preferredLocation"
                      value={formData.preferredLocation}
                      onChange={handleChange}
                      className="border px-1 py-2  rounded"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col">
                    <label>
                      Availability / Notice Period{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="border px-1 py-2 rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      POC in ANDGATE (TA’s Name){" "}
                      <span className="text-gray-400 text-xs">(optional)</span>
                    </label>

                    <select
                      name="poc"
                      value={formData.poc}
                      onChange={handleChange}
                      className="border px-3 py-2 rounded"
                    >
                      <option value="">Select</option>

                      {hrList &&
                        hrList.map((e) => (
                          <option key={e._id} value={e._id}>
                            {e.firstName} {e.lastName}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label>
                      Upload Resume <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="resume"
                      onChange={handleChange}
                      className="border px-1 py-2 rounded"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-3 ">
                    <label className="text-sm font-medium text-gray-700">
                      Are you an experienced candidate?
                    </label>
                    <input
                      type="checkbox"
                      checked={isExperienced}
                      onChange={() => setIsExperienced(!isExperienced)}
                      className="h-5 w-5 text-blue-600"
                    />
                  </div>

                  <div className="text-end mt-2">
                    {isExperienced ? (
                      <button
                        onClick={handleNextStep}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center justify-center w-full sm:w-auto"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitLoading}
                        onClick={fresherCandidateSubmit}
                        className={`text-white px-6 py-2 rounded-lg inline-flex items-center justify-center font-semibold text-sm transition-all duration-300 w-full sm:w-auto ${submitLoading
                            ? "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                      >
                        {submitLoading ? "Submitting..." : "Submit"}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Step 1: Experience Form */}
        {step === 1 && isExperienced && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Experience Details
            </h3>
            {renderStyledStepper()}

            {experienceStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="flex flex-col">
                  <label>
                    Total Experience ( Format: 2.6 = 2 yrs 6 mos){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                  />{" "}
                  Years
                </div>

                <div className="flex flex-col">
                  <label>
                    Skills Self-Rating (e.g., 7/10){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="selfRating"
                    value={formData.selfRating}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label>
                    Can handle Individual Contributor role?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="individualRole"
                    value={formData.individualRole}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label>
                    Bond with current employer?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bondDetails"
                    value={formData.bondDetails}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label>
                    Willing to buyback/break bond?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bondWilling"
                    value={formData.bondWilling}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Maybe">Maybe</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label>
                    Experience Including training{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="expIncludingTraining"
                    value={formData.expIncludingTraining}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label>
                    Relevant Experience
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    name="releventExp"
                    value={formData.releventExp}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                  />
                </div>
              </div>
            )}

            {experienceStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="flex flex-col">
                  <label>
                    Reason for job change / Motivation{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jobChangeReason"
                    value={formData.jobChangeReason}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label>
                    Last 4 interviews attended{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="interviewsAttended"
                    value={formData.interviewsAttended}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label>
                    Foreign work experience?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="foreignWork"
                    value={formData.foreignWork}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label>
                    Current CTC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="currentCTC"
                    value={formData.currentCTC}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label>
                    Expected CTC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="expectedCTC"
                    value={formData.expectedCTC}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label>
                    Offers in hand (Company & CTC){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="offerDetails"
                    value={formData.offerDetails}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label>
                    Companies you have applied within last 6 months
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    name="companiesAppliedSixMonths"
                    value={formData.companiesAppliedSixMonths}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-20">
              <button
                onClick={() =>
                  experienceStep === 0
                    ? setStep(0)
                    : setExperienceStep(experienceStep - 1)
                }
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                Back
              </button>
              {experienceStep < experienceSteps.length - 1 ? (
                <button
                  onClick={() => setExperienceStep(experienceStep + 1)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitLoading}
                  onClick={experienceCandidateSubmit}
                  className={`text-white px-6 py-2 rounded-lg inline-flex items-center justify-center font-semibold text-sm transition-all duration-300 ${submitLoading
                      ? "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                >
                  {submitLoading ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateRegistration;
