import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../api";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import Pagination from "../components/Pagination";

const SubmitProfileModal = ({ isOpen, onClose, jobId }) => {
  const user = useSelector((state) => state.user.userData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [candidatesData, setCandidatesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 🔹 Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");
  //  const hrId = localStorage.getItem("hrId");
  const navigate = useNavigate();

  // ✅ API with pagination
  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseUrl}/api/getshortlistedProfilesToMe?page=${page}&limit=3&jobId=${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200 && res.data.status) {
        setCandidatesData(res.data.data || []);
        setTotalPages(res.data.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch assigned candidates.");
    } finally {
      setLoading(false);
    }
  }, [token, page, jobId]);

  useEffect(() => {
    if (isOpen) fetchCandidates();
  }, [isOpen, fetchCandidates, page]);

  const handleCheckboxChange = (id) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (filteredIds) => {
    const allSelected = filteredIds.every((id) =>
      selectedCandidates.includes(id)
    );
    if (allSelected) {
      setSelectedCandidates((prev) =>
        prev.filter((id) => !filteredIds.includes(id))
      );
    } else {
      setSelectedCandidates((prev) => [...new Set([...prev, ...filteredIds])]);
    }
  };

  const confirmSubmit = () => {
    if (selectedCandidates.length === 0) {
      toast.warn("Please select at least one candidate.");
      return;
    }
    setConfirmOpen(true);
  };

  const handleSubmit = async () => {
    if (!jobId || !user?._id) {
      toast.error("Job ID or HR ID missing!");
      return;
    }
    if (selectedCandidates.length === 0) {
      toast.warn("Please select at least one candidate.");
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await axios.post(
        `${baseUrl}/api/addcandidatestojob/${jobId}`,
        {
          hrId: user._id,
          candidates: selectedCandidates,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("res", res.data);
      toast.success("Candidates submitted successfully!");
      setSelectedCandidates([]);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit candidates");
    } finally {
      setSubmitLoading(false);
      setConfirmOpen(false);
    }
  };

  if (!isOpen) return null;

  const filteredCandidates = candidatesData.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIds = filteredCandidates.map((c) => c._id);
  const allSelected =
    filteredIds.length > 0 &&
    filteredIds.every((id) => selectedCandidates.includes(id));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative animate-fadeIn flex flex-col min-h-[600px]">
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

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Submit Candidate Profiles
        </h2>

        {/* Search Box */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Select All Checkbox */}
        {filteredCandidates.length > 0 && (
          <div className="flex items-center justify-between mb-2 px-1">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => handleSelectAll(filteredIds)}
                className="h-4 w-4 text-blue-600 accent-blue-600"
              />
              {allSelected ? "Deselect All" : "Select All"}
            </label>
            <span className="text-xs text-gray-500">
              {selectedCandidates.length} selected
            </span>
          </div>
        )}

        {/* Candidate List */}
        <div className="flex-1 max-h-72 overflow-y-auto space-y-2 pr-1 transition-all duration-200">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
              <div
                key={candidate._id}
                className="flex items-center justify-between bg-gray-50 border rounded-lg p-3 hover:shadow-md transition"
              >
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => {
                    navigate(`/application-tracker_ta/${candidate._id}`);
                    onClose();
                  }}
                >
                  <div className="flex flex-col text-gray-800 w-full">
                    {/* Name + Status Row */}
                    <div className="grid grid-cols-[1fr_auto] items-center text-base w-full">
                      <span className="font-medium truncate pr-2">
                        {candidate.name}
                      </span>
                      {candidate.status && (
                        <span
                          className={`px-2 py-1 rounded-full font-medium text-sm
          ${
            candidate.status === "shortlisted"
              ? "bg-indigo-100 text-indigo-700"
              : candidate.status === "assigned"
              ? "bg-green-100 text-green-700"
              : candidate.status === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600"
          }`}
                        >
                          {candidate.status}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {/* Skills & domain */}
                      <p
                        className="text-sm text-gray-600 mt-1 truncate w-full max-w-32"
                        title={candidate.skills}
                      >
                        {candidate.skills || "No skills"}
                      </p>{" "}
                      ||
                      <p
                        className="text-sm text-gray-600 mt-1 truncate w-full max-w-32"
                        title={
                          candidate.domain && candidate.domain.length > 0
                            ? candidate.domain.join(", ")
                            : "No domain"
                        }
                      >
                        {candidate.domain && candidate.domain.length > 0
                          ? candidate.domain.join(", ")
                          : "No domain"}
                      </p>
                    </div>

                    {/* Email & Mobile */}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {candidate.email} | {candidate.mobile}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedCandidates.includes(candidate._id)}
                  onChange={() => handleCheckboxChange(candidate._id)}
                  className="h-5 w-5 text-blue-600 accent-blue-600"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No candidates found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={confirmSubmit}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition disabled:opacity-50"
            disabled={submitLoading}
          >
            {submitLoading ? <span>Submitting...</span> : <span>Submit</span>}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-60">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to submit?
            </h3>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitProfileModal;
