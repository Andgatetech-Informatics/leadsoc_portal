import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Briefcase,
  MapPin,
  Users,
  Wrench,
  Flag,
  ArrowLeft,
  Clock,
  Wallet2,
} from "lucide-react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaScrewdriverWrench } from "react-icons/fa6";

import JobHeader from "../components/JobHeader";
import Pagination from "../components/Pagination";
import SubmitProfileModal from "./SubmitProfileModelBu";
import EditJobModal from "./EditJobModal";
import { baseUrl } from "../api";

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

/* -------------------- SMALL HOOK: debounce -------------------- */
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

/* -------------------- LOADING SKELETONS -------------------- */
const JobListSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 border rounded-xl bg-white shadow-sm animate-pulse"
        >
          <div className="flex justify-between">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-5 w-16 bg-gray-200 rounded-full" />
          </div>
          <div className="mt-3 flex gap-3">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </div>
          <div className="mt-3 h-3 w-52 bg-gray-200 rounded" />
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ✅ Details Loading Overlay */
const DetailsLoadingOverlay = () => {
  return (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-20">
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white shadow-md border">
        <div className="h-6 w-6 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-700">
          Loading job details...
        </p>
      </div>
    </div>
  );
};

/* -------------------- JOB CARD -------------------- */
const JobCard = ({ job, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-xl shadow-sm cursor-pointer transition 
        hover:shadow-lg hover:scale-[1.02] ${
          isSelected ? "border-blue-500" : "border-gray-200"
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
          <Briefcase size={16} /> {job.experienceMin} - {job.experienceMax} years
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
            priorityColors[job.priority] || "bg-gray-200 text-gray-600"
          }`}
        >
          {job.priority}
        </span>
      </p>

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

      <div className="flex justify-between items-center mt-3">
        <p className="text-xs text-gray-400">
          Posted {job.createdAt ? dayjs(job.createdAt).fromNow() : "N/A"}
        </p>
      </div>
    </div>
  );
};

/* -------------------- JOB DETAILS -------------------- */
const JobDetails = ({
  job,
  isExpanded,
  onToggleDescription,
  onBack,
  onSubmitProfile,
  onEditJob,
}) => {
  if (!job) {
    return (
      <p className="text-gray-500 m-auto text-center p-6 hidden md:block">
        Select a job to view details
      </p>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top Section */}
      <div className="p-4 border-b flex-shrink-0 bg-white z-10">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <button
              className="flex items-center gap-1 text-blue-600 mb-3 md:hidden"
              onClick={onBack}
            >
              <ArrowLeft size={18} /> Back to Jobs
            </button>

            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {job.title}
            </h2>
            <p className="text-base md:text-lg text-gray-700">
              {job.organization}
            </p>

            <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              {job.location}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={onSubmitProfile}
                className="px-4 md:px-5 py-2 rounded-lg text-sm md:text-base
                  bg-blue-600 text-white hover:bg-blue-700 
                  transition-all shadow-sm hover:shadow-md"
              >
                Submit Profile
              </button>

              <button
                onClick={onEditJob}
                className="px-4 md:px-5 py-2 rounded-lg text-sm md:text-base
                  bg-white border border-amber-500 text-amber-600
                  hover:bg-amber-50 hover:border-amber-600 
                  transition-all shadow-sm hover:shadow-md"
              >
                Edit Job
              </button>
            </div>
          </div>

          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              statusColors[job.status] || "bg-gray-200 text-gray-600"
            } mt-2`}
          >
            {job.status}
          </span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Experience */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Briefcase size={16} className="text-gray-400" />
              Experience
            </h3>
            <p className="text-gray-800 font-medium">
              {job.experienceMin} - {job.experienceMax} years
            </p>
          </div>

          {/* Priority */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Flag size={16} className="text-gray-400" />
              Priority
            </h3>
            <p
              className={`inline-block text-base font-semibold px-3 py-1 rounded-md ${
                priorityColors[job.priority] || "bg-gray-200 text-gray-600"
              } bg-opacity-10`}
            >
              {job.priority}
            </p>
          </div>

          {/* Positions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Users size={16} className="text-gray-400" />
              Positions
            </h3>
            <p className="text-gray-800 font-medium">
              {job.noOfPositions} Openings
            </p>
          </div>

          {/* Work Type */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              Work Type
            </h3>
            <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-200">
              {job.workType || "N/A"}
            </span>
          </div>

          {/* Job Type */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              Job Type
            </h3>
            <span className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full border border-green-200">
              {job.jobType || "N/A"}
            </span>
          </div>

          {/* Budget */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Wallet2 size={16} className="text-gray-400" />
              Budget
            </h3>
            <div className="space-y-1">
              <p className="text-gray-700 font-semibold">
                Actual:
                <span className="text-gray-900 font-medium">
                  {" "}
                  {job.budgetMin} - {job.budgetMax} LPA
                </span>
              </p>

              {job.modifiedBudgetMin && job.modifiedBudgetMax && (
                <p className="text-gray-700 font-semibold">
                  Revised:
                  <span className="text-gray-900 font-medium">
                    {" "}
                    {job.modifiedBudgetMin} - {job.modifiedBudgetMax} LPA
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Wrench size={16} className="text-gray-400" />
              Skills Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="bg-yellow-50 text-yellow-700 text-sm px-3 py-1 rounded-full border border-yellow-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Domain */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <FaScrewdriverWrench size={16} className="text-gray-400" />
              Domain
            </h3>

            <div className="flex flex-wrap gap-2">
              {job.domain?.map((domain, i) => (
                <span
                  key={i}
                  className="bg-red-50 text-red-700 text-sm px-3 py-1 rounded-full border border-red-200"
                >
                  {domain?.label || domain}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            Job Description
          </h3>

          <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
            {isExpanded
              ? job.description
              : `${job.description?.substring(0, 300) || ""}${
                  job.description?.length > 300 ? "..." : ""
                }`}
          </p>

          {job.description?.length > 300 && (
            <button
              className="text-blue-600 mt-2 hover:underline"
              onClick={onToggleDescription}
            >
              {isExpanded ? "See Less" : "See More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ActiveJobsBu = () => {
  const token = localStorage.getItem("token");

  const [selectedJob, setSelectedJob] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [filterStatus, setFilterStatus] = useState("All");
  const [experience, setExperience] = useState("All");
  const [location, setLocation] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [jobOpenings, setJobOpenings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // ✅ list loading
  const [loadingList, setLoadingList] = useState(false);

  const abortRef = useRef(null);
  const requestIdRef = useRef(0);

  const fetchJobs = useCallback(async () => {
    if (!token) return;

    const requestId = ++requestIdRef.current;

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoadingList(true);
    const startTime = Date.now();

    try {
      const { data } = await axios.get(`${baseUrl}/api/getjobs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          searchTerm: debouncedSearch,
          filterStatus,
          experience,
          location,
          page,
          limit: 8,
        },
        signal: abortRef.current.signal,
      });

      if (requestId !== requestIdRef.current) return;

      const jobs = data?.jobs || [];

      setJobOpenings(jobs);
      setTotalPages(data?.totalPages || 1);

      setSelectedJob((prev) => {
        if (!jobs?.length) return null;
        if (!prev?._id) return jobs[0];

        const stillExists = jobs.find((j) => j._id === prev._id);
        return stillExists || prev;
      });

      setIsExpanded(false);
    } catch (error) {
      if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED")
        return;
      console.error("Error fetching jobs:", error);
    } finally {
      const elapsed = Date.now() - startTime;
      const minTime = 300;
      const remaining = Math.max(minTime - elapsed, 0);

      setTimeout(() => {
        if (requestId === requestIdRef.current) {
          setLoadingList(false);
        }
      }, remaining);
    }
  }, [token, debouncedSearch, filterStatus, experience, location, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStatus, experience, location]);

  useEffect(() => {
    fetchJobs();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchJobs]);

  const handleSelectJob = useCallback((job) => {
    setSelectedJob(job);
    setIsExpanded(false);
  }, []);

  const handleBackToJobs = useCallback(() => {
    setSelectedJob(null);
    setIsExpanded(false);
  }, []);

  const jobsCount = useMemo(() => jobOpenings.length, [jobOpenings]);

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
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

      {/* Main */}
      <div className="flex flex-1 overflow-hidden gap-2 flex-col md:flex-row">
        {/* LIST VIEW */}
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

          {loadingList ? (
            <JobListSkeleton count={6} />
          ) : jobsCount === 0 ? (
            <p className="text-center text-gray-500">No jobs found</p>
          ) : (
            jobOpenings.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSelected={selectedJob?._id === job._id}
                onClick={() => handleSelectJob(job)}
              />
            ))
          )}
        </div>

        {/* DETAILS VIEW */}
        <div
          className={`w-full md:w-2/3 flex flex-col bg-white shadow-md overflow-hidden relative
          ${!selectedJob ? "hidden md:flex" : "flex"}`}
        >
          {/* ✅ Loading overlay on details */}
          {loadingList && <DetailsLoadingOverlay />}

          <JobDetails
            job={selectedJob}
            isExpanded={isExpanded}
            onToggleDescription={() => setIsExpanded((p) => !p)}
            onBack={handleBackToJobs}
            onSubmitProfile={() => setIsModalOpen(true)}
            onEditJob={() => setEditModalOpen(true)}
          />

          <SubmitProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            token={token}
            jobId={selectedJob?._id}
          />

          <EditJobModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            job={selectedJob}
            token={token}
            onUpdated={(updated) => {
              setSelectedJob(updated);
            }}
            fetchJobs={fetchJobs}
          />
        </div>
      </div>
    </div>
  );
};

export default ActiveJobsBu;
