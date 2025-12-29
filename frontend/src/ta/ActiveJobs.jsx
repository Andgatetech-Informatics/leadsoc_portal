import React, { useEffect, useState } from "react";
import {
  Bookmark,
  Briefcase,
  MapPin,
  Users,
  Wrench,
  Flag,
  ArrowLeft,
} from "lucide-react";
import JobHeader from "../components/JobHeader";
import SubmitProfileModal from "./SubmitProfileModel";
import axios from "axios";
import { baseUrl } from "../api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Pagination from "../components/Pagination";

dayjs.extend(relativeTime);

const statusColors = {
  Active: "bg-green-100 text-green-600",
  Filled: "bg-blue-100 text-blue-600",
  Inactive: "bg-gray-200 text-gray-600",
  "On Hold": "bg-yellow-100 text-yellow-600",
};

const priorityColors = {
  High: "bg-red-100 text-red-600",
  Medium: "bg-yellow-100 text-yellow-600",
  Low: "bg-green-100 text-green-600",
};

const ActiveJobs = ({ token, hrId }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [experience, setExperience] = useState("All");
  const [location, setLocation] = useState("");

  const toggleDescription = () => setIsExpanded(!isExpanded);

  // Fetch job listings from API
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/getjobsbu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          searchTerm: search,
          filterStatus,
          experience,
          location,
          page,
          limit: 8,
        },
      });
      setJobOpenings(response.data.jobs || []);
      setTotal(response.data.totalJobs);
      setTotalPages(response.data.totalPages);
      if (response.data.jobs?.length > 0) {
        setSelectedJob(response.data.jobs[0]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, search, filterStatus, experience, location]);

  const filteredJobs = jobOpenings.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus === "All" || job.status === filterStatus)
  );

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* 🔹 Header */}
      <div className="flex-shrink-0">
        <JobHeader
          title="Latest Job Openings"
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          experience={experience}
          setExperience={setExperience}
          location={location}
          setLocation={setLocation}
        />
      </div>

      {/* 🔹 Main Layout */}
      <div className="flex flex-1 overflow-hidden gap-2 flex-col md:flex-row">
        {/* ------------------ LIST VIEW ------------------ */}
        <div
          className={`w-full md:w-1/3 border-r overflow-y-auto p-4 space-y-4 bg-white
            ${selectedJob ? "hidden md:block" : "block"}`}
        >
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(p - 1, 1))}
            onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
          />
          {loading ? (
            <p className="text-center text-gray-500">Loading jobs...</p>
          ) : filteredJobs.length === 0 ? (
            <p className="text-center text-gray-500">No jobs found</p>
          ) : (
            filteredJobs.map((job) => {
              return (
                <div
                  key={job._id} // API jobs should have _id
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 border rounded-xl shadow-sm cursor-pointer transition 
                hover:shadow-lg hover:scale-[1.02] ${
                  selectedJob?._id === job._id
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        statusColors[job.status] || "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mt-2 gap-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Briefcase size={16} /> {job.experienceMin} -{" "}
                      {job.experienceMax} years
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={16} /> {job.noOfPositions} Positions
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {job.location}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        priorityColors[job.priority] ||
                        "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {job.priority}
                    </span>
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap mt-3 gap-2">
                    {job.skills?.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills?.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-400">
                      Posted{" "}
                      {job.createdAt ? dayjs(job.createdAt).fromNow() : "N/A"}
                    </p>
                    {/* <button className="text-gray-400 hover:text-blue-600">
                    <Bookmark size={18} />
                  </button> */}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ------------------ DETAILS VIEW ------------------ */}
        <div
          className={`w-full md:w-2/3 flex flex-col bg-white shadow-md overflow-hidden
          ${!selectedJob ? "hidden md:flex" : "flex"}`}
        >
          {selectedJob ? (
            <div className="flex flex-col h-full">
              {/* Top Section */}
              <div className="p-4 border-b flex-shrink-0 bg-white z-10">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    {/* Back button for mobile & tab */}
                    <button
                      className="flex items-center gap-1 text-blue-600 mb-3 md:hidden"
                      onClick={() => setSelectedJob(null)}
                    >
                      <ArrowLeft size={18} /> Back to Jobs
                    </button>

                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                      {selectedJob.title}
                    </h2>
                    <p className="text-base md:text-lg text-gray-700">
                      {selectedJob.organization}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {selectedJob.location}
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 px-4 md:px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
                    >
                      Submit Profile
                    </button>
                    <SubmitProfileModal
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      token={token}
                      jobId={selectedJob?._id}
                    />
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      statusColors[selectedJob.status] ||
                      "bg-gray-200 text-gray-600"
                    } mt-2`}
                  >
                    {selectedJob.status}
                  </span>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {/* Skills & Info */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Wrench size={16} className="text-gray-400" />
                      Skills Required
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills?.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-yellow-50 text-yellow-700 text-sm px-3 py-1 rounded-full border border-yellow-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Flag size={16} className="text-gray-400" />
                      Priority
                    </h3>
                    <p
                      className={`inline-block text-base font-semibold px-3 py-1 rounded-md ${
                        priorityColors[selectedJob.priority] ||
                        "bg-gray-200 text-gray-600"
                      } bg-opacity-10`}
                    >
                      {selectedJob.priority}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Briefcase size={16} className="text-gray-400" />
                      Experience
                    </h3>
                    <p className="text-gray-800 font-medium">
                      {selectedJob.experienceMin} - {selectedJob.experienceMax}{" "}
                      years
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      Positions
                    </h3>
                    <p className="text-gray-800 font-medium">
                      {selectedJob.noOfPositions} Openings
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                    Job Description
                  </h3>
                  <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                    {isExpanded
                      ? selectedJob.description
                      : `${selectedJob.description?.substring(0, 300)}...`}
                  </p>
                  {selectedJob.description?.length > 300 && (
                    <button
                      className="text-blue-600 mt-2 hover:underline"
                      onClick={toggleDescription}
                    >
                      {isExpanded ? "See Less" : "See More"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 m-auto text-center p-6 hidden md:block">
              Select a job to view details
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveJobs;
