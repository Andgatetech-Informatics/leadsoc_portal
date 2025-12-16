import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import dayjs from "dayjs";
import { Eye, Search, X } from "lucide-react";
import { toast } from "react-toastify";
import { baseUrl } from "../api";
import MiniLoading from "../components/MiniLoading";
import Pagination from "../components/Pagination";
import FilterDateMonth from "../components/FilterDateMonth";
import { FaBriefcase, FaPhoneSquareAlt } from "react-icons/fa";
import CandidateTable from "../components/CandidateTable"; // Import CandidateTable

const statusColors = {
  pending: "bg-slate-100 text-slate-700",
  assigned: "bg-green-100 text-green-700",
  onhold: "bg-amber-100 text-amber-700",
  shortlisted: "bg-indigo-100 text-indigo-700",
  rejected: "bg-rose-100 text-rose-700",
  submitted: "bg-sky-100 text-sky-700",
  approved: "bg-teal-100 text-teal-700",
  default: "bg-gray-100 text-gray-700",
};

const ApplicantStatus = () => {
  const token = localStorage.getItem("token");

  const [hrData, setHrData] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const limit = 6;

  const formatDate = (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "");

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit,
        search: searchTerm,
        ...(startDate && { startDate: formatDate(startDate) }),
        ...(endDate && { endDate: formatDate(endDate) }),
      });

      const { data, status } = await axios.get(
        `${baseUrl}/api/get_all_assigned?${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (status === 200) {
        setHrData(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      toast.error("Failed to fetch assigned candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [page, searchTerm, startDate, endDate]);

  const handleSearchChange = (e) => {
    setPage(1);
    setSearchTerm(e.target.value);
  };

  const renderStatusBadge = (status) => (
    <span
      className={`text-xs font-medium px-3 py-1 rounded-full ${
        statusColors[status] || statusColors.default
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  return (
    <div className="mx-auto bg-white px-6 py-8 font-inter shadow-lg rounded-md border border-gray-200  flex flex-col">
      <div className="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Applicants Status</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage TA's and candidate activity
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
          <div className="w-full sm:w-auto">
            <FilterDateMonth
              getAllData={fetchCandidates}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name, email or status"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrevious={() => setPage((p) => Math.max(p - 1, 1))}
        onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
      />

      {/* Candidate Table Component */}
      <div className="mt-2 flex-1">
        <CandidateTable
          candidates={hrData}
          loading={loading}
          onView={(c) => setSelectedCandidate(c)}
          showShortlistedDetails={true}
          isAssignedTable={false}
          showShortlistedColumnsOnly={true}
          redirect="/teams"
        />
      </div>

      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center px-6">
          <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Candidate Profile
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* Name */}
              <div>
                <span className="font-semibold text-gray-700">Name:</span>
                <div>{selectedCandidate?.name || "N/A"}</div>
              </div>

              {/* Email */}
              <div>
                <span className="font-semibold text-gray-700">Email:</span>
                <div>{selectedCandidate?.email || "N/A"}</div>
              </div>

              {/* Phone */}
              <div>
                <span className="font-semibold text-gray-700">Phone:</span>
                <div>{selectedCandidate?.mobile || "N/A"}</div>
              </div>

              {/* Status */}
              <div>
                <span className="font-semibold text-gray-700">Status:</span>
                <div>
                  {renderStatusBadge(selectedCandidate?.status || "N/A")}
                </div>
              </div>

              {/* HR */}
              <div>
                <span className="font-semibold text-gray-700">HR:</span>
                <div>
                  {selectedCandidate?.user?.firstName
                    ? `${selectedCandidate?.user?.firstName} ${
                        selectedCandidate?.user?.lastName || ""
                      }`
                    : "N/A"}
                </div>
              </div>

              {/* Updated At */}
              <div>
                <span className="font-semibold text-gray-700">
                  Last Updated:
                </span>
                <div>
                  {selectedCandidate?.updatedAt
                    ? moment(selectedCandidate.updatedAt).format("lll")
                    : "N/A"}
                </div>
              </div>

              {/* Skills */}
              <div className="col-span-2">
                <span className="font-semibold text-gray-700">Skills:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedCandidate?.skills
                    ? selectedCandidate.skills.split(",").map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                        >
                          {s.trim()}
                        </span>
                      ))
                    : "N/A"}
                </div>
              </div>

              {/* Resume */}
              <div className="col-span-2">
                <span className="font-semibold text-gray-700">Resume:</span>
                {selectedCandidate?.resume ? (
                  <a
                    href={
                      selectedCandidate.resume.endsWith(".doc") ||
                      selectedCandidate.resume.endsWith(".docx")
                        ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                            `${baseUrl}/${selectedCandidate.resume}`
                          )}`
                        : `${baseUrl}/${selectedCandidate.resume}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 mt-1 inline-block"
                  >
                    📄 View Resume
                  </a>
                ) : (
                  "No Resume"
                )}
              </div>

              {/* Remarks */}
              <div className="col-span-2">
                <span className="font-semibold text-gray-700">Notes:</span>
                {selectedCandidate?.remark?.length > 0 ? (
                  selectedCandidate.remark.map((e) => (
                    <div key={e._id} className="p-2 border-b border-gray-200">
                      <p className="text-sm text-gray-600">{e.title}</p>
                      <p className="text-xs text-gray-400">
                        {moment(e.date).format("lll")}
                      </p>
                      <p className="text-xs text-gray-400">By: {e.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No notes added.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantStatus;
