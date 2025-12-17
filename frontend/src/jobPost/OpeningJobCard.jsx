// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Pagination from "../components/Pagination";
// import { Search } from "lucide-react";
// import axios from "axios";
// import { baseUrl } from "../api";
// import JobPostingForm from "./JobPostingForm";

// const OpeningJobCard = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { logo, organization, industry } = location.state || {};
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [jobOpenings, setJobOpenings] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 2; // Fixed items per page

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   // Fetch job listings based on the selected company
//   const fetchJobs = async () => {
//     setLoading(true);

//     try {
//       const response = await axios.get(`${baseUrl}/api/getjobs`, {
//         params: {
//           organization,
//           page: currentPage,
//           limit,
//           searchTerm,
//         },
//       });
//       setTotalPages(response.data.totalPages);
//       setJobOpenings(response.data.jobs);
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔑 Debounce Effect
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//       setCurrentPage(1);
//     }, 1000);

//     return () => clearTimeout(handler);
//   }, [searchTerm]);

//   useEffect(() => {
//     fetchJobs();
//   }, [debouncedSearch, currentPage, organization]);

//   const formatSkills = (skills) => {
//     return skills && Array.isArray(skills) ? skills.join(", ") : skills;
//   };

//   const postJob = (newJob) => {
//     closeModal(); // Close the job post modal after submitting
//     fetchJobs()
//   };

//   return (
//     <div className="bg-white w-full p-6 mb-8 rounded-lg shadow-lg">
//       {/* Company Header */}
//       <div className="flex justify-between gap-5 pb-6 border-b border-gray-200 flex-wrap sm:flex-nowrap">
//         <div className="flex items-center gap-5 w-full sm:w-auto mb-4 sm:mb-0">
//           {/* Company Logo */}
//           {logo ? (
//             <img
//               src={logo}
//               alt={organization}
//               className="w-16 h-16 object-contain rounded-full border border-gray-300"
//             />
//           ) : (
//             <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold text-lg">
//               {organization?.charAt(0).toUpperCase()}
//             </div>
//           )}

//           {/* Company Info */}
//           <div className="flex flex-col">
//             <h2 className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer">
//               {organization}
//             </h2>
//             <p className="text-base text-gray-600 font-medium mt-0.5">
//               {industry}
//             </p>
//             <span className="mt-2 inline-flex items-center text-xs font-medium text-green-700">
//               {jobOpenings.length} Active Openings
//             </span>
//           </div>
//         </div>

//         {/* Search Input */}
//         <div className="relative w-full sm:w-64">
//           <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
//           <input
//             type="text"
//             className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Search by name"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <div className="mt-3 text-end">
//             <button
//               onClick={openModal}
//               className="w-full sm:w-auto py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transform transition-all duration-200 ease-in-out active:scale-95"
//             >
//               Post Job
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Pagination */}
//       <div className="mt-2">
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//         />
//       </div>

//       {/* Job Listings */}
//       <div className="mt-6 space-y-6">
//         {loading ? (
//           // Skeleton Loader for Job Listings
//           <div className="space-y-6">
//             {[...Array(5)].map((_, index) => (
//               <div
//                 key={index}
//                 className="p-6 bg-white border border-gray-200 rounded-xl shadow-md animate-pulse"
//               >
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
//                   <div className="flex flex-col sm:w-3/4 space-y-3">
//                     <div className="w-36 h-6 bg-gray-300 rounded"></div>
//                     <div className="flex space-x-3">
//                       <div className="w-24 h-6 bg-gray-300 rounded"></div>
//                       <div className="w-24 h-6 bg-gray-300 rounded"></div>
//                     </div>
//                   </div>

//                   <div className="w-full sm:w-1/4 sm:flex sm:justify-end mt-4 sm:mt-0">
//                     <div className="w-28 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg animate-pulse"></div>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex flex-wrap gap-4 text-sm">
//                   <div className="w-36 h-5 bg-gray-300 rounded"></div>
//                   <div className="w-28 h-5 bg-gray-300 rounded"></div>
//                   <div className="w-36 h-5 bg-gray-300 rounded"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : jobOpenings.length > 0 ? (
//           jobOpenings.map((job) => (
//             <div
//               key={job._id}
//               className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl hover:border-indigo-500 transition-all duration-300"
//             >
//               {/* Job Title and Badges */}
//               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
//                 <div className="flex flex-col sm:w-3/4 space-y-2">
//                   <p className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors ease-in-out duration-200">
//                     {job.title}
//                   </p>

//                   <div className="flex space-x-3 mt-2">
//                     {/* Priority Badge */}
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${
//                         job.priority === "High"
//                           ? "bg-red-50 text-red-600"
//                           : job.priority === "Medium"
//                           ? "bg-yellow-50 text-yellow-600"
//                           : job.priority === "Low"
//                           ? "bg-green-50 text-green-600"
//                           : "bg-gray-50 text-gray-600"
//                       }`}
//                     >
//                       {job.priority
//                         ? `${
//                             job.priority.charAt(0).toUpperCase() +
//                             job.priority.slice(1)
//                           }`
//                         : "No Priority"}
//                     </span>

//                     {/* Status Badge */}
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${
//                         job.status === "Active"
//                           ? "bg-green-50 text-green-600"
//                           : job.status === "Inactive"
//                           ? "bg-gray-50 text-gray-600"
//                           : job.status === "On Hold"
//                           ? "bg-yellow-50 text-yellow-600"
//                           : job.status === "Filled"
//                           ? "bg-blue-50 text-blue-600"
//                           : "bg-gray-50 text-gray-600"
//                       }`}
//                     >
//                       {job.status
//                         ? `${
//                             job.status.charAt(0).toUpperCase() +
//                             job.status.slice(1)
//                           }`
//                         : "No Status"}
//                     </span>
//                   </div>

//                   <p className="text-sm text-gray-600">{job.location}</p>
//                 </div>

//                 <div className="flex sm:w-1/4 sm:justify-end mt-4 sm:mt-0">
//                   <button
//                     className="text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       navigate(`/view-candidates/${job._id}`, {
//                         state: {
//                           jobId: job._id,
//                           organization: job.organization,
//                         },
//                       });
//                     }}
//                   >
//                     View Candidates
//                   </button>
//                 </div>
//               </div>

//               {/* Job Meta Information */}
//               <div className="mt-4 flex flex-wrap gap-3 text-sm">
//                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md font-medium">
//                   {job.experienceMin} - {job.experienceMax} years
//                 </span>
//                 <span className="px-3 py-1 bg-green-50 text-green-600 rounded-md font-medium">
//                   {formatSkills(job.skills)}
//                 </span>

//                 <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-md font-medium">
//                   {job.noOfPositions} Positions
//                 </span>
//                 <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md">
//                   Ends: {new Date(job.endDate).toLocaleDateString()}
//                 </span>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-sm text-gray-500 text-center py-4">
//             No active openings
//           </p>
//         )}
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
//             <button
//               onClick={closeModal}
//               className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-2 transition-colors duration-200"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 className="w-5 h-5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>

//             <JobPostingForm
//               isOpen={isModalOpen}
//               closeModal={closeModal}
//               organizationName={organization}
//               onSubmit={postJob}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OpeningJobCard;

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
  const { logo, organization, industry } = location.state || {};

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
      const { data } = await axios.get(`${baseUrl}/api/getjobs`, {
        params: {
          organization,
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

  const postJob = () => {
    setIsModalOpen(false);
    fetchJobs();
  };

  return (
    <div className="bg-gray-50 w-full h-full p-4 sm:p-6">
{/* ================= Company Header ================= */}
<div className="bg-white border border-gray-200 rounded-xl shadow-sm">
  <div className="p-5 sm:p-6">

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      {/* Left: Company Info */}
      <div className="flex items-center gap-4">
        {logo ? (
          <img
            src={`${baseUrl}/${logo}`}
            alt={organization}
            className="w-12 h-12 rounded-lg object-contain border bg-white"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold">
            {organization?.charAt(0)}
          </div>
        )}

        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {organization}
          </h2>
          <p className="text-sm text-gray-500">{industry}</p>
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
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge value={job.priority} />
                    <Badge value={job.status} />
                    <span className="text-gray-500">{job.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
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

                <div className="flex items-center">
                  <button
                    onClick={() =>
                      navigate(`/view-candidates/${job._id}`, {
                        state: { jobId: job._id, organization },
                      })
                    }
                    className="px-5 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
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

            <JobPostingForm
              isOpen={isModalOpen}
              closeModal={() => setIsModalOpen(false)}
              organizationName={organization}
              onSubmit={postJob}
            />
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
