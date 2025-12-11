import axios from "axios";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { baseUrl } from "../api";

const InitiateCandidateModel = ({
  candidateId,
  isOpen,
  onClose,
  companies,
  fetchCandidateDetails
}) => {
  const [joiningDate, setJoiningDate] = useState(null);
  const [formData, setFormData] = useState({ organization: [] });
  const [feedback, setFeedback] = useState("");
  const [position, setPosition] = useState("");
  const [initiateLoading, setInitiateLoading] = useState(false);

  const handleInitiateCandidate = async (e) => {
    e.preventDefault();
    setInitiateLoading(true);

    const initiateCandidate = {
      position: position,
      joiningDate: joiningDate,
      organizarionId: formData.organization.companyId,
      joiningFeedback: feedback,
    };

    try {
      const response = await axios.post(
        `${baseUrl}/api/initiate_onboarding/${candidateId}`,
        initiateCandidate,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status !== 200) {
        return toast.error("Failed to initiate candidate");
      }

      fetchCandidateDetails();
      onClose();
    } catch (error) {
      console.error("Error initiating candidate:", error);
    } finally {
      setInitiateLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-2 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4">Initiate Candidate</h2>

        <form onSubmit={handleInitiateCandidate}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Designation
            </label>
            <input
              value={position}
              type="text"
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Joining Date
            </label>
            <DatePicker
              selected={joiningDate}
              onChange={setJoiningDate}
              placeholderText="DD/MM/YYYY"
              dateFormat="dd/MM/yyyy"
              className="w-72 sm:w-80 md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <Select
              options={companies.map((company) => ({
                value: company._id,
                label: company.organization,
              }))}
              onChange={(selected) =>
                setFormData({
                  ...formData,
                  organization: {
                    name: selected.label,
                    companyId: selected.value,
                  },
                })
              }
              placeholder="Search by company name..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-600 transition duration-200"
              disabled={initiateLoading}
            >
              {initiateLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InitiateCandidateModel;
