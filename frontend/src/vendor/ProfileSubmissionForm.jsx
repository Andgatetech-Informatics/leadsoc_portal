import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseUrl } from "../api";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
  isAssigned: true,
  skills: [],
  poc: "",
  isReferred: true,
  jobsReferred: [],
  availability: "",
  resume: null,
  FreelancerId: "",
  isFreelancer: true,
};

const ProfileSubmissionForm = () => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(initialState);

  const [errors, setErrors] = useState({});
  const [hrList, setHrList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobList, setJobList] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const inputBase =
    "mt-1 w-full h-[42px] px-3 text-sm bg-white border border-gray-300 rounded-md flex items-center justify-between ";

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
    if (!formData.poc.trim()) newErrors.poc = "Select a POC";
    if (!formData.availability)
      newErrors.availability = "Availability in days is required";
    if (!formData.resume) newErrors.resume = "Upload your resume";
    if (!formData.skills) newErrors.resume = "Skills is required";
    if (!selectedJobs || selectedJobs.length === 0) {
      newErrors.jobsReferred = "Please select at least one job";
    }

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

    const hrDetails = hrList.find((hr) => hr._id === formData.poc);
    cleanedData.isAssigned = true;
    cleanedData.assignedTo = hrDetails?._id;
    cleanedData.poc = `${hrDetails?.firstName} ${hrDetails?.lastName}`;

    try {
      const res = await axios.post(
        `${baseUrl}/api/freelancer_registration`,
        cleanedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
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

  const handleSelect = (jobId) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const getAllTAs = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/auth/get_all_hr`);
      if (res.status === 200) setHrList(res.data.data);
    } catch (error) {
      console.log("Error fetching HR list:", error.message);
    }
  };

  const getAllJobs = async (search = "") => {
    try {
      const res = await axios.get(`${baseUrl}/api/getjobs`, {
        params: {
          searchTerm: search,
          limit: 4,
        },
      });

      if (res.status === 200) {
        setJobList(res.data.jobs);
      }
    } catch (error) {
      console.log("Error fetching jobs:", error.message);
    }
  };

  useEffect(() => {
    if (open) {
      getAllJobs(search);
    }
    getAllTAs();
  }, [search, open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-full bg-gray-100 px-3 py-4 sm:px-6">
      <div className="mt-5 px-3 py-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-1 transition"
        >
          <FaArrowLeft className="text-base" />
          <span className="text-sm">Back</span>
        </button>

        {/* Card */}

        <h2 className="text-xl sm:text-2xl text-center font-semibold mb-4 text-gray-800">
          Profile Submission Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-sm">
                Full Name <span className="text-red-500">*</span>
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
              <label className="text-sm">
                Email <span className="text-red-500">*</span>
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
              <label className="text-sm">
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
              <label className="text-sm">
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
              <label>
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
              <label className="text-sm">
                Domain <span className="text-red-500">*</span>
              </label>
              <CreatableSelect
                isMulti
                options={domainOptions}
                value={formData.domain}
                onChange={handleDomainChange}
                className="mt-1 text-sm"
                placeholder="Select one or more domains"
              />
              {errors.domain && (
                <p className="text-xs text-red-500 mt-1">{errors.domain}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label>
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
                className="mt-1 text-sm"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="text-sm">
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
              <label className="text-sm">
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
              <label className="text-sm">
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
              <label className="text-sm">
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
              <label className="text-sm">
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
            {/* POC */}
            <div>
              <label className="text-sm">
                POC (TA’s Name) <span className="text-red-500">*</span>
              </label>

              <select
                name="poc"
                value={formData.poc}
                onChange={handleChange}
                className={`${inputBase} appearance-none`}
              >
                <option value="">Select</option>
                {hrList.map((hr) => (
                  <option key={hr._id} value={hr._id}>
                    {hr.firstName} {hr.lastName}
                  </option>
                ))}
              </select>

              {errors.poc && (
                <p className="text-xs text-red-500 mt-1">{errors.poc}</p>
              )}
            </div>

            {/* jobs */}
            <div ref={dropdownRef} className="relative w-full">
              <label className="text-sm">
                Refer Jobs <span className="text-red-500">*</span>
              </label>

              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={inputBase}
              >
                <span className="truncate">
                  {selectedJobs.length
                    ? `${selectedJobs.length} job(s) selected`
                    : "Select jobs"}
                </span>
                <ChevronDown className="text-gray-400 text-lg" />
              </button>

              {open && (
                <div className="absolute z-30 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search job..."
                    className="w-full px-3 py-2 text-sm border-b outline-none"
                    required
                  />

                  <div className="max-h-56 overflow-y-auto">
                    {jobList.length ? (
                      jobList.map((job) => (
                        <label
                          key={job._id}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedJobs.includes(job._id)}
                            onChange={() => handleSelect(job._id)}
                            onClick={(e) => e.stopPropagation()}
                            className="accent-indigo-600"
                          />
                          <span className="text-sm">
                            {job.title}
                            <span className="text-gray-500 ml-1">
                              ({job.jobId})
                            </span>
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-gray-500">
                        No jobs found
                      </p>
                    )}
                  </div>
                </div>
              )}
              {errors.jobsReferred && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.jobsReferred}
                </p>
              )}
            </div>

            {/* Resume Upload */}

            <div>
              <label className="text-sm font-medium">
                Upload Resume (PDF / DOCX){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm"
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
