import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../api";
import { useNavigate } from "react-router-dom";
import CandidateTable from "../components/CandidateTable";
import { Search } from "lucide-react";
import Pagination from "../components/Pagination";
import CandidateInformation from "../components/CandidateInformation";

const ShortlistedHistory = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const limit = 8;

  const fetchShortlistedCandidates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${baseUrl}/api/get_all_shortlisted_candidates_to_particular_hr`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            limit,
            search: searchTerm,
          },
        }
      );

      if (res.data.status) {
        setCandidates(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } else {
        toast.error("Failed to fetch shortlisted candidates.");
      }
    } catch (error) {
      toast.error("Server error while fetching candidates.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlistedCandidates();
  }, [page, searchTerm]);

  // const handleViewCandidate = (candidate) => {
  //   navigate(`/application-tracker/${candidate._id}`);
  // };

  return (
    <div className="h-full ">
      <div className="mx-auto">
        <div className="bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              🗂️ Shortlisted Candidates
            </h2>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => {
                  setPage(1); // reset to first page on search
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="mb-2">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>

          <CandidateTable
            candidates={candidates}
            onView={setSelectedCandidate}
            loading={loading}
            showShortlistedDetails={true}
            redirect="_ta"
          />

          <CandidateInformation
            selectedCandidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            // handleStatusUpdate={handleStatusUpdate}
            isAssignedTableButton={false}
            isShortlistedTable={true}
          />

          {!loading && candidates.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No shortlisted candidates found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShortlistedHistory;
