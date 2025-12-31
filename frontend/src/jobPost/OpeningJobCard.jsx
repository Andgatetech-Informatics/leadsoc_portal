import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { Search } from "lucide-react";
import axios from "axios";
import { baseUrl } from "../api";
import JobPostingForm from "./JobPostingForm";

const OpeningJobCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { organization } = location.state || {};

  const [jobOpenings, setJobOpenings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const limit = 3;

  /* ---------------- Debounce Search ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* ---------------- Reset Page on Org Change ---------------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [organization]);

  /* ---------------- Fetch Jobs ---------------- */
  const fetchJobs = async () => {
    if (!organization) return;

    setLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/api/getjobsSales`, {
        params: {
          organization: organization._id,
          page: currentPage,
          limit,
          searchTerm: debouncedSearch,
        },
      });

      setJobOpenings(data.jobs || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [debouncedSearch, currentPage, organization]);

  const formatSkills = (skills) =>
    Array.isArray(skills) ? skills.join(", ") : skills;

  return (
    <div className="bg-gray-50 w-full h-full p-4 sm:p-6">
      {/* ================= Company Header ================= */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left: Company Info */}
            <div className="flex items-center gap-4">
              {organization.logo ? (
                <img
                  src={`${baseUrl}/${organization.logo}`}
                  alt={organization.organization}
                  className="w-12 h-12 rounded-lg object-contain border bg-white"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold">
                  {organization.organization?.charAt(0)}
                </div>
              )}

              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {organization.organization}
                </h2>
                <p className="text-sm text-gray-500">{organization.industry}</p>
              </div>
            </div>

            {/* Right: Search + Post Job */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search job title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Post Job */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
              >
                + Post Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Toolbar ================= */}
      <div className="sticky top-0 z-20 bg-gray-50 py-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        />
      </div>

      {/* ================= Job List ================= */}
      <div className="mt-4 space-y-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border animate-pulse space-y-3"
            >
              <div className="h-5 w-1/3 bg-gray-200 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
              <div className="h-8 w-32 bg-gray-200 rounded" />
            </div>
          ))
        ) : jobOpenings.length ? (
          jobOpenings.map((job) => (
            <div
              key={job._id}
              className="group bg-white border border-gray-200 rounded-2xl p-6 transition
             hover:border-gray-300 hover:shadow-lg"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Left Content */}
                <div className="flex-1 space-y-3">
                  {/* Title & Job ID */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                      {job.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Job ID: <span className="font-medium">{job.jobId}</span>
                    </p>
                  </div>

                  {/* Status / Priority / Location */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge value={job.priority} />
                    <Badge value={job.status} />
                    <span className="text-gray-500">{job.location}</span>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    <Meta
                      label={`${job.experienceMin}-${job.experienceMax} yrs`}
                    />
                    <Meta label={`${job.noOfPositions} Positions`} />
                    <Meta
                      label={`Ends ${new Date(
                        job.endDate
                      ).toLocaleDateString()}`}
                    />
                  </div>
                </div>

                {/* Action */}
                <div className="flex justify-start lg:justify-end">
                  <button
                    onClick={() =>
                      navigate(`/view-candidates/${job._id}`, {
                        state: { jobId: job._id, organization },
                      })
                    }
                    className="inline-flex items-center justify-center px-6 py-2.5
                   text-sm font-medium rounded-lg border
                   border-indigo-600 text-indigo-600
                   hover:bg-indigo-600 hover:text-white
                   transition-all duration-200"
                  >
                    View Candidates
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 py-10">
            No job openings found
          </p>
        )}
      </div>

      {/* ================= Modal ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <JobPostingForm organization={organization} fetchJobs={fetchJobs} />
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= Helpers ================= */

const Meta = ({ label }) => (
  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md">
    {label}
  </span>
);

const Badge = ({ value }) => {
  const styles = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-gray-100 text-gray-600",
    Filled: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full font-medium ${
        styles[value] || "bg-gray-100 text-gray-600"
      }`}
    >
      {value || "N/A"}
    </span>
  );
};

export default OpeningJobCard;
