import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseUrl } from "../api";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import "react-toastify/dist/ReactToastify.css";

import { ChevronDown } from "lucide-react";

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

const initialState = {
  name: "",
  email: "",
  mobile: "",
  domain: [],
  dob: "",
  degree: "",
  releventExp: "",
  experienceYears: "",
  preferredLocation: "",
  currentLocation: "",
  skills: [],
  availability: "",
  resume: null,
  vendorName: "",
  vendorEmail: "",
};

const ProfileSubmissionForm = () => {
  const { vendorId, jobId } = useParams();

  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile handling
    if (name === "mobile") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, mobile: cleaned }));

      setErrors((prev) => ({
        ...prev,
        mobile:
          cleaned && !validateMobile(cleaned)
            ? "Enter valid 10-digit mobile number"
            : "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      const updated = { ...prev };

      if (name === "email") {
        updated.email =
          value && !validateEmail(value) ? "Enter a valid email address" : "";
      }

      if (name === "dob") {
        updated.dob = value ? "" : "Date of birth is required";
      }

      if (name === "name") {
        updated.name = value.trim() ? "" : "Name is required";
      }

      return updated;
    });
  };

  const handleDomainChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      domain: selectedOptions || [],
    }));
    setErrors((prev) => ({ ...prev, domain: "" }));
  };

  const handleSkillsChange = (values) => {
    setFormData((prev) => ({
      ...prev,
      skills: values ? values.map((v) => v.label) : [],
    }));
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (name === "resume" && files?.length > 0) {
      const file = files[0];
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);

      try {
        const response = await axios.post(
          `${baseUrl}/api/upload_resume`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const uploadedPath = response.data?.file?.filePath;
        setFormData((prev) => ({ ...prev, resume: uploadedPath }));
        toast.success("Resume uploaded successfully");
      } catch (error) {
        toast.error("Resume upload failed");
        console.error("Upload error:", error);
      }
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateMobile = (mobile) => {
    const regex = /^[6-9]\d{9}$/; // Indian mobile numbers
    return regex.test(mobile);
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Enter a valid email address";

    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!validateMobile(formData.mobile))
      newErrors.mobile = "Enter valid 10-digit mobile number";
    if (formData.domain.length === 0)
      newErrors.domain = "Select at least one domain";
    if (!formData.experienceYears)
      newErrors.experienceYears = "Total experience is required";
    if (!formData.releventExp)
      newErrors.releventExp = "Relevant experience is required";
    if (!formData.preferredLocation.trim())
      newErrors.preferredLocation = "Preferred location is required";
    if (!formData.currentLocation.trim())
      newErrors.currentLocation = "Current location is required";

    if (!formData.availability)
      newErrors.availability = "Availability in days is required";
    if (!formData.resume) newErrors.resume = "Upload your resume";
    if (!formData.skills) newErrors.resume = "Skills is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields correctly");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    // setLoading(true);

    const cleanedData = {
      ...formData,

      domain: formData.domain.map((d) => d.value),

      skills: Array.isArray(formData.skills)
        ? formData.skills.join(", ")
        : formData.skills,
      jobsReferred: selectedJobs,
    };

    cleanedData.vendorId = vendorId;
    cleanedData.jobId = jobId;

    try {
      const res = await axios.post(
        `${baseUrl}/api/freelancer_registration`,
        cleanedData
      );

      toast.success("Application submitted successfully");
      setFormData(initialState);
      setSelectedJobs([]); // ✅ clear jobs
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-3 py-6">
      {" "}
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-md px-6 sm:px-10 py-6">
        {/* Title */}{" "}
        <h2 className="text-2xl text-center font-semibold mt-4 mb-6 text-gray-800 border-b pb-2">
          {" "}
          Candidate Profile Submission{" "}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium">
                Candidate Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">
                Candidate Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="text-sm font-medium">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${
                  errors.mobile ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.mobile && (
                <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium">
                Date of Birth
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="border mt-1 p-2 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">
                Degree <span className="text-red-500">*</span>
              </label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="border mt-1  px-3 py-2 rounded"
                required
              >
                <option value="">Select</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Domain */}
            <div>
              <label className="text-sm font-medium">
                Domain <span className="text-red-500">*</span>
              </label>
              <CreatableSelect
                isMulti
                options={domainOptions}
                value={formData.domain}
                onChange={handleDomainChange}
                className="mt-1 text-sm font-medium"
                placeholder="Select one or more domains"
              />
              {errors.domain && (
                <p className="text-xs text-red-500 mt-1">{errors.domain}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">
                Technical skills <span className="text-red-500">*</span>
              </label>
              <CreatableSelect
                isMulti
                options={SKILL_OPTIONS}
                value={formData.skills.map((s) => ({
                  label: s,
                  value: s,
                }))}
                onChange={handleSkillsChange}
                className="mt-1 text-sm font-medium"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="text-sm font-medium">
                Total Experience (Years) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${
                  errors.experienceYears ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.experienceYears && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.experienceYears}
                </p>
              )}
            </div>

            {/* Relevant Experience */}
            <div>
              <label className="text-sm font-medium">
                Relevant Experience (Years){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="releventExp"
                value={formData.releventExp}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${
                  errors.releventExp ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.releventExp && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.releventExp}
                </p>
              )}
            </div>

            {/* Preferred Location */}
            <div>
              <label className="text-sm font-medium">
                Preferred Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="preferredLocation"
                value={formData.preferredLocation}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${
                  errors.preferredLocation
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.preferredLocation && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.preferredLocation}
                </p>
              )}
            </div>

            {/* Current Location */}
            <div>
              <label className="text-sm font-medium">
                Current Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="currentLocation"
                value={formData.currentLocation}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${
                  errors.currentLocation ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.currentLocation && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.currentLocation}
                </p>
              )}
            </div>

            {/* Availability */}
            <div>
              <label className="text-sm font-medium">
                Availability (Days) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border p-2"
              />
            </div>

            {/* Resume Upload */}

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium">
                Vendor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${
                  errors.vendorName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.vendorName && (
                <p className="text-xs text-red-500 mt-1">{errors.vendorName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">
                Vendor Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="vendorEmail"
                value={formData.vendorEmail}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${
                  errors.vendorEmail ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.vendorEmail && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.vendorEmail}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium font-medium">
                Upload Resume (PDF / DOCX){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm font-medium"
              />
              {errors.resume && (
                <p className="text-xs text-red-500 mt-1">{errors.resume}</p>
              )}
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 bg-indigo-600 text-white rounded-lg shadow-md
                 hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSubmissionForm;
