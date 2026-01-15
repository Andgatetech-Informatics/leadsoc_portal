import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { FaPhoneSquareAlt, FaUserAlt, FaWhatsapp } from "react-icons/fa";
import { FaRegShareFromSquare } from "react-icons/fa6";
import moment from "moment";
import Pagination from "../components/Pagination";
import axios from "axios";
import { baseUrl } from "../api";
import { useNavigate } from "react-router-dom";

const HiredCandidates = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [candidateData, setCandidateData] = useState([]);
  const [search, setSearch] = useState("");

  const getHiredCandidates = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/bench_candidates?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (![200, 201].includes(res.status)) {
        throw new Error("Failed to request resubmission");
      }

      setCandidateData(res.data.data);
    } catch (error) {
      console.log("Error requesting resubmission:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Simulate loading
  useEffect(() => {
    setLoading(true);
    getHiredCandidates();
  }, [search]);

  // ✅ Search logic
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
  };

  // ✅ Skeleton loader
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
    <div className="overflow-x-auto bg-white border border-gray-200 shadow-sm rounded-xl p-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Hired Candidates
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Overview of all candidates currently in onboarding
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* ✅ Pagination Component (external) */}
      <div className="mt-2 mb-4">
        <Pagination />
      </div>

      {/* Table */}
      <div className="overflow-x-auto  rounded-xl shadow border border-gray-200 bg-white">
        {loading ? (
          <table className="w-full text-sm text-left table-auto">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs border-b font-medium">
              <tr>
                <th className="px-6 py-4">Applicant Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Applicant Details</th>
                <th className="px-6 py-4">Offer Date</th>
                <th className="px-6 py-4 text-center">Share</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </tbody>
          </table>
        ) : candidateData.length === 0 ? (


          <table className="w-full text-sm text-left table-auto">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs border-b font-medium">
              <tr>
                <th className="px-6 py-4">Applicant Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Applicant Details</th>
                <th className="px-6 py-4">Offer Date</th>
                <th className="px-6 py-4 text-center">Share</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan="5"
                  className="py-10 text-center text-gray-600 text-base"
                >
                  No hired candidates found.
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <>
            {/*  Desktop Table */}
            <table className="hidden sm:table w-full text-sm text-left table-auto">
              <thead className="bg-gray-200 text-gray-700 uppercase text-xs border-b font-medium">
                <tr>
                  <th className="px-6 py-4">Applicant Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Applicant Details</th>
                  <th className="px-6 py-4">Offer Date</th>
                  <th className="px-6 py-4 text-center">Share</th>
                </tr>
              </thead>

              <tbody className="divide-y text-sm">
                {candidateData.map((c, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    {/* Name */}
                    <td   onClick={() =>
                          navigate(`/application-tracker_hr/${c._id}`)
                        }
                        className="px-4 py-4 cursor-pointer align-top"
                      >
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-800">{c.name}</span>
                        <div className="flex items-center text-xs text-gray-500">
                          <FaUserAlt className="mr-1" />
                          <span>{c._id.slice(-5)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center bg-indigo-200 text-indigo-800 px-3.5 py-1 rounded-full text-xs font-medium border border-indigo-300">
                        {c.status}
                      </span>
                    </td>

                    {/* Contact */}
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

                    {/* Offer Date */}
                    <td className="px-4 py-4 text-gray-700">
                      {moment(c.offerDate).format("MMM DD, YYYY")}
                    </td>

                    {/* Share */}
                    <td className="px-4 py-4 text-center">
                      <button
                        title="Share"
                        className="p-2 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-full shadow-sm transition-all duration-200 hover:scale-105"
                      >
                        <FaRegShareFromSquare className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Card Layout */}
            <div className="block sm:hidden space-y-4 p-3">
              {candidateData.map((c, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {c.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        ID: {c._id.slice(-5)}
                      </p>
                    </div>
                    <span className="text-xs font-medium bg-indigo-200 text-indigo-800 border border-indigo-300 px-2.5 py-1 rounded-full">
                      {c.status}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="mt-3 space-y-1 text-sm text-gray-700">
                    <p>
                      📧{" "}
                      <a
                        href={`mailto:${c.email}`}
                        className="hover:text-blue-500 break-all"
                      >
                        {c.email}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      📞{" "}
                      <a
                        href={`tel:${c.mobile}`}
                        className="text-gray-600 hover:text-blue-500"
                      >
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
                    <p>📅 {moment(c.offerDate).format("MMM DD, YYYY")}</p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex justify-end">
                    <button
                      title="Share"
                      className="p-2 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-full shadow-sm transition-all duration-200 hover:scale-105"
                    >
                      <FaRegShareFromSquare className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HiredCandidates;
