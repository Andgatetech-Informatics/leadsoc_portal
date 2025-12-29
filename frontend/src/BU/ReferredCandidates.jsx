import React, { useEffect, useState, useRef } from "react";
import { baseUrl } from "../api";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import CandidateTable from "../components/CandidateTable";
import moment from "moment";
import { Search, X } from "lucide-react";
import BUCandidateTable from "../components/BUCandidateTable";

/** ✅ Debounce Hook */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const ReferredCandidates = () => {
  const token = localStorage.getItem("token");
  const [candidateType, setCandidateType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 600);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 5;

  const hrCache = useRef({});

  const fetchCandidates = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `${baseUrl}/api/get_all_shortlisted_candidates`,
        {
          params: {
            page: currentPage,
            limit,
            search: debouncedSearch,
            candidateType,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const candidatesData = data?.data || [];
      const total = data?.totalCount || candidatesData.length;

      const withHrNames = await Promise.all(
        candidatesData.map(async (candidate) => {
          const { assignedTo } = candidate;

          // If not assigned
          if (!assignedTo) return { ...candidate, hrName: "N/A" };

          // Use cached HR if available
          if (hrCache.current[assignedTo]) {
            return { ...candidate, hrName: hrCache.current[assignedTo] };
          }

          // Otherwise fetch HR name
          try {
            const { data: hrData } = await axios.get(
              `${baseUrl}/api/get_assigned_hr_to_candidate/${assignedTo}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const fullName =
              `${hrData?.data?.firstName || ""} ${
                hrData?.data?.lastName || ""
              }`.trim() || "N/A";
            hrCache.current[assignedTo] = fullName; // cache result
            return { ...candidate, hrName: fullName };
          } catch {
            return { ...candidate, hrName: "N/A" };
          }
        })
      );

      setCandidates(withHrNames);
      setTotalPages(Math.ceil(total / limit));
    } catch (error) {
      console.error("Fetch Error:", error?.response?.data || error.message);
      toast.error("Failed to fetch shortlisted candidates.");
    } finally {
      setLoading(false);
    }
  };

  /** ✅ Fetch whenever page or search changes */
  useEffect(() => {
    fetchCandidates();
  }, [token, debouncedSearch, currentPage, candidateType]);

  /** ✅ Reset to page 1 when search changes */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="mx-auto px-4 py-8 h-full bg-white font-inter">
      {/* Header & Search */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800">
            Referred Candidates
          </h2>

          {/* Right Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Candidate Type Dropdown */}
            <div className="relative w-full sm:w-44">
              <select
                value={candidateType}
                onChange={(e) => setCandidateType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm
        bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Candidates</option>
                <option value="internal">Bench</option>
                <option value="external">Pipeline</option>
              </select>
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by HR, Candidate, Email, or Status"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Approve Button */}
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-green-600
                 rounded-md hover:bg-green-700 transition
                 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Approve
            </button>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mb-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        />
      </div>

      {/* Candidate Table */}
      <BUCandidateTable
        candidates={candidates}
        loading={loading}
        onView={setSelectedCandidate}
        showShortlistedDetails
        showShortlistedColumnsOnly
        redirect="_bu"
      />

      {/* Candidate Modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
};

/** ✅ Candidate Modal */
const CandidateModal = ({ candidate, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center px-4">
    <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 relative">
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <X size={20} />
      </button>

      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Candidate Profile
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <Info label="Name" value={candidate.name} />
        <Info label="Email" value={candidate.email} />
        <Info label="Phone" value={candidate.mobile || "N/A"} />

        {/* Skills */}
        <div className="col-span-2">
          <span className="font-semibold text-gray-700">Skills:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {candidate.skills?.split(",").map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        <Info label="HR" value={candidate.hrName || "N/A"} />
        <Info
          label="Last Updated"
          value={moment(candidate.updatedAt).format("lll")}
        />

        {/* Resume */}
        <div className="col-span-2">
          <span className="font-semibold text-gray-700">Resume:</span>
          {candidate.resume && (
            <div className="mt-1">
              <a
                href={
                  candidate.resume.endsWith(".doc") ||
                  candidate.resume.endsWith(".docx")
                    ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                        `${baseUrl}/${candidate.resume}`
                      )}`
                    : `${baseUrl}/${candidate.resume}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 transition"
              >
                📄 View Resume
              </a>
            </div>
          )}
        </div>

        {/* Notes */}
        {/* <div className="col-span-2">
          <span className="font-semibold text-gray-700">Notes:</span>
          {candidate?.remark.map((e) => {
            return (
              <div key={e._id} className="p-2 border-b border-gray-200">
                <p className="text-sm text-gray-600">{e.title}</p>
                <p className="text-xs text-gray-400">
                  {moment(e.date).format("lll")}
                </p>
                <p className="text-xs text-gray-400">By: {e.name}</p>
              </div>
            );
          })}
          {selectedCandidate.remark || "No notes provided."}
        </div> */}
      </div>
    </div>
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <span className="font-semibold text-gray-700">{label}:</span>
    <div>{value}</div>
  </div>
);

export default ReferredCandidates;
