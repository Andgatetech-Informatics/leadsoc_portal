import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaPhoneSquareAlt,
  FaWhatsapp,
  FaUserAlt,
  FaBriefcase,
} from "react-icons/fa";
import axios from "axios";
import { baseUrl } from "../api";
import { Link } from "react-router-dom";

const ViewCandidates = () => {
  const [candidateData, setCandidateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { jobId } = location.state || {}; // get jobId from navigation state
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    const normalizeSkills = (raw) => {
      if (Array.isArray(raw)) return raw;
      if (typeof raw === "string") {
        return raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    };

    const fetchCandidates = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/shortlisted_candidates_activeJobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCandidateData(res.data.data)

      } catch (err) {
        console.error("❌ Error fetching candidates:", err);
        setCandidateData([]);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchCandidates();
    else setLoading(false);
  }, [jobId, token]);

  if (loading) return <p className="p-6">Loading candidates...</p>;

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 shadow-sm rounded-xl p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Candidate Management
      </h1>

      {candidateData.length === 0 ? (
        <p className="text-gray-600">No candidates found.</p>
      ) : (
        <table className="w-full text-sm text-left table-auto border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold border-b sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4">Applicant Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Applicant Details</th>
              <th className="px-6 py-4">Skills</th>
              <th className="px-6 py-4">HR Name</th>
              <th className="px-6 py-4">Resume</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-sm bg-white">
            {candidateData.map((c, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate(`/application-tracker_dm/${c._id}`)}
              >
                {/* Applicant Name */}
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {c.firstName} {c.lastName}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-gray-500">
                    <FaUserAlt className="text-gray-500" />
                    <span>{c._id ? c._id.slice(-5) : ""}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${c.status === "shortlisted"
                        ? "bg-green-100 text-green-700"
                        : c.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : c.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }
            `}
                  >
                    {c.status}
                  </span>
                </td>

                {/* Applicant Details */}
                <td className="px-4 py-4">
                  <a
                    href={`mailto:${c.email}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {c.email}
                  </a>

                  <div className="flex items-center gap-3 mt-2 text-gray-600">
                    <a
                      href={`tel:${c.mobile}`}
                      className="flex items-center gap-2 hover:text-blue-600"
                    >
                      <FaPhoneSquareAlt />
                      {c.mobile}
                    </a>

                    <a
                      href={`https://wa.me/${c.mobile}`}
                      className="hover:text-green-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp className="text-xl" />
                    </a>
                  </div>
                </td>

                {/* Skills */}
                <td className="px-6 py-4">
                  <p className="text-gray-700">{c.skills}</p>

                  <div className="flex items-center gap-2 text-gray-500 mt-2">
                    <FaBriefcase />
                    <span>{c.experience}</span>
                  </div>
                </td>

                {/* HR Name */}
                <td className="px-6 py-4">
                  <span className="text-gray-800">{c.hrName}</span>
                </td>

                {/* Resume */}
                <td className="px-6 py-4">
                  {c.resumeUrl ? (
                    (() => {
                      const resumeUrl = `${baseUrl}/${c.resumeUrl}`;
                      const isDoc =
                        c.resumeUrl.endsWith(".doc") ||
                        c.resumeUrl.endsWith(".docx");

                      const viewUrl = isDoc
                        ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                          resumeUrl
                        )}`
                        : resumeUrl;

                      return (
                        <a
                          href={viewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                        >
                          <FaEye /> View Resume
                        </a>
                      );
                    })()
                  ) : (
                    <span className="text-gray-400">No Resume</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewCandidates;
