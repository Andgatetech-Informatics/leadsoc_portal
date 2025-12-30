import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { baseUrl } from "../api";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import BUCandidateTable from "../components/BUCandidateTable";
import moment from "moment";
import { Search, X } from "lucide-react";
import { useLocation } from "react-router-dom";

/* ------------------ Debounce Hook ------------------ */
const useDebounce = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
};

/* ------------------ Paginated Fetch Hook ------------------ */
const usePaginatedFetch = ({
  jobId,
  token,
  search,
  candidateType,
  page,
  limit,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    if (!jobId || !token) return;

    setLoading(true);

    try {
      const res = await axios.get(
        `${baseUrl}/api/shortlisted_candidates_activeJobs_bu/${jobId}`,
        {
          params: { page, limit, search, candidateType },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const rows = res?.data?.data ?? [];
      const total = res?.data?.total ?? rows.length;

      setData(rows);
      setTotalPages(Math.max(1, Math.ceil(total / limit)));
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  }, [jobId, token, page, limit, search, candidateType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { loading, data, totalPages, refetch: fetchData };
};

/* ------------------ Main Component ------------------ */
const ReferredCandidates = () => {
  const { state } = useLocation();
  const jobId = state?.jobId ?? null;

  const token = useMemo(() => localStorage.getItem("token"), []);

  const [candidateType, setCandidateType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [btnLoading, setBtnLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 600);
  const limit = 5;

  /* Reset page & selection when filters change */
  useEffect(() => {
    setPage(1);
    setSelected([]);
  }, [debouncedSearch, candidateType]);

  const {
    loading,
    data: candidates,
    totalPages,
    refetch,
  } = usePaginatedFetch({
    jobId,
    token,
    search: debouncedSearch,
    candidateType,
    page,
    limit,
  });

  const handlePrevious = useCallback(
    () => setPage((p) => Math.max(1, p - 1)),
    []
  );

  const handleNext = useCallback(
    () => setPage((p) => Math.min(totalPages, p + 1)),
    [totalPages]
  );

  /* ------------------ APPROVE LOGIC (FIXED) ------------------ */
  const handleSubmit = useCallback(async () => {
    if (!jobId || selected.length === 0) return;

    setBtnLoading(true);

    try {
      await axios.put(
        `${baseUrl}/api/approve_candidates/${jobId}`,
        { candidateIds: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Candidates approved successfully");

      // ✅ clear UI state
      setSelected([]);
      setSelectedCandidate(null);

      // ✅ FORCE pagination reset
      setPage(1);

      // ✅ ENSURE refetch happens AFTER page reset
      setTimeout(() => {
        refetch();
      }, 0);
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Failed to approve candidates");
    } finally {
      setBtnLoading(false);
    }
  }, [jobId, selected, token, refetch]);

  return (
    <div className="mx-auto px-4 py-8 bg-white font-inter">
      {/* -------- Header -------- */}
      <div className="mb-6 border-b pb-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <h2 className="text-3xl font-bold">Referred Candidates</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Candidate Type */}
            <select
              value={candidateType}
              onChange={(e) => setCandidateType(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All</option>
              <option value="internal">Bench</option>
              <option value="external">Pipeline</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidates"
                className="pl-10 pr-4 py-2 border rounded-md"
              />
            </div>

            {/* Approve Button */}
            <button
              onClick={handleSubmit}
              disabled={btnLoading || selected.length === 0}
              className={`px-4 py-2 text-white rounded-md ${
                btnLoading
                  ? "bg-green-600 opacity-60 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {btnLoading ? "Approving..." : "Approve"}
            </button>
          </div>
        </div>
      </div>

      {/* -------- Pagination -------- */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      {/* -------- Table -------- */}
      <BUCandidateTable
        candidates={candidates}
        loading={loading}
        onView={setSelectedCandidate}
        setSelected={setSelected}
        selected={selected}
      />

      {/* -------- Modal -------- */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
};

/* ------------------ Modal ------------------ */
const CandidateModal = ({ candidate, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 w-full max-w-xl relative">
      <button onClick={onClose} className="absolute top-4 right-4">
        <X />
      </button>

      <h3 className="text-xl font-bold mb-4">Candidate Profile</h3>

      <Info label="Name" value={candidate.name} />
      <Info label="Email" value={candidate.email} />
      <Info label="Phone" value={candidate.mobile || "N/A"} />
      <Info
        label="Last Updated"
        value={moment(candidate.updatedAt).format("lll")}
      />
    </div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="mb-2">
    <span className="font-semibold">{label}:</span> {value}
  </div>
);

export default ReferredCandidates;
