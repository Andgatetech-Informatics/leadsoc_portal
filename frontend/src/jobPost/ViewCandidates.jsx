import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaPhoneSquareAlt,
  FaWhatsapp,
  FaUserAlt,
  FaBriefcase,
} from "react-icons/fa";
import { Search } from "lucide-react";
import axios from "axios";
import { baseUrl } from "../api";
import ProgressBar from "../components/ProgressBar";

/* ====================== SKELETONS ====================== */
const TableSkeleton = ({ rows = 5 }) => (
  <tbody>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i} className="animate-pulse border-b">
        {Array.from({ length: 6 }).map((__, j) => (
          <td key={j} className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

const CardSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="animate-pulse border rounded-xl p-4 bg-white space-y-3"
      >
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-8 bg-gray-200 rounded w-full" />
      </div>
    ))}
  </div>
);

/* ====================== COMPONENT ====================== */
const ViewCandidates = () => {
  const [candidateData, setCandidateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const { jobId } = location.state || {};
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/api/shortlisted_candidates_activeJobs/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCandidateData(res.data.data || []);
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setCandidateData([]);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchCandidates();
    else setLoading(false);
  }, [jobId, token]);

  const filteredCandidates = candidateData.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.hrName} ${c.status}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 sm:p-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800">
          Candidate Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search candidate, email, HR, status"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
            Download XLSX
          </button>
        </div>
      </div>

      {/* ================= DESKTOP TABLE (>=1000px) ================= */}
     <div className="hidden lg:block overflow-x-auto">
  <table className="w-full text-sm border text-left border-gray-200 rounded-lg overflow-hidden">
    <thead className="bg-gray-200 text-xs uppercase font-normal">
      <tr>
        <th className="px-6 py-4">Applicant</th>
        <th className="px-4 py-4">Status</th>
        <th className="px-4 py-4">Contact</th>
        <th className="px-6 py-4">Skills</th>
        <th className="px-6 py-4">HR</th>
        <th className="px-6 py-4">Resume</th>
      </tr>
    </thead>

    <tbody className="divide-y">
      {/* Loading */}
      {loading && <TableSkeleton rows={6} />}

      {/* No Candidates */}
      {!loading && filteredCandidates.length === 0 && (
        <tr>
          <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
            No candidates found
          </td>
        </tr>
      )}

      {/* Data */}
      {!loading &&
        filteredCandidates.length > 0 &&
        filteredCandidates.map((c) => (
          <tr
            key={c._id}
            className="hover:bg-gray-50 cursor-pointer"
            onClick={() =>
              navigate(`/application-tracker_sales/${c._id}`)
            }
          >
            <td className="px-6 py-4">
              <div className="font-medium">
                {c.firstName} {c.lastName}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <FaUserAlt /> {c._id?.slice(-5)}
              </div>
            </td>

            {/* Status */}
            <td className="px-4 py-3">
              <ProgressBar status={c.status} candidate={c} />
            </td>

            {/* Contact */}
            <td className="px-4 py-4 max-w-[220px]">
              <a
                href={`mailto:${c.email}`}
                className="block truncate text-gray-600"
              >
                {c.email}
              </a>
              <div className="flex items-center mt-2 text-gray-500">
                <a
                  href={`tel:${c.mobile}`}
                  className="flex items-center hover:text-blue-600"
                >
                  <FaPhoneSquareAlt className="mr-2" />
                  {c.mobile}
                </a>
                <a
                  href={`https://wa.me/${c.mobile}`}
                  className="ml-2 hover:text-green-500"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </td>

            {/* Skills */}
            <td className="px-6 py-4">
              <div>{c.skills}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                <FaBriefcase /> {c.experience}
              </div>
            </td>

            {/* HR */}
            <td className="px-6 py-4">{c.hrName}</td>

            {/* Resume */}
            <td className="px-6 py-4">
              {c.resumeUrl ? (
                <a
                  href={`${baseUrl}/${c.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 flex items-center gap-1"
                >
                  <FaEye /> View
                </a>
              ) : (
                "N/A"
              )}
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>


      {/* ================= MOBILE / TABLET CARDS (<1000px) ================= */}
      <div className="lg:hidden">
        {loading ? (
          <CardSkeleton />
        ) : filteredCandidates.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No candidates found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCandidates.map((c) => (
              <div
                key={c._id}
                onClick={() => navigate(`/application-tracker_sales/${c._id}`)}
                className="border rounded-xl p-4 bg-white hover:shadow cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {c.firstName} {c.lastName}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <FaUserAlt /> {c._id?.slice(-5)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.status === "shortlisted"
                        ? "bg-green-100 text-green-700"
                        : c.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  <p>{c.email}</p>
                  <div className="flex gap-4 mt-2">
                    <FaPhoneSquareAlt />
                    <FaWhatsapp />
                  </div>
                </div>

                <div className="mt-3 text-sm">
                  <p className="font-medium">Skills</p>
                  <p className="text-gray-600">{c.skills}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <FaBriefcase /> {c.experience}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-700">HR: {c.hrName}</span>
                  {c.resumeUrl && <FaEye className="text-blue-600" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCandidates;
