import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import dayjs from "dayjs";

import { baseUrl } from "../api";

import Pagination from "../components/Pagination";
import FilterDateMonth from "../components/FilterDateMonth";
import FreelancerCandidateTable from "../components/FreelancerCandidateTable";
import CandidateDetails from "./CandidateDetails";

const VendorCandidates = () => {
  const token = localStorage.getItem("token");

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // ✅ Fetch Candidates
  const getAllCandidates = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/all_freelancer_candidates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit,
          search: searchTerm,
          startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : "",
          endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
        },
      });

      if (res.status === 200 && res.data.success) {
        const { candidates, total, totalPages } = res.data;

        // ✅ Correctly set data from your API
        setCandidates(candidates || []);
        setTotal(total || 0);
        setTotalPages(totalPages || 1);
      } else {
        toast.error("Unexpected response format.");
      }
    } catch (err) {
      toast.error("Failed to load candidates.");
      console.error(
        "Fetch Candidates Error:",
        err?.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Assign candidate
  const handleAssign = async (candidateId) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/assign_candidate_to_me/${candidateId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Candidate assigned successfully");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error(
        "Assign Candidate Error:",
        error?.response?.data || error.message
      );
      toast.error("Failed to assign candidate.");
    }
  };

  // ✅ Update candidate status
  const handleStatusUpdate = async (status) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/change_candidate_status/${selectedCandidate._id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(`Status updated to ${capitalizeFirst(status)}`);
        setRefreshKey((prev) => prev + 1);
        setSelectedCandidate(null);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(
        "Status Update Error:",
        error?.response?.data || error.message
      );
      toast.error("Failed to update status");
    }
  };

  const handleSearchChange = (e) => {
    setPage(1);
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    getAllCandidates();
  }, [page, searchTerm, refreshKey, startDate, endDate]);

  return (
    <div className="mx-auto h-full bg-white px-4 py-4 font-inter shadow-sm rounded-md border border-gray-200">
      {/* Header Section */}
      <div className="px-4 sm:px-6 lg:px-2 py-4">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Vendor Submission Panel
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and filter your candidate submissions
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
            <FilterDateMonth
              getAllData={getAllCandidates}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />

            <div className="relative w-full sm:w-64">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrevious={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      {/* Candidate Table */}
      <div className="overflow-x-auto rounded-xl shadow border mt-2 border-gray-200 bg-white">
        <FreelancerCandidateTable
          loading={loading}
          candidates={candidates}
          onAssign={handleAssign}
          isFreelancerTable={true}
          onView={setSelectedCandidate}
          showAssignButton={true}
          redirect={"_vendor"}
        />
      </div>

      {/* Candidate Detail Modal */}
      <CandidateDetails
        selectedCandidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        handleStatusUpdate={handleStatusUpdate}
        disableStatus={true}
      />
      {!loading && candidates.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No vendor candidates candidates found.
        </div>
      )}
    </div>
  );
};

export default VendorCandidates;
