import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import axios from "axios";
import { baseUrl } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatableSelect from "react-select/creatable";
import ConfirmationModal from "../components/ConfirmationModal";

// Custom Styles for the Select component
const customStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "#D1D5DB",
    borderRadius: "0.375rem",
    padding: "0.38rem",
    "&:hover": {
      borderColor: "#3B82F6",
    },
    boxShadow: "none",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#E5E7EB",
    borderRadius: "0.375rem",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#1F2937",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#9CA3AF",
    ":hover": {
      backgroundColor: "#F3F4F6",
      color: "#DC2626",
    },
  }),
};

const CreatePostJob = ({ onSubmit, closeModal }) => {
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [organizationName, setOrganizationName] = useState("");
  const [clientName, setClientName] = useState("");
  const [skills, setSkills] = useState([]);
  const [priority, setPriority] = useState("");
  const [experienceMin, setExperienceMin] = useState();
  const [experienceMax, setExperienceMax] = useState();
  const [description, setDescription] = useState("");
  const [referralAmount, setReferralAmount] = useState("");
  const [postDate, setPostDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [noOfPositions, setNoOfPositions] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [jobId, setJobId] = useState("JOB-001");
  const [visibility, setVisibility] = useState([]);
  const [openVisibility, setOpenVisibility] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  const visRef = useRef();
  const statusRef = useRef();
  // Fetch company list
  const handleCompanySelect = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/getAllOrganizations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.data?.data?.length > 0) {
        setCompanyList(response.data.data);
      } else {
        console.log("No company data found");
      }
    } catch (error) {
      toast.error("Failed to fetch company data.");
    }
  };

  useEffect(() => {
    handleCompanySelect();

    // Close dropdowns on outside click
    function handleClickOutside(event) {
      if (visRef.current && !visRef.current.contains(event.target))
        setOpenVisibility(false);
      if (statusRef.current && !statusRef.current.contains(event.target))
        setOpenStatus(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleVisibilityChange = (item) => {
    if (visibility.includes(item)) {
      setVisibility(visibility.filter((v) => v !== item));
    } else {
      setVisibility([...visibility, item]);
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!title) errors.title = "Job Title is required";
    if (!location) errors.location = "Location is required";
    if (!organizationName) errors.organizationName = "Company is required";

    if (!priority) errors.priority = "Priority is required";
    if (!experienceMin || experienceMin <= 0)
      errors.experienceMin =
        "Experience Min is required and must be greater than 0";
    if (!experienceMax || experienceMax <= 0)
      errors.experienceMax =
        "Experience Max is required and must be greater than 0";
    if (experienceMax < experienceMin)
      errors.experienceRange =
        "Experience Max must be greater than Experience Min";
    if (!description) errors.description = "Job Description is required";
    if (!postDate) errors.postDate = "Post Date is required";
    if (!endDate) errors.endDate = "End Date is required";
    if (new Date(postDate) > new Date(endDate))
      errors.dateRange = "End Date must be later than Post Date";
    if (!noOfPositions || noOfPositions <= 0)
      errors.noOfPositions =
        "Number of Positions is required and must be greater than 0";

    if (visibility.length === 0) errors.visibility = "Select visibility";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newJob = {
      jobId,
      title,
      location,
      organizationName,
      clientName,
      skills,
      priority,
      experienceMin,
      experienceMax,
      noOfPositions,
      description,
      postDate,
      endDate,
      referralAmount,
      visibility,
      status,
    };

    try {
      setSubmitLoading(true);
      const response = await axios.post(`${baseUrl}/api/jobpost`, newJob);

      if (response.status === 201) {
        toast.success("Job posted successfully!");
      }
    } catch (error) {
      toast.error("Failed to post the job. Please try again.");
    } finally {
      setSubmitLoading(false);
      setJobId("");
      setTitle("");
      setLocation("");
      setOrganizationName("");
      setClientName("");
      setSkills([]);
      setPriority("");
      setExperienceMin(0);
      setExperienceMax(0);
      setNoOfPositions("");
      setDescription("");
      setPostDate("");
      setEndDate("");
      setReferralAmount("");
      setStatus("");
      setVisibility("");
      closeModal();
    }
  };

  const handleOpenModal = () => setShowConfirmation(true);
  const handleCloseModal = () => setShowConfirmation(false);
  const handleConfirmation = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = (e) => {
    handleSubmit(e);
    setShowConfirmation(false);
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  const handleChange = (newValue) => {
    const values = newValue ? newValue.map((item) => item.label) : [];
    setSkills(values); // keep only values in state
  };

  const options = [
    { id: 1, value: "python", label: "Python" },
    { id: 2, value: "react", label: "React" },
    { id: 3, value: "node.js", label: "Node.js" },
    { id: 4, value: "mongodb", label: "MongoDB" },
    { id: 5, value: "express", label: "Express" },
    { id: 6, value: "dft", label: "DFT" },
    { id: 7, value: "pd", label: "PD" },
    { id: 8, value: "dv", label: "DV" },
    { id: 9, value: "pdk", label: "PDK" },
    {
      id: 10,
      value: "analog mixed signaling",
      label: "Analog Mixed Signaling",
    },
    { id: 11, value: "analog layout design", label: "Analog Layout Design" },
    { id: 12, value: "design engineer", label: "Design Engineer" },
    { id: 13, value: "synthesis", label: "Synthesis" },
    { id: 14, value: "physical verification", label: "Physical Verification" },
    { id: 15, value: "embedded", label: "Embedded" },
    { id: 16, value: "fpga", label: "FPGA" },
    { id: 17, value: "design", label: "Design" },
    { id: 18, value: "analog design", label: "Analog Design" },
    { id: 19, value: "formal verification", label: "Formal Verification" },
    { id: 20, value: "software", label: "Software" },
    { id: 21, value: "sta", label: "STA" },
  ];

  return (
    <div className="mx-auto px-20 py-5">
      <form onSubmit={handleConfirmation} className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Post a New Requirement
        </h2>
        {/* ------------------------ Job ID + Visibility + Status ------------------------ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job ID */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Job / Reference ID
            </label>
            <input
              type="text"
              value={jobId}
              readOnly
              className="w-full p-3 bg-gray-100 border rounded-lg text-sm"
            />
          </div>

          {/* Right Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visibility */}
            <div className="relative flex flex-col" ref={visRef}>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Visibility <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setOpenVisibility(!openVisibility)}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg flex justify-between items-center text-sm hover:border-gray-400 transition"
              >
                <span className="text-gray-700">
                  {visibility.length > 0
                    ? visibility.join(", ")
                    : "Choose visibility"}
                </span>
                {openVisibility ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {openVisibility && (
                <div className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-16 z-20">
                  {["Public", "Vendor", "TA"].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="accent-blue-600 h-4 w-4"
                        checked={visibility.includes(item)}
                        onChange={() => handleVisibilityChange(item)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              )}
              {formErrors.visibility && (
                <p className="text-red-500 text-xs ">{formErrors.visibility}</p>
              )}
            </div>

            {/* Job Status */}
            <div className="relative flex flex-col" ref={statusRef}>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Job Status
              </label>
              <button
                type="button"
                onClick={() => setOpenStatus(!openStatus)}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg flex justify-between items-center text-sm hover:border-gray-400 transition"
              >
                <span className="text-gray-700">
                  {status ? status : "Choose job status"}
                </span>
                {openStatus ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {openStatus && (
                <div className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-16 z-20">
                  {["Active", "Inactive", "On Hold", "Filled"].map((s) => (
                    <label
                      key={s}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-sm cursor-pointer"
                    >
                      <input
                        type="radio"
                        className="accent-blue-600 h-4 w-4"
                        checked={status === s}
                        onChange={() => setStatus(s)}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Job Title and Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="jobTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm">{formErrors.title}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            {formErrors.location && (
              <p className="text-red-500 text-sm">{formErrors.location}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700"
            >
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {formErrors.priority && (
              <p className="text-red-500 text-sm">{formErrors.priority}</p>
            )}
          </div>
        </div>

        {/* Company and Client Name */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name <span className="text-red-500">*</span>
            </label>
            <select
              id="companyName"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="" disabled>
                Select a Company
              </option>
              {companyList.length > 0 ? (
                companyList.map((company) => (
                  <option key={company._id} value={company.organization}>
                    {company.organization}
                  </option>
                ))
              ) : (
                <option disabled>No companies available</option>
              )}
            </select>
            {formErrors.organizationName && (
              <p className="text-red-500 text-sm">
                {formErrors.organizationName}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            {formErrors.clientName && (
              <p className="text-red-500 text-sm">{formErrors.clientName}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-gray-700"
            >
              Skills <span className="text-red-500">*</span>
            </label>
            <CreatableSelect
              id="skills"
              isMulti
              value={skills.map((skill) => ({
                value: skill,
                label: skill,
              }))}
              onChange={handleChange}
              options={options}
              placeholder="Select or type to add skills..."
              className="mt-2 w-full"
              classNamePrefix="select"
              styles={customStyles}
            />
            {formErrors.skills && (
              <p className="text-red-500 text-sm">{formErrors.skills}</p>
            )}
          </div>
        </div>

        {/* Experience Range Min, Max and No of positions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="expRangeMin"
              className="block text-sm font-medium text-gray-700"
            >
              Experience Range Min <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="experienceMin"
              value={experienceMin}
              onChange={(e) => setExperienceMin(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            {formErrors.experienceMin && (
              <p className="text-red-500 text-sm">{formErrors.experienceMin}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="expRangeMax"
              className="block text-sm font-medium text-gray-700"
            >
              Experience Range Max <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="experienceMax"
              value={experienceMax}
              onChange={(e) => setExperienceMax(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            {formErrors.experienceMax && (
              <p className="text-red-500 text-sm">{formErrors.experienceMax}</p>
            )}
            {formErrors.experienceRange && (
              <p className="text-red-500 text-sm">
                {formErrors.experienceRange}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700"
            >
              No of Positions <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="noOfPositions"
              value={noOfPositions}
              onChange={(e) => setNoOfPositions(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            {formErrors.noOfPositions && (
              <p className="text-red-500 text-sm">{formErrors.noOfPositions}</p>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label
            htmlFor="jobDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="jobDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            rows="2"
            required
          ></textarea>
          {formErrors.description && (
            <p className="text-red-500 text-sm">{formErrors.description}</p>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="dateOfCreation"
              className="block text-sm font-medium text-gray-700"
            >
              Post Date <span className="text-red-500">*</span>
            </label>
            <input
              id="dateOfCreation"
              type="date"
              value={postDate}
              onChange={(e) => setPostDate(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            {formErrors.postDate && (
              <p className="text-red-500 text-sm">{formErrors.postDate}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            {formErrors.endDate && (
              <p className="text-red-500 text-sm">{formErrors.endDate}</p>
            )}
            {formErrors.dateRange && (
              <p className="text-red-500 text-sm">{formErrors.dateRange}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="referralAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Referral Amount
            </label>
            <input
              id="referralAmount"
              value={referralAmount}
              onChange={(e) => setReferralAmount(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Job Status */}
        {/* <div className="flex items-center justify-end space-x-6 mt-4">
          <span className="text-sm font-medium text-gray-700">Job Status:</span>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="activeStatus"
                checked={status === "Active"}
                onChange={() => setStatus("Active")}
                className="form-checkbox text-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="activeStatus"
                className="ml-2 text-sm text-green-500 font-medium"
              >
                Active
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="inactiveStatus"
                checked={status === "Inactive"}
                onChange={() => setStatus("Inactive")}
                className="form-checkbox text-gray-400 border-gray-300 rounded"
              />
              <label
                htmlFor="inactiveStatus"
                className="ml-2 text-sm text-gray-400 font-medium"
              >
                Inactive
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="onHoldStatus"
                checked={status === "On Hold"}
                onChange={() => setStatus("On Hold")}
                className="form-checkbox text-yellow-500 border-gray-300 rounded"
              />
              <label
                htmlFor="onHoldStatus"
                className="ml-2 text-sm text-yellow-500 font-medium"
              >
                On Hold
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="filledStatus"
                checked={status === "Filled"}
                onChange={() => setStatus("Filled")}
                className="form-checkbox text-gray-600 border-gray-300 rounded"
              />
              <label
                htmlFor="filledStatus"
                className="ml-2 text-sm text-gray-600 font-medium"
              >
                Filled
              </label>
            </div>
          </div>
        </div> */}

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={handleOpenModal}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all disabled:opacity-50"
            disabled={submitLoading}
          >
            {submitLoading ? <span>Submitting...</span> : <span>Submit</span>}
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          onConfirm={handleConfirmSubmit}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CreatePostJob;
