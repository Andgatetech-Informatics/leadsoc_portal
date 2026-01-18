import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import Pagination from "../components/Pagination";
import axios from "axios";
import { baseUrl } from "../api";
import moment from "moment";

const TABS = [
  { key: "bench", label: "Bench Candidates" },
  { key: "pipeline", label: "Pipeline Candidates" },
  { key: "vendor", label: "Vendor Candidates" },
];

const LIMIT = 3;

const SubmitProfileModal = ({ isOpen, onClose, jobId }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("bench");
  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false)
  const [modalCandidate, setModalCandidate] = useState(null);
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ---------------- FETCH CANDIDATES ---------------- */
  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);

      const { data, status } = await axios.get(
        `${baseUrl}/api/getBenchCandidatesByJobId/${jobId}/${activeTab}`,
        {
          params: {
            page,
            limit: LIMIT,
            search: searchTerm,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (![200, 201].includes(status)) {
        throw new Error("Fetch failed");
      }
      setCandidates(data.data || []);
      setTotalPages(data.pagination.totalPages || 1);
      setPage(data.pagination.currentPage || 1)
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
      setBtnLoading(true);

      // approve_candidates

      const res = await axios.put(
        `${baseUrl}/api/approve_candidates/${jobId}`,
        { candidateIds: selectedIds },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );


      toast.success("Candidates submitted successfully");
      setSelectedIds([]);
      onClose();
    } catch (err) {
      toast.error("Submission failed");
    } finally {
      setBtnLoading(false);
    }
  };

  /* ---------------- TAB CHANGE ---------------- */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setSelectedIds([]);
  };

  if (!isOpen) return null;

  const remainingDays = modalCandidate?.joiningDate
    ? moment(modalCandidate.joiningDate).diff(moment(), "days")
    : null;

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
                  className="grid grid-cols-[auto_2fr_2fr_1.5fr_1.5fr_1fr] items-center gap-4 rounded-xl border p-4 transition hover:bg-gray-50 hover:shadow-sm"
                >
                  {/* Checkbox */}
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(c._id)}
                      onChange={() => toggleCandidate(c._id)}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-blue-600"
                    />
                  </div>

                  {/* Name */}
                  <div
                    onClick={() => navigate(`/application-tracker_bu/${c._id}`)}
                    className="cursor-pointer flex flex-col"
                  >
                    <p className="font-medium text-gray-800 truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {c.experience || "Fresher"}
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="flex flex-col text-sm text-gray-600 truncate">
                    <p className="truncate" title={c.email}>{c.email}</p>
                    <p>{c.mobile}</p>
                  </div>

                  {/* Job */}
                  <div className="text-sm text-gray-700 truncate">
                    {c.jobPosition}
                  </div>

                  {/* TA or POC / Vendor */}
                  <div className="text-sm text-gray-500 truncate">
                    {c.vendorManagerName ? c.vendorManagerName : c.poc || "Unassigned"}
                  </div>

                  {/* Resume */}
                  {/* <div className="text-sm text-blue-600 underline cursor-pointer text-center">
                    <a
                      href={c.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Resume
                    </a>
                  </div> */}

                  {/* View Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => setModalCandidate(c)}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      View
                    </button>
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
              disabled={selectedIds.length <= 0}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {btnLoading ? "Approving..." : "Approve"}
            </button>
          </div>
        </div>
        {/* Modal */}
        {modalCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">

              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100 bg-gray-50">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Candidate Details
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    View candidate profile, onboarding status, and documents
                  </p>
                </div>

                <button
                  onClick={() => setModalCandidate(null)}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-white hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">

                {/* Quick Highlights */}
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-100">
                    Joining In:{" "}
                    {remainingDays === null
                      ? "N/A"
                      : remainingDays <= 0
                        ? "Joined ✅"
                        : `${remainingDays} days`}
                  </span>

                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 border border-gray-200">
                    {modalCandidate?.designation || "Designation: N/A"}
                  </span>

                  {
                    modalCandidate.status !== "bench" &&
                    (
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${modalCandidate?.onboardingInitiated
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-yellow-50 text-yellow-700 border-yellow-100"
                          }`}
                      >
                        {modalCandidate?.onboardingInitiated
                          ? "Onboarding Initiated"
                          : "Onboarding Pending"}
                      </span>

                    )
                  }

                </div>

                {/* Basic Info */}
                <SectionCard title="Basic Info">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoRow label="Email" value={modalCandidate?.email || "N/A"} />
                    <InfoRow label="Mobile" value={modalCandidate?.mobile || "N/A"} />
                    <InfoRow
                      label="Domain"
                      value={modalCandidate?.domain?.join(", ") || "N/A"}
                    />
                    <InfoRow
                      label="Preferred Location"
                      value={modalCandidate?.preferredLocation || "N/A"}
                    />
                    <InfoRow label="Skills" value={modalCandidate?.skills || "N/A"} />
                    <InfoRow
                      label="Graduation Year"
                      value={modalCandidate?.graduationYear || "N/A"}
                    />
                    <InfoRow
                      label="Joining Date"
                      value={
                        modalCandidate?.joiningDate
                          ? moment(modalCandidate.joiningDate).format("DD MMM YYYY")
                          : "N/A"
                      }
                    />
                  </div>
                </SectionCard>

                {/* Assignment / Vendor Info */}
                <div className="mt-5">
                  <SectionCard title="Assignment Details">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {
                        modalCandidate.vendorManagerName && (
                          <InfoRow
                            label="Vendor Manager"
                            value={modalCandidate?.vendorManagerName || "N/A"}
                          />
                        )
                      }
                      {
                        modalCandidate.poc && (
                          <InfoRow
                            label="Assigned To"
                            value={modalCandidate?.poc || "N/A"}
                          />
                        )
                      }
                      {
                        modalCandidate.expectedCTC && (
                          <InfoRow
                            label="Expected CTC"
                            value={
                              modalCandidate?.expectedCTC
                                ? `₹ ${Number(modalCandidate.expectedCTC).toLocaleString("en-IN")}`
                                : "N/A"
                            }
                          />
                        )
                      }
                    </div>
                  </SectionCard>
                </div>

                {/* Onboarding */}
                <div className="mt-5">
                  <SectionCard title="Onboarding Status">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoRow
                        label="Onboarding Initiated"
                        value={modalCandidate?.onboardingInitiated ? "Yes ✅" : "No ❌"}
                      />
                      <InfoRow
                        label="Onboarding Initiate Date"
                        value={
                          modalCandidate?.onboardingInitiateDate
                            ? moment(modalCandidate.onboardingInitiateDate).format(
                              "DD MMM YYYY"
                            )
                            : "N/A"
                        }
                      />
                    </div>
                  </SectionCard>
                </div>

                {/* Resume */}
                <div className="mt-5">
                  <SectionCard
                    title="Documents"
                    rightText={modalCandidate?.resume ? "Resume Available ✅" : null}
                  >
                    {modalCandidate?.resume ? (
                      <a
                        href={
                          modalCandidate.resume.endsWith(".doc") ||
                            modalCandidate.resume.endsWith(".docx")
                            ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                              `${baseUrl}/${modalCandidate.resume}`
                            )}`
                            : `${baseUrl}/${modalCandidate.resume}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                      >
                        📄 View Resume
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">No Resume Uploaded</p>
                    )}
                  </SectionCard>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setModalCandidate(null)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SectionCard = ({ title, rightText, children }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {rightText ? (
          <span className="text-xs text-gray-500">{rightText}</span>
        ) : null}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

const InfoRow = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900 break-words">
        {value}
      </p>
    </div>
  );
};


export default SubmitProfileModal;
