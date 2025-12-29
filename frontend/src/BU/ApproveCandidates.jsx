import React, { useEffect, useState } from "react";
import { Briefcase, Building2, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobHeader from "../components/JobHeader";
import axios from "axios";
import { baseUrl } from "../api";
import Pagination from "../components/Pagination";

/* ================= Status & Priority Colors ================= */

const statusColors = {
  Active: "bg-green-100 text-green-700",
  Filled: "bg-blue-100 text-blue-700",
  Inactive: "bg-gray-100 text-gray-600",
  "On Hold": "bg-yellow-100 text-yellow-700",
};

const priorityColors = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

/* ================= Component ================= */

const ApproveCandidates = ({ token }) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [experience, setExperience] = useState("All");
  const [location, setLocation] = useState("");

  const [jobOpenings, setJobOpenings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= Fetch Jobs ================= */

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/getjobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          searchTerm: search,
          filterStatus,
          experience,
          location,
          page,
          limit: 3,
        },
      });

      setJobOpenings(res.data.jobs || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, search, filterStatus, experience, location]);

  /* ================= UI ================= */

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
      <JobHeader
      title="Approved Candidates"
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        experience={experience}
        setExperience={setExperience}
        location={location}
        setLocation={setLocation}
      />

      {/* Pagination */}
      <div className="px-4 mt-2">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrevious={() => setPage((p) => Math.max(p - 1, 1))}
          onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
        />
      </div>

      {/* ================= Job List ================= */}
      <div className="p-2 space-y-4 ">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border animate-pulse space-y-3"
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
              className="group bg-white border border-gray-200 rounded-2xl p-6
              transition hover:border-gray-300 hover:shadow-lg"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Left */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                      {job.title}
                    </h3>

                    <p className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">
                        {job.organization || "N/A"}
                      </span>
                    </p>

                    <p className="text-xs text-gray-500">
                      Job ID: <span className="font-medium">{job.jobId}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Tag value={job.priority} map={priorityColors} />
                    <Tag value={job.status} map={statusColors} />
                    <span className="text-gray-500 flex items-center gap-1">
                      <MapPin size={14} />
                      {job.location}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    <Meta
                      label={`${job.experienceMin}-${job.experienceMax} yrs`}
                    />
                    <Meta label={`${job.noOfPositions} Positions`} />
                    {job.endDate && (
                      <Meta
                        label={`Ends ${new Date(
                          job.endDate
                        ).toLocaleDateString()}`}
                      />
                    )}
                  </div>
                </div>

                {/* Action */}
                <div className="flex justify-start lg:justify-end">
                  <button
                    onClick={() =>
                      navigate(`/referred-candidates_bu/${job._id}`, {
                        state: { jobId: job._id },
                      })
                    }
                    className="inline-flex items-center justify-center px-6 py-2.5
                    text-sm font-medium rounded-lg border
                    border-indigo-600 text-indigo-600
                    hover:bg-indigo-600 hover:text-white transition"
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
    </div>
  );
};

/* ================= Helpers ================= */

const Meta = ({ label }) => (
  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md">
    {label}
  </span>
);

const Tag = ({ value, map }) => (
  <span
    className={`px-2.5 py-1 rounded-full font-medium ${
      map[value] || "bg-gray-100 text-gray-600"
    }`}
  >
    {value || "N/A"}
  </span>
);

export default ApproveCandidates;
