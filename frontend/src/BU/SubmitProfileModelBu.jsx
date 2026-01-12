import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Pagination from "../components/Pagination";

const SubmitProfileModal = ({ isOpen, onClose, jobId }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("bench"); // bench | pipeline | vendor
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;

  // 🔹 Candidate Data
  const candidatesData = [
    {
      _id: "1",
      name: "John Doe",
      experience: "Fresher",

      email: "john@example.com",
      mobile: "1234567890",
      jobPosition: "Frontend Developer",
      category: "bench",
      taName: "Karan Singh",
      role: "Vendor",
    },
    {
      _id: "2",
      name: "Jane Smith",
      experience: "2 yrs",

      email: "jane@example.com",
      mobile: "0987654321",
      jobPosition: "Backend Developer",
      category: "pipeline",
      taName: "Madhavi Singh",
      role: "",
    },
    {
      _id: "3",
      name: "Bob Brown",
      experience: "5 yrs",

      email: "bob@example.com",
      mobile: "1112223333",
      jobPosition: "Fullstack Developer",
      category: "vendor",
      taName: "Karan Singh",
      role: "Vendor",
    },
    {
      _id: "4",
      name: "Alice Green",
      experience: "3 yrs",

      email: "alice.green@gmail.com",
      mobile: "2223334444",
      jobPosition: "UI/UX Designer",
      category: "bench",
      taName: "Madhavi Singh",
      role: "",
    },
    {
      _id: "5",
      name: "Charlie Blue",
      experience: "1 yr",

      email: "charlie.blue@gmail.com",
      mobile: "5556667777",
      jobPosition: "QA Engineer",
      category: "pipeline",
      taName: "Karan Singh",
      role: "Vendor",
    },
    {
      _id: "6",
      name: "Eve White",
      experience: "4 yrs",

      email: "eve.white@gmail.com",
      mobile: "8889990000",
      jobPosition: "DevOps Engineer",
      category: "vendor",
      taName: "Madhavi Singh",
      role: "Vendor",
    },
  ];

  // 🔹 Filter candidates by tab and search
  const filteredCandidates = candidatesData
    .filter((c) => c.category === activeTab)
    .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Pagination
  const startIndex = (page - 1) * limit;
  const paginatedCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + limit
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredCandidates.length / limit) || 1);
  }, [filteredCandidates.length]);

  // Checkbox logic
  const handleCheckboxChange = (id) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedCandidates.map((c) => c._id);
    const allSelected = currentPageIds.every((id) =>
      selectedCandidates.includes(id)
    );

    if (allSelected) {
      setSelectedCandidates((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedCandidates((prev) => [
        ...new Set([...prev, ...currentPageIds]),
      ]);
    }
  };

  const confirmSubmit = () => {
    if (selectedCandidates.length === 0) {
      toast.warn("Please select at least one candidate.");
      return;
    }
    handleSubmit();
  };

  const handleSubmit = () => {
    setSubmitLoading(true);
    setTimeout(() => {
      toast.success("Candidates submitted successfully!");
      setSelectedCandidates([]);
      setSubmitLoading(false);
      onClose();
    }, 1000);
  };

  // Reset selected candidates on tab change
  useEffect(() => {
    setSelectedCandidates([]);
    setPage(1);
  }, [activeTab]);

  if (!isOpen) return null;

  const filteredIds = paginatedCandidates.map((c) => c._id);
  const allSelected =
    filteredIds.length > 0 &&
    filteredIds.every((id) => selectedCandidates.includes(id));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative flex flex-col min-h-[600px] animate-fadeIn">
        {/* Close */}
        {/* Close Button */}{" "}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-2 transition-colors duration-200"
        >
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />{" "}
          </svg>{" "}
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Submit Candidate Profiles
        </h2>
        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          {["bench", "pipeline", "vendor"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {/* Search */}
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
        {/* Select All */}
        {paginatedCandidates.length > 0 && (
          <div className="flex items-center justify-between mb-2 px-1">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
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
          {paginatedCandidates.length > 0 ? (
            paginatedCandidates.map((candidate) => (
              <div
                key={candidate._id}
                onClick={() =>
                  navigate(`/application-tracker_bu/${candidate._id}`)
                }
                className="flex items-center cursor-pointer justify-between bg-gray-50 border rounded-lg p-3 hover:shadow-md transition"
              >
                {/* Checkbox + Name + Experience */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCandidates.includes(candidate._id)}
                    onChange={() => handleCheckboxChange(candidate._id)}
                    className="h-5 w-5 text-blue-600 accent-blue-600"
                  />
                  <div>
                    <p className="font-normal text-gray-800">
                      {candidate.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {candidate.experience || "Fresher"}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex flex-col text-sm text-gray-600 gap-1 w-40">
                  <span title={candidate.email}>{candidate.email}</span>
                  <span title={candidate.mobile}>{candidate.mobile}</span>
                </div>

                {/* Job Position */}
                <div className="text-sm text-gray-700 w-36">
                  {candidate.jobPosition}
                </div>

                {/* Category */}

                {/* TA */}
                <div className="text-sm text-gray-700 w-32">
                  <p>{candidate.taName || "Unassigned"}</p>
                  {candidate.vendor && (
                    <p className="text-xs text-gray-500">{candidate.vendor}</p>
                  )}
                </div>
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
            onClick={confirmSubmit}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition disabled:opacity-50"
            disabled={submitLoading}
          >
            {submitLoading ? "Approving..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitProfileModal;
