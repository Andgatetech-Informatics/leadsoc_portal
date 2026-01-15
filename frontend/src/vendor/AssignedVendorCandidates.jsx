import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { baseUrl } from "../api";
import axios from "axios";
import { toast } from "react-toastify";

import CandidateTable from "../components/CandidateTable";
import RemarkModal from "../components/RemarkModal";
import { Search } from "lucide-react";
import CandidateFilter from "../components/CandidateFilter";
import Pagination from "../components/Pagination";
import FreelancerCandidateTable from "../components/FreelancerCandidateTable";
import { useSelector } from "react-redux";
import CandidateDetails from "../vendor/CandidateDetails";

const AssignedVendorCandidates = () => {
  const token = localStorage.getItem("token");
  const { userData } = useSelector((state) => state.user);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const [assignedList, setAssignedList] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remaks, setRemaks] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const limit = 6;

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const getAllCandidates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${baseUrl}/api/candidates/vendor_manager`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            page,
            limit,
            search: searchTerm?.trim() || "",
          },
        }
      );

      if (res.status === 200 && res.data.success) {
        const { candidates, totalPages } = res.data;

        // ✅ Set state variables based on backend response
        setAssignedList(Array.isArray(candidates) ? candidates : []);
        setFilteredCandidates(Array.isArray(candidates) ? candidates : []);
        setTotalPages(totalPages || 1);
      } else {
        toast.error(res.data.message || "Unexpected response format.");
        console.error("Unexpected API structure:", res.data);
      }
    } catch (error) {
      console.error(
        "Candidate Fetch Error:",
        error?.response?.data || error.message
      );
      toast.warn(
        error?.response?.data?.message || "Failed to fetch assigned candidates."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCandidates();
  }, [token, page, refreshKey, searchTerm]);

  const handleEditClick = (candidate) => {
    setSelectedCandidateId(candidate._id);
    setRemaks(candidate.remark || []);
    setModalOpen(true);
  };

  const handleRemarkSave = async (newRemark) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/add_remark/${selectedCandidateId}`,
        { remark: newRemark },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Remark updated");
        setRefreshKey((prev) => prev + 1);
      } else {
        toast.error("Failed to update remark");
      }
    } catch (error) {
      console.error(
        "Candidate update Error:",
        error?.response?.data || error.message
      );
    } finally {
      setModalOpen(false);
      setSelectedCandidateId(null);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/change_candidate_status/${selectedCandidate._id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success(
          `Great! Status is now set to ${capitalizeFirst(status)}.`
        );
        setSelectedCandidate(null);
        setRefreshKey((prev) => prev + 1);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(
        "Candidate update Error:",
        error?.response?.data || error.message
      );
    }
  };

  return (
    <div className="w-full bg-gray-50 font-inter px-4 sm:px-6 lg:px-2 py-2 overflow-x-hidden">
      <div className=" mx-auto">
        {/* Header + Filters */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Vendor Assigned Candidate
            </h2>
          </div>

          {/* Filters */}
          <CandidateFilter
            candidates={assignedList}
            onFilter={setFilteredCandidates}
          />
        </div>
        {/* Pagination */}
        <div className="mt-2">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>

        {/* Candidate Table */}
        <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <FreelancerCandidateTable
            loading={loading}
            handleRemarkSave={handleRemarkSave}
            candidates={filteredCandidates}
            onView={setSelectedCandidate}
            showEditButton={true}
            isFreelancerAssignedTable={true}
            isFreelancerTable={true}
            onEdit={handleEditClick}
            redirect="_vendor"
          />
        </div>

        {/* Candidate Info Modal */}
        <CandidateDetails
          selectedCandidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          handleStatusUpdate={handleStatusUpdate}
          isAssignedTableButton={true}
        />

        {/* Remark Modal */}
        <RemarkModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleRemarkSave}
          initialRemark={remaks}
        />
        {!loading && filteredCandidates.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No assigned Vendor candidates candidates found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedVendorCandidates;
