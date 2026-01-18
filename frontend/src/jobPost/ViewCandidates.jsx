import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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
const TableSkeleton = ({ rows = 5, cols = 6 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i} className="animate-pulse border-b">
        {Array.from({ length: cols }).map((__, j) => (
          <td key={j} className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
          </td>
        ))}
      </tr>
    ))}
  </>
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

/* ====================== HELPERS ====================== */
const getCandidateOwnerLabel = (c) => {
  const parts = [];
  if (c?.taName) parts.push(`${c.taName} (TA)`);
  if (c?.vendorManagerName) parts.push(`${c.vendorManagerName} (VM)`);
  return parts.length ? parts.join(", ") : "NA";
};

const getResumeLink = (resumeUrl) => {
  if (!resumeUrl) return "N/A";
  return `${baseUrl}/${resumeUrl}`;
};

/* ====================== COMPONENT ====================== */
const ViewCandidates = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { jobId } = location.state || {};
  const token = localStorage.getItem("token");

  const [candidateData, setCandidateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCandidates = useCallback(async () => {
    if (!jobId || !token) {
      setCandidateData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${baseUrl}/api/shortlisted_candidates_activeJobs/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCandidateData(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setCandidateData([]);
    } finally {
      setLoading(false);
    }
  }, [jobId, token]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const filteredCandidates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return candidateData;

    return candidateData.filter((c) => {
      const searchableText = `
        ${c.firstName || ""} 
        ${c.lastName || ""} 
        ${c.email || ""} 
        ${c.mobile || ""} 
        ${c.skills || ""} 
        ${c.status || ""} 
        ${c.taName || ""} 
        ${c.vendorManagerName || ""}
      `
        .toLowerCase()
        .trim();

      return searchableText.includes(term);
    });
  }, [candidateData, searchTerm]);

  const handleDownloadXlsx = useCallback(() => {
    if (!filteredCandidates.length) return;

    const excelData = filteredCandidates.map((c, index) => ({
      "S.No": index + 1,
      "First Name": c.firstName || "",
      "Last Name": c.lastName || "",
      Email: c.email || "",
      Mobile: c.mobile || "",
      Status: c.status || "",
      Experience: c.experience || "",
      Skills: c.skills || "",
      "TA Name": c.taName || "",
      "Vendor Manager": c.vendorManagerName || "",
      "Expected CTC": c.expectedCTC || "",
      "Added At": c.addedAt ? new Date(c.addedAt).toLocaleString() : "",
      "Resume Link": getResumeLink(c.resumeUrl),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, `shortlisted_candidates_${jobId || "list"}.xlsx`);
  }, [filteredCandidates, jobId]);

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 sm:p-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800">
            Candidate Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Total: {filteredCandidates.length}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search name, email, mobile, status, skills"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleDownloadXlsx}
            disabled={loading || filteredCandidates.length === 0}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition
              ${
                loading || filteredCandidates.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
          >
            Download XLSX
          </button>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm border text-left border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-xs uppercase font-normal">
            <tr>
              <th className="px-6 py-4">Applicant</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Contact</th>
              <th className="px-6 py-4">Skills</th>
              <th className="px-6 py-4">TA / Vendor</th>
              <th className="px-6 py-4">Resume</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading && <TableSkeleton rows={6} cols={6} />}

            {!loading && filteredCandidates.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  No candidates found
                </td>
              </tr>
            )}

            {!loading &&
              filteredCandidates.map((c) => (
                <tr
                  key={c._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/application-tracker_sales/${c._id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium">
                      {c.firstName} {c.lastName}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <FaUserAlt /> {c._id?.slice(-5)}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <ProgressBar status={c.status} candidate={c} />
                  </td>

                  <td
                    className="px-4 py-4 max-w-[220px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={`mailto:${c.email}`}
                      className="block truncate text-gray-600 hover:text-blue-600"
                    >
                      {c.email || "N/A"}
                    </a>

                    <div className="flex items-center mt-2 text-gray-500 gap-3">
                      <a
                        href={`tel:${c.mobile}`}
                        className="flex items-center hover:text-blue-600"
                      >
                        <FaPhoneSquareAlt className="mr-2" />
                        {c.mobile || "N/A"}
                      </a>

                      {c.mobile && (
                        <a
                          href={`https://wa.me/${c.mobile}`}
                          className="hover:text-green-500"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaWhatsapp />
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>{c.skills || "N/A"}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <FaBriefcase /> {c.experience || "N/A"}
                    </div>
                  </td>

                  <td className="px-6 py-4">{getCandidateOwnerLabel(c)}</td>

                  <td
                    className="px-6 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {c.resumeUrl ? (
                      <a
                        href={getResumeLink(c.resumeUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 flex items-center gap-2 hover:underline"
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

      {/* ================= MOBILE / TABLET CARDS ================= */}
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

                    <p className="text-xs text-gray-500 mt-2">
                      {getCandidateOwnerLabel(c)}
                    </p>
                  </div>

                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {c.status || "N/A"}
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-600 space-y-2">
                  <p className="truncate">{c.email || "N/A"}</p>

                  <div className="flex items-center gap-4 text-gray-500">
                    {c.mobile && (
                      <a
                        href={`tel:${c.mobile}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-blue-600"
                      >
                        <FaPhoneSquareAlt />
                      </a>
                    )}

                    {c.mobile && (
                      <a
                        href={`https://wa.me/${c.mobile}`}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-green-500"
                      >
                        <FaWhatsapp />
                      </a>
                    )}

                    {c.resumeUrl && (
                      <a
                        href={getResumeLink(c.resumeUrl)}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600"
                      >
                        <FaEye />
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-3 text-sm">
                  <p className="font-medium">Skills</p>
                  <p className="text-gray-600">{c.skills || "N/A"}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <FaBriefcase /> {c.experience || "N/A"}
                  </p>
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
