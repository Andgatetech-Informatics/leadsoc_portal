import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { baseUrl } from "../../api";
import { FaLock, FaPlus } from "react-icons/fa6";
import { FaSpinner, FaFileUpload } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import EventDetails from "./Feedback";
import { ArrowLeft, Edit, InfoIcon, Pencil, Trash } from "lucide-react";
import RemarkModal from "../../components/RemarkModal";
import "react-datepicker/dist/react-datepicker.css";
import InitiateCandidateModel from "../../components/InitiateCandidateModel";
import EventModal from "../../components/createEventModel";
import { localDatetimeToISOString } from "../../utils/utils"

const initialFormData = {
  candidate: {
    name: "",
    email: "",
    mobile: "",
  },
  interviewer: {
    interviewerId: "",
    name: "",
    email: "",
  },
  scheduledBy: "",
  eventName: "",
  interviewDate: "",
  meetingLink: "",
  organization: {
    companyId: "",
    name: "",
  },
};

const statusStyles = {
  pending: "bg-slate-100 text-slate-700",
  assigned: "bg-green-100 text-green-700",
  onhold: "bg-amber-100 text-amber-700",
  shortlisted: "bg-indigo-100 text-indigo-700",
  rejected: "bg-rose-100 text-rose-700",
  submitted: "bg-sky-100 text-sky-700",
  approved: "bg-teal-100 text-teal-700",
  default: "bg-gray-100 text-gray-700",
};

const ApplicationTracker = () => {
  const location = useLocation();
  const page = location.state?.page;
  const { candidateId } = useParams();
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.user.userData);
  const userRole = useSelector((state) => state.user.userData?.role);

  const [candidate, setCandidate] = useState({});
  const [events, setEvents] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [feedbackData, setFeedbackData] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [referanceKey, setReferanceKey] = useState(0);
  const [userLoading, setUserLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState({
    id: null,
    approved: false,
    rejected: false,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [initiateCandidateModel, setInitiateCandidateModel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null)
  const [isEditModelOpen, setIsEditEventOpen] = useState(null)

  const navigate = useNavigate();

  const hrEventOptions = [
    { value: "Screening", label: "Screening Round" },
    { value: "Technical 1", label: "Technical Round 1" },
    { value: "Technical 2", label: "Technical Round 2" },
    { value: "Technical 3", label: "Technical Round 3" },
    { value: "HR Discussion", label: "HR Discussion" },
  ];

  const deliveryEventOptions = [
    { value: "Orientation", label: "Orientation Round" },
    { value: "Client 1", label: "Client Round 1" },
    { value: "Client 2", label: "Client Round 2" },
    { value: "Client 3", label: "Client Round 3" },
  ];

  const eventOptions =
    userRole === "ta" ? hrEventOptions : deliveryEventOptions;

  const headers = {
    authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const capitalizeStatus = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "";

  const getStatusStyle = (status) =>
    statusStyles[status] || statusStyles.default;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e, eventId = null) => {
    e.preventDefault();
    setBtnLoading(true);

    const newEvent = {
      ...formData,
      scheduledBy: user._id,
      candidate: {
        domain: candidate.domain,
        name: candidate.name,
        email: candidate.email,
        mobile: candidate.mobile,
        candidateId: candidate._id,
        resume: candidate.resume,
      },
      interviewDate: localDatetimeToISOString(formData.interviewDate),
    };

    try {
      const method = eventId ? "patch" : "post";
      const url = eventId
        ? `${baseUrl}/api/event/edit/${eventId}`
        : `${baseUrl}/api/create_event`;


      const { status, data } = await axios[method](url, newEvent, { headers });

      if (![200, 201].includes(status)) {
        toast.error(data?.message || "Something went wrong!");
        return;
      }

      setFormData(initialFormData);
      setReferanceKey(prev => prev + 1);
      eventId ? setIsEditEventOpen(false) : setShowModal(false);
      toast.success(eventId ? "Event updated successfully!" : "Event added successfully!");
    } catch (error) {
      console.error("Error adding event:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to add event. Please try again.";
      toast.error(errorMessage);
    } finally {
      setBtnLoading(false);
    }
  };


  const handleViewFeedback = async (event) => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/feedback/get_feedback/${event._id}`
      );

      if (!data.success) {
        toast.error("No feedback found for this event.");
        return;
      }

      setFeedbackData({ ...data.data, event: event.eventName });
      setShowFeedbackModal(true);
    } catch (error) {
      console.error("Feedback fetch error:", error);
      toast.error("Failed to fetch feedback.");
    }
  };

  const fetchCandidateDetails = useCallback(async () => {
    setUserLoading(true);
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/candidate_details/${candidateId}`
      );
      setCandidate(data.data);
    } catch (error) {
      console.error("Candidate Fetch Error:", error);
      toast.error("Failed to fetch candidate.");
    } finally {
      setUserLoading(false);
    }
  }, [candidateId]);

  const handleStatusChange = async (id, newStatus) => {
    setLoading((prev) => ({ ...prev, id, [newStatus]: true }));
    try {
      const { data, status } = await axios.patch(
        `${baseUrl}/api/event/update_status/${id}`,
        { status: newStatus },
        { headers }
      );

      if (status !== 200 && status !== 201) {
        toast.error("Failed to update status");
        return;
      }

      setCandidate(data.data);
      fetchCandidateDetails();
      toast.success("Event status updated successfully!");
      setEvents((prev) =>
        prev.map((event) =>
          event._id === id ? { ...event, status: newStatus } : event
        )
      );
    } catch (error) {
      console.error("Status Change Error:", error);
      toast.error("An error occurred while updating the status.");
    } finally {
      setLoading((prev) => ({ ...prev, [newStatus]: false }));
    }
  };

  const fetchInterviewersAndCompanies = useCallback(async () => {
    try {
      const [intRes, compRes] = await Promise.all([
        axios.get(`${baseUrl}/api/auth/getAllAdminAndHrs`, { headers }),
        axios.get(`${baseUrl}/api/getAllOrganizations`, { headers }),
      ]);

      setInterviewers(
        intRes.data.data.map((person) => ({
          value: person.email,
          label: `${person.firstName} ${person.lastName}`,
          interviewerId: person._id,
        }))
      );

      setCompanies(compRes.data.data);
    } catch (error) {
      console.error("Fetch Interviewers/Companies Error:", error);
    }
  }, []);

  const fetchCandidateEvents = useCallback(async () => {
    try {
      setEventLoading(true);
      const { data } = await axios.get(
        `${baseUrl}/api/get_events/${candidateId}`,
        { headers }
      );

      if (data.status === true) setEvents(data.data);
    } catch (error) {
      console.error("Fetch Events Error:", error);
    } finally {
      setEventLoading(false);
    }
  }, [candidateId, deleteLoadingId]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      let response = await axios.post(
        `${baseUrl}/api/upload_consent/${candidate._id}`,
        uploadData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status !== 200) {
        toast.error("Consent form upload failed.");
        return;
      }

      fetchCandidateDetails();
      toast.success("File uploaded successfully");
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemarkSave = async (newRemark) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/add_remark/${candidate._id}`,
        { remark: newRemark },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Remark updated");
      } else {
        toast.error("Failed to update remark");
      }
    } catch (error) {
      console.error(
        "Candidate update Error:",
        error?.response?.data || error.message
      );
    } finally {
      setModalOpen(false);
      fetchCandidateDetails();
    }
  };

  const RejectedEvents = events.reduce((acc, curr) => {
    return acc + (curr.status === "rejected" ? 1 : 0);
  }, 0);

  const handleStatusUpdate = async () => {
    setLoading((prev) => ({ ...prev, rejected: true }));
    const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    try {
      const response = await axios.patch(
        `${baseUrl}/api/change_candidate_status/${candidateId}`,
        { status: "rejected" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(`Status updated to ${capitalizeFirst(status)}`);
        setReferanceKey((prev) => prev + 1);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(
        "Status Update Error:",
        error?.response?.data || error.message
      );
      toast.error(`Status updated to ${capitalizeFirst(status)}`);
    } finally {
      setLoading((prev) => ({ ...prev, rejected: false }));
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      setDeleteLoadingId(eventId);

      const response = await axios.delete(
        `${baseUrl}/api/event/delete/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(response.data.message)
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleEditEvent = (event) => {
    setIsEditEventOpen(event._id)
    try {
      setFormData(event);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }

  useEffect(() => {
    fetchCandidateDetails();
  }, [referanceKey, fetchCandidateDetails]);

  useEffect(() => {
    fetchInterviewersAndCompanies();
  }, [fetchInterviewersAndCompanies]);

  useEffect(() => {
    fetchCandidateEvents();
  }, [referanceKey, fetchCandidateEvents]);

  const enableConsentButton = events.reduce((acc, curr) => {
    return acc + (curr.status === "approved" ? 1 : 0);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto py-2 px-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          🎯 Application Tracker
        </h1>
        {/* Back Button */}

        <div
          onClick={() => {
            if (page) {
              navigate(`/assigned-candidates`, { state: { page } });
            } else {
              navigate(-1);
            }
          }}
          className="flex items-center gap-1 text-black cursor-pointer hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </div>
      </div>
      <div className="flex items-center justify-end mb-1 gap-2 text-sm">
        {!userLoading && (
          <>
            <span className="font-semibold text-base text-gray-700">
              Progress:
            </span>
            <span
              className={`px-3 py-1 rounded-full  font-medium text-sm ${getStatusStyle(
                candidate.status
              )}`}
            >
              {capitalizeStatus(candidate.status)}
            </span>
          </>
        )}
      </div>
      {/* Candidate Info */}
      {userLoading ? (
        <div className="bg-white p-6 rounded-lg shadow mb-10  animate-pulse">
          {/* Heading Skeleton */}
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />

          {/* Field Skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />{" "}
                  {/* Field label skeleton */}
                  <div className="h-4 bg-gray-200 rounded w-full" />{" "}
                  {/* Field value skeleton */}
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow mb-10">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <span>👤 {candidate.name}</span>
              <InfoIcon
                onClick={() => setModalOpen(true)}
                className="text-blue-500 w-4 h-4"
              />
            </h1>
            {modalOpen && (
              <RemarkModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleRemarkSave}
                initialRemark={candidate.remark || []}
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <strong>Email:</strong> {candidate.email}
            </div>
            <div>
              <strong>Phone:</strong> {candidate.mobile}
            </div>
            <div>
              <strong>Domain:</strong>{" "}
              {Array.isArray(candidate?.domain) && candidate.domain.length > 0
                ? candidate.domain.join(", ")
                : "N/A"}
            </div>
            <div>
              <strong>Degree:</strong> {candidate.degree}
            </div>
            <div>
              <strong>Experience:</strong>{" "}
              {candidate?.isExperienced
                ? `${candidate.experienceYears} Yrs`
                : "Fresher"}
            </div>
            <div>
              <strong>Skills:</strong> {candidate.skills}
            </div>
            {
              candidate.isAssigned && (
                <div>
                  <strong>Assigned TA:</strong> {candidate.poc}
                </div>
              )
            }

            {
              candidate.FreelancerId && (
                <div>
                  <strong>Vendor Name:</strong> {candidate.freelancerName}
                </div>
              )
            }

            {candidate.isReferred && candidate.referredJobDetails?.length > 0 && (
              <div className="relative group inline-block">
                {/* Tooltip Trigger */}
                <span className="cursor-pointer text-blue-600 text-sm font-medium underline">
                  Referred Jobs ({candidate.referredJobDetails.length})
                </span>

                {/* Tooltip */}
                <div className="absolute z-20 hidden group-hover:block w-80 max-w-xs bg-white border border-gray-200 rounded-lg shadow-lg p-3 mt-2">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Referred Job Details
                  </p>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {candidate.referredJobDetails.map((job) => (
                      <div
                        key={job._id}
                        className="text-xs text-gray-800 border-b last:border-b-0 pb-1"
                      >
                        <p className="font-medium">
                          {job.title}{" "}
                          <span className="text-gray-500">({job.jobId})</span>
                        </p>
                        <p className="text-gray-500">{job.organization}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Selection Rounds */}
      <div className="mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">
            <h2 className="text-lg font-semibold text-yellow-600 flex items-center gap-2">
              <FaLock /> Selection Rounds
            </h2>

            {userLoading ? null : (
              <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
                {/* Add Event Button */}
                {candidate.status !== "rejected" &&
                  candidate.status !== "approved" &&
                  userRole === "sales" && (
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <button
                        onClick={() => setInitiateCandidateModel(true)}
                        className="action-btn bg-green-500 text-white py-2 px-6 rounded-lg font-semibold transition-transform duration-200 transform hover:scale-105 hover:bg-green-600 focus:outline-none w-full sm:w-auto"
                      >
                        Initiate Candidate
                      </button>
                      {loading.rejected ? (
                        <div class="flex justify-center items-center gap-2 bg-red-500 text-white py-2 px-6 rounded-lg font-semibold w-full sm:w-auto">
                          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading...</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleStatusUpdate}
                          className="action-btn bg-red-500 text-white py-2 px-6 rounded-lg font-semibold transition-transform duration-200 transform hover:scale-105 hover:bg-red-600 focus:outline-none w-full sm:w-auto"
                        >
                          Reject Candidate
                        </button>
                      )}
                    </div>
                  )}

                {/* Upload Consent Button */}
                {enableConsentButton >= 2 && RejectedEvents === 0 && (
                  <>
                    <label
                      onClick={() => {
                        if (candidate?.consentForm) {
                          setShowConsentModal(true); // Open modal
                        }
                      }}
                      className={`relative w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-2.5
        text-sm font-medium rounded-lg shadow-md transition duration-200 ease-in-out
        ${isUploading || candidate?.consentForm
                          ? "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white cursor-pointer"
                        }`}
                    >
                      {isUploading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Please Wait
                        </>
                      ) : candidate?.consentForm ? (
                        <p>📄 View Consent Form</p>
                      ) : (
                        <>
                          <FaFileUpload className="mr-2" />
                          <p>Upload Consent PDF</p>
                        </>
                      )}

                      {!candidate?.consentForm && (
                        <input
                          type="file"
                          accept="application/pdf"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleFileChange}
                          disabled={isUploading}
                        />
                      )}
                    </label>

                    {/* Consent Form Modal */}
                    {showConsentModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="bg-white w-full max-w-5xl h-[90vh] rounded-lg shadow-lg p-4 relative flex flex-col">
                          <button
                            onClick={() => setShowConsentModal(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                          >
                            ❌
                          </button>
                          <h2 className="text-lg font-semibold mb-4">
                            Consent Form Preview
                          </h2>

                          <div className="flex-1 overflow-hidden">
                            <iframe
                              src={candidate.consentForm}
                              title="Consent Form"
                              className="w-full h-full border rounded"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {!eventLoading &&
                  candidate?.status !== "rejected" &&
                  user._id === candidate?.assignedTo && (
                    <button
                      onClick={() => { setShowModal(true); setFormData(initialFormData) }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 
      bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium 
      rounded-lg shadow-md transition duration-200 ease-in-out"
                    >
                      <FaPlus />
                      Add Event
                    </button>
                  )}
              </div>
            )}
          </div>

          {/* Event Cards */}
          {eventLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm bg-white animate-pulse"
                >
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2 text-sm">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex gap-2 mt-5">
                    <div className="h-10 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                return (
                  <div
                    key={event._id}
                    className="border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm bg-white hover:shadow-md transition-all duration-300 w-full"
                  >
                    {/* Header: Event name and status badge */}
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                      <h3 className="font-semibold text-lg sm:text-xl text-indigo-800">
                        {event.eventName}
                      </h3>

                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-block text-sm px-3 py-1 rounded-full font-medium ${getStatusStyle(
                            event.status
                          )}`}
                        >
                          {capitalizeStatus(event.status)}
                        </span>
                        {
                          user._id === event.scheduledBy ? (
                            <>
                              <button onClick={() => handleEditEvent(event)} className="p-1 rounded-full hover:bg-gray-100 transition">
                                <Edit className="w-4 h-4 text-gray-600 hover:text-yellow-500 cursor-pointer" />
                              </button>
                              <button onClick={() => handleDeleteEvent(event._id)} className="p-1 rounded-full hover:bg-gray-100 transition">
                                {
                                  deleteLoadingId === event._id ? (
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Trash
                                      className="w-4 h-4 text-gray-600 hover:text-red-500 cursor-pointer"
                                    />
                                  )
                                }
                              </button>
                            </>
                          ) : null
                        }
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm sm:text-base text-gray-700">
                      <p>
                        <span className="font-medium">👤 Interviewer:</span>{" "}
                        {event.interviewer?.name}
                      </p>
                      <p>
                        <span className="font-medium">📅 Date:</span>{" "}
                        {moment(event.interviewDate).format("MMMM Do YYYY, h:mm A")}
                      </p>
                      <p>
                        <span className="font-medium">🏢 Client:</span>{" "}
                        {event.organization?.name}
                      </p>
                    </div>

                    {/* Feedback Textarea */}
                    {(event.status === "submitted" ||
                      event.status === "approved" || event.status === "rejected") && (
                        <div className="mt-4">
                          <label
                            onClick={() => handleViewFeedback(event)}
                            className="cursor-pointer block text-sm font-medium text-gray-600 mb-1"
                          >
                            View Feedback
                          </label>
                        </div>
                      )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-5">
                      {event.status?.toLowerCase() === "submitted" &&
                        user._id === event.scheduledBy && (
                          <>
                            <button
                              onClick={() => {
                                setLoading((prev) => ({
                                  ...prev,
                                  id: event._id,
                                }));
                                handleStatusChange(event._id, "approved");
                              }}
                              disabled={
                                event.status.toLowerCase() !== "submitted" ||
                                (loading.id === event._id && loading.approved)
                              }
                              className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-semibold 
        ${event.status.toLowerCase() !== "submitted"
                                  ? "bg-green-400 text-white cursor-not-allowed"
                                  : loading.approved
                                    ? "bg-green-600 text-white cursor-wait"
                                    : "bg-green-600 hover:bg-green-700 text-white transition"
                                }`}
                            >
                              {loading.id === event._id && loading.approved ? (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                >
                                  {" "}
                                  Selecting...
                                </span>
                              ) : (
                                "Select"
                              )}
                            </button>

                            <button
                              onClick={() => {
                                setLoading((prev) => ({
                                  ...prev,
                                  id: event._id,
                                }));
                                handleStatusChange(event._id, "rejected");
                              }}
                              disabled={
                                event.status.toLowerCase() !== "submitted" ||
                                (loading.id === event._id && loading.rejected)
                              }
                              className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-semibold 
        ${event.status.toLowerCase() !== "submitted"
                                  ? "bg-red-400 text-white cursor-not-allowed"
                                  : loading.rejected
                                    ? "bg-red-600 text-white cursor-wait"
                                    : "bg-red-600 hover:bg-red-700 text-white transition"
                                }`}
                            >
                              {loading.id === event._id && loading.rejected ? (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                >
                                  {" "}
                                  Rejecting...
                                </span>
                              ) : (
                                "Reject"
                              )}
                            </button>
                          </>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {showFeedbackModal && (
        <EventDetails
          feedbackData={feedbackData}
          onClose={setShowFeedbackModal}
        />
      )}
      {/* Modal */}
      {showModal && (
        <EventModal
          title={"Add"}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          eventOptions={eventOptions}
          interviewers={interviewers}
          companies={companies}
          btnLoading={btnLoading}
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
        />
      )}

      {
        isEditModelOpen && (
          <EventModal
            title="Edit"
            isOpen={isEditModelOpen}
            onClose={() => setIsEditEventOpen(false)}
            onSubmit={handleSubmit}
            eventOptions={eventOptions}
            interviewers={interviewers}
            companies={companies}
            btnLoading={btnLoading}
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
          />
        )
      }

      {/* Initiate Candidate Model */}
      <InitiateCandidateModel
        candidateId={candidate._id}
        isOpen={initiateCandidateModel}
        onClose={() => setInitiateCandidateModel(false)}
        companies={companies}
        fetchCandidateDetails={fetchCandidateDetails}
      />
    </div>
  );
};

export default ApplicationTracker;
