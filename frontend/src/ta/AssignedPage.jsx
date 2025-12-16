import React, { useEffect, useState } from "react";
import { baseUrl } from "../api";
import axios from "axios";
import { toast } from "react-toastify";

import CandidateInformation from "../components/CandidateInformation";
import CandidateTable from "../components/CandidateTable";
import RemarkModal from "../components/RemarkModal";
import CandidateFilter from "../components/CandidateFilter";
import Pagination from "../components/Pagination";
import { useLocation } from "react-router-dom";

const AssignedCandidatePage = () => {
  const location = useLocation();
  const initialPage = location.state?.page || 1;
  const token = localStorage.getItem("token");
  const [refreshKey, setRefreshKey] = useState(0);
  const [assignedList, setAssignedList] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remaks, setRemaks] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");

  const limit = 6;

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    const getAllCandidates = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseUrl}/api/get_all_assigned_to_me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: {
              page,
              limit,
              search: searchTerm,
              domain: selectedDomain,
              status: selectedStatus,
              experience: selectedExperience
            },
          }
        );

        if (response.status === 200) {
          setAssignedList(response.data.data);
          setFilteredCandidates(response.data.data);
          setTotalPages(response.data.pagination?.totalPages || 1);
        }
      } catch (error) {
        console.error(
          "Candidate Fetch Error:",
          error?.response?.data || error.message
        );
        toast.error("Failed to fetch assigned candidates.");
      } finally {
        setLoading(false);
      }
    };

    getAllCandidates();
  }, [token, page, refreshKey, searchTerm, selectedDomain, selectedStatus, selectedExperience]);

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
              Assigned Candidate Details
            </h2>
          </div>

          {/* Filters */}
          <CandidateFilter
            searchTerm={searchTerm}
            selectedDomain={selectedDomain}
            selectedStatus={selectedStatus}
            selectedExperience={selectedExperience}
            setSearchTerm={setSearchTerm}
            setSelectedDomain={setSelectedDomain}
            setSelectedStatus={setSelectedStatus}
            setSelectedExperience={setSelectedExperience}
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
          <CandidateTable
            loading={loading}
            handleRemarkSave={handleRemarkSave}
            candidates={filteredCandidates}
            onView={setSelectedCandidate}
            showEditButton={true}
            isAssignedTable={true}
            onEdit={handleEditClick}
            selectedRating={selectedRating}
            redirect="_ta"
            page={page}
          />
        </div>

        {/* Candidate Info Modal */}
        <CandidateInformation
          selectedCandidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          handleStatusUpdate={handleStatusUpdate}
          isAssignedTableButton={true}
        />

        <RemarkModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleRemarkSave}
          initialRemark={remaks}
        />
        {!loading && filteredCandidates.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No assigned candidates found.
          </div>
        )}

        {/* Remark Modal */}
      </div>
    </div>
  );
};

export default AssignedCandidatePage;
