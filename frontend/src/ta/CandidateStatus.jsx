import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search } from "lucide-react";
import {
  FaPhoneSquareAlt,
  FaUserAlt,
  FaWhatsapp,
  FaBriefcase,
} from "react-icons/fa";
import moment from "moment";
import Pagination from "../components/Pagination";
import axios from "axios";
import { baseUrl } from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa6";
import { toast } from "react-toastify";
import CandidateInformation from "../components/CandidateInformation";

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

const CandidateStatus = () => {
const navigate = useNavigate()
  const token = localStorage.getItem("token");
  const location = useLocation();
  const state = location.state ?? {};

  const dateRange = state.dateRange ?? null;
  const currentStatus = state.currentStatus ?? "all";

  /* -----------------------------
        STATES
  ------------------------------*/
  const [loading, setLoading] = useState(false);
  const [candidateData, setCandidateData] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(currentStatus || "hired");
  const [startDate, setStartDate] = useState(dateRange?.startDate || null);
  const [endDate, setEndDate] = useState(dateRange?.endDate || null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const limit = 6;

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const onView = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const showActionColumn = candidateData?.some(
    (item) => item?.status?.toLowerCase() === "onhold"
  );

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

        setSelectedCandidate(null); // ✅ CLOSE MODAL
        getCandidates(); // ✅ REFRESH TABLE
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error("Something went wrong while updating status");
    }
  };

  useEffect(() => {
    if (dateRange?.startDate && dateRange?.endDate) {
      setStartDate(dateRange.startDate);
      setEndDate(dateRange.endDate);
    }

    if (currentStatus) {
      setActiveTab(currentStatus);
    }
  }, []);

  const getCandidates = useCallback(async () => {
    if (!startDate || !endDate) return;

    setLoading(true);

    try {
      const res = await axios.get(`${baseUrl}/api/candidates_statuswise`, {
        params: {
          status: activeTab,
          startDate,
          endDate,
          search,
          page,
          limit,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCandidateData(res.data.candidates || []);
      setTotalPage(res.data.totalPages || 1);
    } catch (error) {
      console.log("Error requesting data:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, startDate, endDate, search, page]);

  const renderStatusBadge = (status) => (
    <span
      className={`text-xs font-medium px-3 py-1 rounded-full ${
        statusColors[status] || statusColors.default
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  useEffect(() => {
    if (!startDate || !endDate) return;
    getCandidates();
  }, [search, activeTab, startDate, endDate, page, getCandidates]);

  const filteredCandidates = useMemo(() => {
    if (!search.trim()) return candidateData;

    const term = search.toLowerCase();

    return candidateData.filter((c) => {
      return (
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.mobile?.toLowerCase().includes(term)
      );
    });
  }, [search, candidateData]);

  const TableHeader = () => (
    <thead className="bg-gray-200 text-gray-700 uppercase text-xs border-b font-medium">
      <tr>
        <th className="px-6 py-4">APPLICANT DETAILS</th>
        {showActionColumn && <th className="px-6 py-4">Action</th>}
        <th className="px-6 py-4">Status</th>
        <th className="px-6 py-4">Assigned To</th>
        <th className="px-6 py-4">DOMAIN</th>
        <th className="px-6 py-4">CONTACT</th>
        <th className="px-6 py-4 text-center">LAST UPDATE</th>
      </tr>
    </thead>
  );

  const SkeletonLoader = () => (
    <tr className="animate-pulse">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 shadow-sm rounded-xl p-6 relative">
      {/* Header */}
      <div className=" text-end mb-1">
        <button
          onClick={() => window.history.back()}
          className=" text-base font-medium shadow-sm text-gray-700 active:scale-[0.98]"
        >
          ← Back
        </button>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Candidate Status
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            View candidates by status
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-2 mb-4">
        <Pagination
          currentPage={page}
          totalPages={totalPage}
          onPrevious={() => setPage((p) => Math.max(p - 1, 1))}
          onNext={() => setPage((p) => Math.min(p + 1, totalPage))}
        />
      </div>

      {/* Table + Desktop View */}
      <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
        {/* Loading */}
        {loading && (
          <table className="w-full text-sm text-left table-auto">
            <TableHeader />
            <tbody>
              {[...Array(4)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </tbody>
          </table>
        )}

        {/* Empty */}
        {!loading && filteredCandidates.length === 0 && (
          <table className="w-full text-sm text-left cursor-not-allowed table-auto">
            <TableHeader />
            <tbody>
              <tr>
                <td
                  colSpan="5"
                  className="py-10 text-center text-gray-600 text-base"
                >
                  No {activeTab} candidates found.
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Desktop Table (Visible on sm and up) */}
        {!loading && filteredCandidates.length > 0 && (
          <table className="hidden min-[1000px]:table w-full text-sm text-left table-auto">
            <TableHeader />
            <tbody className="divide-y text-sm">
              {filteredCandidates.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50 transition">
                  {/* Name */}
                   <td
                    onClick={() => navigate(`/application-tracker/${c._id}`)}
                    className="px-4 py-4 cursor-pointer align-top"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-gray-800" title={c.name}>
                        {c.name}
                      </span>

                      <div className="flex items-center gap-1 text-xs text-gray-700">
                        <FaUserAlt className="mr-2 text-gray-500" />
                        <span>{c._id?.slice(-5)}</span>
                        <span className="text-gray-500 text-[10px]">
                          {moment(c.createdAt).format("ll")}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  {c?.status === "onhold" && (
                    <td className="px-4 py-4">
                      <button
                        onClick={() => onView(c)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded-full text-xs"
                      >
                        <FaEye />
                      </button>
                    </td>
                  )}

                  {/* Status */}
                  <td className="px-4 py-4">
                    {renderStatusBadge(c?.status || "N/A")}
                  </td>

                  <td className="px-4 py-4">{c?.poc || "Not Assignee"}</td>

                  {/* Domain */}
                  <td className="px-4 py-3 truncate max-w-[120px]">
                    <p title={c.domain}>
                      {Array.isArray(c.domain) ? c.domain.join(", ") : c.domain}
                    </p>

                    <div className="flex mt-1 items-center">
                      <FaBriefcase className="mr-2 text-gray-500" />
                      <p>
                        {c.experienceYears
                          ? `${c.experienceYears} yrs`
                          : "Fresher"}
                      </p>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-4">
                    <a
                      href={`mailto:${c.email}`}
                      className="hover:text-blue-500"
                    >
                      {c.email}
                    </a>

                    <div className="flex items-center mt-2">
                      <a
                        href={`tel:${c.mobile}`}
                        className="text-gray-500 hover:text-blue-500 flex items-center"
                      >
                        <FaPhoneSquareAlt className="mr-2" /> {c.mobile}
                      </a>

                      <a
                        href={`https://wa.me/${c.mobile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-gray-500 hover:text-green-500"
                      >
                        <FaWhatsapp className="text-lg" />
                      </a>
                    </div>
                  </td>

                  {/* Last Update */}
                  <td className="px-4 py-4 text-center text-gray-700">
                    {moment(c.offerDate).format("MMM DD, YYYY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile + Tablet Cards (Visible on < lg) */}
      {!loading && filteredCandidates.length > 0 && (
        <div
          className="
    grid
    grid-cols-1
    max-[1000px]:grid-cols-2     /* 2 cards when width < 937px */
    gap-4
    p-3
    max-[1000px]:p-4
    min-[1000px]:hidden          /* hide cards on desktop */
  "
        >
          {filteredCandidates.map((c) => (
            <div
              key={c._id}
              className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <p className="text-xs text-gray-500">
                    ID: {c._id?.slice(-5)} • {moment(c.createdAt).format("ll")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {renderStatusBadge(c?.status || "N/A")}
                </div>
              </div>

              {/* Domain + Experience */}
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                <FaBriefcase className="text-gray-500 text-sm" />
                <p>
                  {Array.isArray(c.domain) ? c.domain.join(", ") : c.domain}
                </p>
                <span className="text-gray-500">
                  ||{" "}
                  {c.experienceYears ? `${c.experienceYears} yrs` : "Fresher"}
                </span>
              </div>

              {/* Contact */}
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <p>
                  📧{" "}
                  <a href={`mailto:${c.email}`} className="hover:text-blue-500">
                    {c.email}
                  </a>
                </p>

                <p className="flex items-center gap-2">
                  📞{" "}
                  <a href={`tel:${c.mobile}`} className="hover:text-blue-500">
                    {c.mobile}
                  </a>
                  <a
                    href={`https://wa.me/${c.mobile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700"
                  >
                    <FaWhatsapp />
                  </a>
                </p>
              </div>

              {/* Last Update */}
              <p className="text-xs text-gray-500 mt-3">
                <span className="font-medium">Last Update:</span>{" "}
                {moment(c.offerDate).format("MMM DD, YYYY")}
              </p>
              <div className="mt-2">
                {c?.status === "onhold" && (
                  <button
                    onClick={() => onView(c)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-md text-sm font-medium"
                  >
                    <FaEye className="inline mr-1" /> View
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCandidate && (
        <CandidateInformation
          selectedCandidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          handleStatusUpdate={handleStatusUpdate}
          isAssignedTableButton={true}
          candidateStatus={true}
        />
      )}
    </div>
  );
};

export default CandidateStatus;
