import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserAlt,
  FaPhoneSquareAlt,
  FaWhatsapp,
  FaEye,
  FaPlus,
  FaBriefcase,
  FaCalendarCheck,
} from "react-icons/fa";
import Pagination from "../components/Pagination";
import axios from "axios";
import { baseUrl } from "../api";
import { useSelector } from "react-redux";

const ApplicantsList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { userData } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidateData, setCandidateData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const statusStyles = {
    pending: {
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-300",
    },
    assigned: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-300",
    },
    onhold: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-300",
    },
    shortlisted: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-300",
    },
    rejected: {
      bg: "bg-rose-100",
      text: "text-rose-700",
      border: "border-rose-300",
    },
    approved: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-300",
    },
    hired: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-300",
    },

    default: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-300",
    },
  };

  // ✅ Fetch candidates
  const fetchCandidates = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseUrl}/api/candidates/freelancer/${userData._id}?page=${pageNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { candidates, totalPages } = res.data;
      setCandidateData(candidates || []);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setCandidateData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?._id) {
      fetchCandidates(page);
    }
  }, [page, userData]);

  const handleSearchChange = (e) => setSearch(e.target.value.toLowerCase());

  const filteredCandidates = candidateData.filter(
    (c) =>
      c.name?.toLowerCase().includes(search) ||
      c.email?.toLowerCase().includes(search) ||
      c.mobile?.toLowerCase().includes(search)
  );

  const handleRedirect = (status, candidateId) => {
    const redirectStatuses = ["assigned", "shortlisted", "submitted"];
    if (redirectStatuses.includes(status.toLowerCase())) {
      navigate(`/application-tracker_freelancer/${candidateId}`);
    }
  };

  const SkeletonLoader = () => (
    <tr className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Applicants List
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
          <button
            onClick={() => navigate("/profile-submission-form")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 shadow transition-all duration-200"
          >
            <FaPlus className="w-3.5 h-3.5" />
            <span>Add Profile</span>
          </button>

          <div className="relative w-full sm:w-64">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or mobile..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ✅ Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrevious={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      {/* ✅ TABLE (Desktop view) */}
      <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white hidden md:block">
        {loading ? (
          <table className="w-full text-sm text-left table-auto">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs border-b font-medium">
              <tr>
                <th className="px-6 py-4">Applicant Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Domain</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4">View</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </tbody>
          </table>
        ) : filteredCandidates.length === 0 ? (
          <p className="text-gray-600 p-4 text-center">No candidates found.</p>
        ) : (
          <table className="w-full text-sm text-left table-auto">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs border-b font-medium">
              <tr>
                <th className="px-6 py-4">Applicant Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Domain</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4">View</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredCandidates.map((c, index) => {
                const key = c.status?.toLowerCase() || "default";
                const style = statusStyles[key] || statusStyles.default;
                const isClickable = [
                  "assigned",
                  "shortlisted",
                  "approved",
                  
                ].includes(key);

                return (
                  <tr
                    key={c._id || index}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-800">{c.name}</span>
                        <div className="flex items-center text-xs text-gray-500">
                          <FaUserAlt className="mr-1" />
                          <span>{c._id.slice(-5)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div
                        onClick={() =>
                          isClickable ? handleRedirect(c.status, c._id) : null
                        }
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border 
                          ${style.bg} ${style.text} ${style.border} 
                          ${isClickable ? "cursor-pointer" : "cursor-default"}
                        `}
                      >
                        {c.status?.charAt(0).toUpperCase() + c.status?.slice(1)}
                        {isClickable && (
                          <FaEye className="w-3.5 h-3.5 ml-1 text-gray-600" />
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-800">
                          {Array.isArray(c.domain)
                            ? c.domain.join(", ")
                            : c.domain}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <FaBriefcase className="mr-1" />
                          <span>{c.experienceYears || "N/A"} years</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p>
                        <a
                          href={`mailto:${c.email}`}
                          className="hover:text-blue-500"
                        >
                          {c.email}
                        </a>
                      </p>
                      <div className="flex items-center mt-2">
                        <a
                          href={`tel:${c.mobile}`}
                          className="flex items-center text-gray-500 hover:text-blue-500"
                        >
                          <FaPhoneSquareAlt className="mr-2" />
                          {c.mobile}
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

                    <td className="px-4 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-800">
                          {c.preferredLocation}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <FaCalendarCheck className="mr-1" />
                          <span>{c.availability || "N/A"} days</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      {c.resume && (
                        <a
                          href={`${baseUrl}/${c.resume.replace(/\\/g, "/")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-purple-600 hover:text-purple-800"
                        >
                          View Resume
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ CARD LAYOUT (for small screens <1000px) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden mt-6">
        {filteredCandidates.map((c, i) => {
          const key = c.status?.toLowerCase() || "default";
          const style = statusStyles[key] || statusStyles.default;
          const isClickable = ["assigned", "shortlisted", "submitted"].includes(
            key
          );

          return (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-800 text-lg">
                  {c.name}
                </h2>
                <div
                  onClick={() =>
                    isClickable ? handleRedirect(c.status, c._id) : null
                  }
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    style.bg
                  } ${style.text} ${style.border} ${
                    isClickable ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  {c.status}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                <FaBriefcase className="inline mr-2" />
                {Array.isArray(c.domain) ? c.domain.join(", ") : c.domain}
              </p>

              <p className="text-sm text-gray-600 mb-2">
                <FaCalendarCheck className="inline mr-2" />
                {c.availability || "N/A"} days
              </p>

              <p className="text-sm text-gray-600 mb-2">
                <FaPhoneSquareAlt className="inline mr-2" />
                {c.mobile}
              </p>

              <a
                href={`mailto:${c.email}`}
                className="text-sm text-blue-600 underline block mb-3"
              >
                {c.email}
              </a>

              {c.resume && (
                <a
                  href={`${baseUrl}/${c.resume.replace(/\\/g, "/")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-600 underline"
                >
                  View Resume
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicantsList;
