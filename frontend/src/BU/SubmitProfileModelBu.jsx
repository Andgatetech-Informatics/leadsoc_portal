import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Pagination from "../components/Pagination";
import axios from "axios";
import { baseUrl } from "../api";

const TABS = [
  { key: "internal", label: "Bench Candidates" },
  { key: "external", label: "Pipeline Candidates" },
  { key: "vendor", label: "Vendor Candidates" },
];

const LIMIT = 3;

const SubmitProfileModal = ({ isOpen, onClose, jobId }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("internal");
  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ---------------- FETCH CANDIDATES ---------------- */
  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);

      const { data, status } = await axios.get(
        `${baseUrl}/api/getshortlistedProfilesForBu`,
        {
          params: {
            candidateType: activeTab,
            page,
            limit: LIMIT,
            search: searchTerm,
            jobId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (![200, 201].includes(status)) {
        throw new Error("Fetch failed");
      }

      console.log("Fetched Candidates:", data);

      setCandidates(data.data || []);
      setTotalPages(data.pagination.totalPages || 1);
    } catch (err) {
      console.error("Fetch Candidates Error:", err);
      toast.error("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, searchTerm, jobId]);

  useEffect(() => {
    if (isOpen) fetchCandidates();
  }, [fetchCandidates, isOpen]);

  /* ---------------- SELECTION LOGIC ---------------- */
  const toggleCandidate = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const pageIds = candidates.map((c) => c._id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));

    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : [...new Set([...prev, ...pageIds])]
    );
  };

  const allSelected =
    candidates.length > 0 &&
    candidates.every((c) => selectedIds.includes(c._id));

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!selectedIds.length) {
      toast.warn("Please select at least one candidate");
      return;
    }

    try {
      setLoading(true);

      // 🔹 API call can be placed here
      await new Promise((res) => setTimeout(res, 1000));

      toast.success("Candidates submitted successfully");
      setSelectedIds([]);
      onClose();
    } catch (err) {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TAB CHANGE ---------------- */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setSelectedIds([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative flex h-[80vh] max-h-[700px] min-h-[600px] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ✕
        </button>

        {/* ===== Header ===== */}
        <div className="sticky top-0 z-10 rounded-t-2xl border-b bg-white px-6 pt-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Submit Candidate Profiles
          </h2>

          {/* Tabs */}
          <div className="mt-4 flex gap-2">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === key
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Select All + Pagination */}
          {candidates.length > 0 && (
            <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="accent-blue-600"
                />
                {allSelected ? "Deselect All" : "Select All"}
              </label>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPrevious={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </div>
          )}
        </div>

        {/* ===== Candidate List ===== */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <p className="text-center text-sm text-gray-500">Loading...</p>
          ) : candidates.length ? (
            <div className="space-y-3">
              {candidates.map((c) => (
                <div
                  key={c._id}
                  className="grid grid-cols-[auto_1.5fr_1.5fr_1fr_1fr] items-center gap-4 rounded-xl border p-4 transition hover:bg-gray-50 hover:shadow-sm"
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(c._id)}
                    onChange={() => toggleCandidate(c._id)}
                    onClick={(e) => e.stopPropagation()}
                    className="accent-blue-600"
                  />

                  {/* Name */}
                  <div
                    onClick={() => navigate(`/application-tracker_bu/${c._id}`)}
                    className="cursor-pointer"
                  >
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-500">
                      {c.experience || "Fresher"}
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="text-sm text-gray-600">
                    <p className="truncate">{c.email}</p>
                    <p>{c.mobile}</p>
                  </div>

                  {/* Job */}
                  <div className="text-sm text-gray-700">
                    {c.jobPosition}
                  </div>

                  {/* TA */}
                  <div className="text-sm text-gray-500">
                    {c.taName || "Unassigned"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              No candidates found
            </p>
          )}
        </div>

        {/* ===== Footer ===== */}
        <div className="sticky bottom-0 rounded-b-2xl border-t bg-white px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Approving..." : "Approve"}
            </button>
          </div>
        </div>

      </div>
    </div>

  );
};

export default SubmitProfileModal;
