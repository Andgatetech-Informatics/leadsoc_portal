import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../api";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import "react-toastify/dist/ReactToastify.css";

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

const ProfileSubmissionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    domain: [],
    releventExp: "",
    experienceYears: "",
    preferredLocation: "",
    currentLocation: "",
    isAssigned: true,
    skills: "",
    poc: "",
    availability: "",
    resume: null,
    FreelancerId: "",
    isFreelancer: true,
  });

  const [errors, setErrors] = useState({});
  const [hrList, setHrList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllHrs = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/auth/get_all_hr`);
        if (res.status === 200) setHrList(res.data.data);
      } catch (error) {
        console.log("Error fetching HR list:", error.message);
      }
    };
    getAllHrs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDomainChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      domain: selectedOptions || [],
    }));
    setErrors((prev) => ({ ...prev, domain: "" }));
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

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
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
    setLoading(true);

    // 🧩 Convert domain to array of strings (["DFT", "PD", "DV"])
    const cleanedData = {
      ...formData,
      domain: formData.domain.map((d) => d.value),
    };

    let hrDetails = hrList.filter((e) => e._id === formData.poc)[0];

    cleanedData.isAssigned = true;
    cleanedData.assignedTo = hrDetails._id;
    cleanedData.poc = hrDetails.firstName + " " + hrDetails.lastName;

    try {
      const response = await axios.post(
        `${baseUrl}/api/freelancer_registration`,
        cleanedData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Application submitted successfully");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          domain: [],
          releventExp: "",
          experienceYears: "",
          preferredLocation: "",
          currentLocation: "",
          poc: "",
          availability: "",
          skills: "",
          resume: null,
          FreelancerId: "",
          isFreelancer: true,
        });
      } else {
        toast.error("Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.response?.data?.message || "Server error during submission"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="max-w-3xl w-full p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition"
        >
          <FaArrowLeft className="text-lg" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h2 className="text-2xl text-center font-semibold mb-6 text-gray-800">
          Profile Submission Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium">
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
              <label className="text-sm font-medium">
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
                className="mt-1 text-sm"
                placeholder="Select one or more domains"
              />
              {errors.domain && (
                <p className="text-xs text-red-500 mt-1">{errors.domain}</p>
              )}
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

            {/* POC */}
            <div>
              <label className="text-sm font-medium">
                POC (TA’s Name) <span className="text-red-500">*</span>
              </label>
              <select
                name="poc"
                value={formData.poc}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${
                  errors.poc ? "border-red-500" : "border-gray-300"
                }`}
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
                className={`mt-1 block w-full rounded-md border p-2 ${
                  errors.availability ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.availability && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.availability}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label>
                Technical skills <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
                required
              />
            </div>

            {/* Resume */}
            <div>
              <label className="text-sm font-medium">
                Upload Resume (PDF / DOCX){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
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

          <div className="flex justify-end items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 disabled:opacity-60"
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
