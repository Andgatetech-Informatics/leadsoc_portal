import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatableSelect from "react-select/creatable";

const JobPostingForm = ({ closeModal, organizationName, onSubmit }) => {
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [companyList, setCompanyList] = useState([]);

  const [clientName, setClientName] = useState("");
  const [skills, setSkills] = useState([]);
  const [priority, setPriority] = useState("");
  const [experienceMin, setExperienceMin] = useState();
  const [experienceMax, setExperienceMax] = useState();
  const [description, setDescription] = useState("");
  const [referralAmount, setReferralAmount] = useState("");
  const [postDate, setPostDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(""); // Store as a string, not a boolean
  const [noOfPositions, setNoOfPositions] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {}, []);

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the job object to be sent
    const newJob = {
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
      status,
    };

    // console.log("data", newJob);

    try {
      setSubmitLoading(true); // Set loading state
      const response = await axios.post(`${baseUrl}/api/jobpost`, newJob);

      if (response.status === 201) {
        toast.success("Job posted successfully!");
        onSubmit(newJob);
        closeModal();
      }
    } catch (error) {
      toast.error("Failed to post the job. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

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
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleConfirmation} className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Post a New Requirement
        </h2>

        {/* Job Title and Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Job Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="jobTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
        </div>

        {/* Company and Client Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
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
          </div>
        </div>

        {/*Priority & Position */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700"
            >
              Priority<span className="text-red-500">*</span>
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
          </div>
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700"
            >
              No of Positions<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="noOfPositions"
              value={noOfPositions}
              onChange={(e) => setNoOfPositions(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
        </div>

        {/* Experience Range Min, Max and No of positions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="expRangeMin"
              className="block text-sm font-medium text-gray-700"
            >
              Experience Range Min<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="experienceMin"
              value={experienceMin}
              onChange={(e) => setExperienceMin(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label
              htmlFor="expRangeMax"
              className="block text-sm font-medium text-gray-700"
            >
              Experience Range Max<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="experienceMax"
              value={experienceMax}
              onChange={(e) => setExperienceMax(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label
            htmlFor="jobDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Job Description<span className="text-red-500">*</span>
          </label>
          <textarea
            id="jobDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="dateOfCreation"
              className="block text-sm font-medium text-gray-700"
            >
              Post Date<span className="text-red-500">*</span>
            </label>
            <input
              id="dateOfCreation"
              type="date"
              value={postDate}
              onChange={(e) => setPostDate(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date<span className="text-red-500">*</span>
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
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

        {/* Job Status Checkboxes */}
        <div className="flex items-center justify-between space-x-6 mt-4">
          <span className="text-sm font-medium text-gray-700">Job Status:</span>
          <div className="flex space-x-4">
            {/* Active Checkbox */}
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

            {/* Inactive Checkbox */}
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

            {/* On Hold Checkbox */}
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

            {/* Filled Checkbox */}
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
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={handleConfirmation}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all disabled:opacity-50"
            disabled={submitLoading}
          >
            {submitLoading ? <span>Submitting...</span> : <span>Submit</span>}
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-xs w-full mx-auto">
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Confirm Submission
            </h3>
            <div className="flex justify-center space-x-2">
              <button
                onClick={handleConfirmSubmit}
                className="w-full sm:w-auto px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ease-in-out"
              >
                Yes, Submit
              </button>
              <button
                onClick={handleCancelSubmit}
                className="w-full sm:w-auto px-5 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostingForm;
