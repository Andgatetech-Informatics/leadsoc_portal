import { Search } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import {
  FaEye,
  FaPhoneSquareAlt,
  FaWhatsapp,
  FaUserAlt,
  FaUpload,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../api";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import SidebarOnboardingCandidateDetails from "../components/SidebarOnboardingCandidateDetails";
import _ from "lodash";

const OnboardingCandidates = () => {
  const navigate = useNavigate();
  const [candidateData, setCandidateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [reviewLoading, setReviewLoading] = useState(false);
  // Sidebar
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleUploadOffer = async (candidateId) => {
    setUploading(true);
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${baseUrl}/api/send_offer_letter/${candidateId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (![200, 201].includes(res.status)) {
        throw new Error("Failed to send offer letter");
      }

      fetchOnboardingCandidates();
      toast.success("Offer letter uploaded successfully");
    } catch (error) {
      console.log("Error uploading offer letter:", error);
    } finally {
      setUploading(false);
      closeModal();
    }
  };
  // Fetch candidates
  const fetchOnboardingCandidates = async (
    currentPage = page,
    searchQuery = search
  ) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: currentPage,
        limit,
        search: searchQuery,
      });

      const res = await axios.get(
        `${baseUrl}/api/get_onboarding_candidates?${query}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (![200, 201].includes(res.status))
        throw new Error("Failed to fetch candidates");

      setCandidateData(res.data.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    _.debounce((value) => {
      setPage(1);
      fetchOnboardingCandidates(1, value);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleRequestResubmission = async (message, candidateId) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/reinitiate-onboarding-form/${candidateId}`,
        { reason: message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (![200, 201].includes(res.status)) {
        throw new Error("Failed to request resubmission");
      }

      toast.success("Resubmission requested successfully");
      setShowSidebar(false);
      fetchOnboardingCandidates();
    } catch (error) {
      console.log("Error requesting resubmission:", error);
    }
  };

  const handleOnboardCandidate = async (id) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/change_candidate_status/${id}`,
        { status: "hired" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success(
          `Great! Status is now set to Hired.`
        );
        setShowSidebar(false);
        fetchOnboardingCandidates();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(
        "Candidate update Error:",
        error?.response?.data || error.message
      );
    }
  };

  const handleViewCandidate = async (candidate) => {
    try {
      setReviewLoading(true);
      const res = await axios.get(
        `${baseUrl}/api/onboarding-form/candidate/${candidate._id}`
      );

      if (!res.data.success) {
        throw new Error(
          res.data.message || "Failed to fetch candidate details"
        );
      }

      // console.log("Fetched candidate details:", res.data.data);

      setSelectedCandidate(res.data.data);
      setShowSidebar(true);
    } catch (error) {
      console.error("❌ Error fetching onboarding details:", error);
      toast.error(
        error.response?.data?.message || "Failed to load candidate details"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  const closeSidebar = () => {
    setSelectedCandidate(null);
    setShowSidebar(false);
  };

  const filteredCandidates = candidateData.filter((c) => {
    if (filterStatus === "All") return true;
    return c.status.toLowerCase() === filterStatus.toLowerCase();
  });

  useEffect(() => {
    fetchOnboardingCandidates();
  }, [page]);

  const SkeletonLoader = () => (
    <tr className="animate-pulse">
      <td className="px-4 py-3 truncate max-w-[120px]">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded mt-2"></div>
      </td>
      <td className="px-4 py-3 truncate max-w-[100px]">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </td>
      <td className="px-4 py-3 truncate max-w-[130px]">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </td>
      <td className="px-4 py-3 truncate max-w-[130px]">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </td>
    </tr>
  );

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 shadow-sm rounded-xl p-6 relative">
      {/* Title + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Onboarding Candidates
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Overview of all candidates currently in onboarding
          </p>
        </div>
        <div className="flex flex-row sm:flex-row sm:items-center sm:justify-end gap-3 ">
          {/* Status Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w- border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="All">All Status</option>
              <option value="approved">Approved</option>
              <option value="review">Review</option>
            </select>
          </div>
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
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
      </div>

      {/* Pagination */}
      <div className="mt-2 mb-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrevious={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>

      {/* Table / Cards */}
      <div className="overflow-x-auto  rounded-xl shadow border border-gray-200 bg-white">
        {loading ? (
          <table className="w-full text-sm text-left table-auto">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs border-b">
              <tr>
                <th className="px-6 py-4">APPLICANT NAME</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-4 py-3">APPLICANT DETAILS</th>
                <th className="px-6 py-4">Joining Date</th>
                <th className="px-6 py-4">Feedback</th>
                <th className="px-6 py-4">Upload</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </tbody>
          </table>
        ) : filteredCandidates.length === 0 ? (

          <table className="w-full text-sm text-left table-auto">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs border-b font-medium">
              <tr>
                <th className="px-6 py-4">APPLICANT NAME</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-4 py-3">APPLICANT DETAILS</th>
                <th className="px-6 py-4">Joining Date</th>
                <th className="px-6 py-4">Feedback</th>
                <th className="px-6 py-4">Upload</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan="5"
                  className="py-10 text-center text-gray-600 text-base"
                >
                  No onboarding candidates found.
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <>
            {/* Desktop Table */}
            <table className="hidden sm:table w-full text-sm text-left table-auto">
              <thead className="bg-gray-200 text-gray-700 uppercase text-xs border-b font-medium">
                <tr>
                  <th className="px-6 py-4">APPLICANT NAME</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-4 py-3">APPLICANT DETAILS</th>
                  <th className="px-6 py-4">Joining Date</th>
                  <th className="px-6 py-4">Feedback</th>
                  <th className="px-6 py-4">Referred</th>
                  <th className="px-6 py-4">Initited Date</th>
                  <th className="px-6 py-4">Upload</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredCandidates.map((c, index) => {
                  const status = c.status || "Pending";
                  const normalizedStatus = status.toLowerCase();

                  const statusClasses =
                    normalizedStatus === "approved"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : normalizedStatus === "review"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                        : "bg-gray-100 text-gray-700 border-gray-300";

                  return (
                    <tr
                      key={index}
                      className={`transition-colors ${normalizedStatus === "review"
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      {/* Name */}
                      <td
                        onClick={() => navigate(`/application-tracker_hr/${c._id}`)}
                        className="px-4 py-4 cursor-pointer align-top"
                      >
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-gray-900">
                            {c.name}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <FaUserAlt className="mr-1" />
                            <span>#{c._id.slice(-5)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 align-top">
                        {reviewLoading ? (
                          // Loading skeleton for status pill
                          <div className="inline-flex items-center px-2.5 py-1 rounded-full border bg-gray-100">
                            <span className="h-3 w-16 rounded-full bg-gray-300 animate-pulse" />
                          </div>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusClasses}`}
                          >
                            {status}
                            {normalizedStatus === "review" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewCandidate(c);
                                }}
                                className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                                title="View Details"
                              >
                                <FaEye className="text-sm" />
                              </button>
                            )}
                          </span>
                        )}
                      </td>

                      {/* Contact Details */}
                      <td className="px-4 py-4 align-top">
                        <a
                          href={`mailto:${c.email}`}
                          className="block text-xs text-gray-700 hover:text-blue-600 break-all"
                        >
                          {c.email}
                        </a>
                        <div className="flex items-center mt-2 gap-2 text-xs text-gray-600">
                          <a
                            href={`tel:${c.mobile}`}
                            className="inline-flex items-center hover:text-blue-600"
                          >
                            <FaPhoneSquareAlt className="mr-1" />
                            {c.mobile}
                          </a>
                          <a
                            href={`https://wa.me/${c.mobile}`}
                            className="inline-flex items-center hover:text-green-600"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                          >
                            <FaWhatsapp className="text-lg" />
                          </a>
                        </div>
                      </td>

                      {/* Joining Date */}
                      <td className="px-4 py-4 align-top text-xs text-gray-700 whitespace-nowrap">
                        {c.joiningDate ? moment(c.joiningDate).format("lll") : "N/A"}
                      </td>

                      {/* Feedback */}
                      <td className="px-4 py-4 align-top text-xs text-gray-700 max-w-xs">
                        {c.joiningFeedback ? (
                          <span className="line-clamp-2">{c.joiningFeedback}</span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>

                      {/* Referred */}
                      <td className="px-4 py-4 align-top text-xs text-gray-700">
                        {c.isReferred ? (
                          <span className="inline-flex px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-200">
                            No
                          </span>
                        )}
                      </td>

                      {/* Onboarding Initiated At */}
                      <td className="px-4 py-4 align-top text-xs text-gray-700 whitespace-nowrap">
                        {c.onboardingInitiated && c.onboardingInitiatedAt
                          ? moment(c.onboardingInitiatedAt).format("lll")
                          : "N/A"}
                      </td>

                      {/* Upload / Send Offer */}
                      <td className="px-4 py-4 align-top">
                        <button
                          onClick={() => {
                            openModal();
                            setSelectedCandidateId(c._id);
                          }}
                          disabled={c.onboardingInitiated}
                          className={`w-full flex items-center justify-center gap-2 text-white text-xs md:text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition ${c.onboardingInitiated
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                            }`}
                        >
                          {c.onboardingInitiated ? (
                            <span>Offer Initiated</span>
                          ) : (
                            <>
                              <FaUpload className="text-sm" />
                              <span>Send Offer</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="block sm:hidden space-y-4">
              {filteredCandidates.map((c, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{c.name}</h3>
                      <p className="text-xs text-gray-500">
                        ID: {c._id.slice(-5)}
                      </p>
                    </div>
                    {reviewLoading ? (
                      <div className="inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full border bg-gray-100">
                        <span className="h-3 w-16 rounded-full bg-gray-300 animate-pulse" />
                        <span className="h-4 w-4 rounded-full bg-gray-300 animate-pulse" />
                      </div>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full border ${c.status?.toLowerCase() === "approved"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : c.status?.toLowerCase() === "review"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                      >
                        <span>{c.status}</span>

                        {c.status?.toLowerCase() === "review" && (
                          <button
                            onClick={() => handleViewCandidate(c)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center justify-center"
                            title="View Details"
                          >
                            <FaEye className="text-sm" />
                          </button>
                        )}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 text-sm text-gray-700 space-y-2 leading-relaxed">

                    {/* Email */}
                    <p className="flex items-center gap-2">
                      <span className="text-base">📧</span>
                      <a
                        href={`mailto:${c.email}`}
                        className="text-gray-700 hover:text-blue-600 font-medium break-all"
                      >
                        {c.email}
                      </a>
                    </p>

                    {/* Phone + WhatsApp */}
                    <p className="flex items-center gap-2">
                      <span className="text-base">📞</span>
                      <a
                        href={`tel:${c.mobile}`}
                        className="text-gray-700 hover:text-blue-600 font-medium"
                      >
                        {c.mobile}
                      </a>

                      <a
                        href={`https://wa.me/${c.mobile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700"
                        title="Chat on WhatsApp"
                      >
                        <FaWhatsapp className="text-lg" />
                      </a>
                    </p>

                    {/* Date */}
                    <p className="flex items-center gap-2">
                      <span className="text-base">🗓</span>
                      <span>{moment(c.joiningDate).format("lll")}</span>
                    </p>

                    {/* Feedback */}
                    <p className="flex items-center gap-2">
                      <span className="text-base">💬</span>
                      {c.joiningFeedback ? (
                        <span>{c.joiningFeedback}</span>
                      ) : (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </p>

                    {/* Referral */}
                    <p className="flex items-center gap-2">
                      <strong className="font-medium">Referral:</strong>
                      <span>{c.isReferred ? "Yes" : "No"}</span>
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        openModal();
                        setSelectedCandidateId(c._id);
                      }}
                      disabled={c.onboardingInitiated}
                      className={`flex items-center justify-center gap-2 text-white text-sm px-3 py-2 rounded-md focus:outline-none transition ${c.onboardingInitiated
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                      {c.onboardingInitiated ? (
                        <span>Offer Initiated</span>
                      ) : (
                        <>
                          <FaUpload /> <span>Send Offer</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-auto">
            <h2 className="text-xl font-semibold mb-4">Upload Offer Letter</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Upload Offer Letter
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUploadOffer(selectedCandidateId)}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {uploading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Drawer */}
      {showSidebar && (
        <SidebarOnboardingCandidateDetails
          selectedCandidate={selectedCandidate}
          closeSidebar={closeSidebar}
          handleRequestResubmission={handleRequestResubmission}
          handleOnboardCandidate={handleOnboardCandidate}
          setSelectedCandidate={setSelectedCandidate}
        />
      )}
    </div>
  );
};

export default OnboardingCandidates;
