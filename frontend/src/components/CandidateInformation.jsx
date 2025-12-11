import React, { useEffect, useState } from "react";
import { baseUrl } from "../api";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const CandidateInformation = ({
  selectedCandidate,
  onClose,
  handleStatusUpdate,
  isAssignedTableButton = false,
  isShortlistedTable = false,
  disableStatus
}) => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [hrList, setHrList] = useState([]);
  const [showAssignPopup, setShowAssignPopup] = useState(false);

  const [selectedHrId, setSelectedHrId] = useState("");
  const [selectedHrName, setSelectedHrName] = useState("");

  const [formData, setFormData] = useState({
    poc: "",
  });

  // Fetch HR List
  const getAllHrs = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/auth/get_all_hr`);
      if (response.status === 200) {
        setHrList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching HR list:", error);
    }
  };

  const handleAssign = async () => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/changeAssignedHR/${selectedCandidate._id}`,
        {
          assignedTo: selectedHrId,
          poc: selectedHrName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Candidate assigned to HR Successfully!");
        setShowAssignPopup(false);
        onClose();
        // if (handleStatusUpdate) handleStatusUpdate("pending");
      }
    } catch (error) {
      console.error("Error assigning HR:", error);
    }
  };

  // Load HR list only when modal opens
  useEffect(() => {
    if (selectedCandidate && isAssignedTableButton) {
      getAllHrs();
    }
  }, [selectedCandidate, isAssignedTableButton]);
  if (!selectedCandidate) return null;

  const handleButtonClick = async (status, actionText) => {
    setIsLoading(true);
    setButtonText(actionText);

    await handleStatusUpdate(status);

    setIsLoading(false);
    setButtonText("");
  };

  const Info = ({ label, value }) => (
    <div className="flex flex-col break-words">
      <span className="text-xs sm:text-sm text-gray-500 font-medium">
        {label}
      </span>
      <span className="text-sm sm:text-base text-gray-800">{value || "—"}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center px-2 sm:px-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border border-gray-200 rounded-2xl shadow-2xl p-4 sm:p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          aria-label="Close"
        >
          ×
        </button>

        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            Candidate Details
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Review the candidate's information and make a decision.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-end gap-2 mb-3 overflow-x-auto">
          {/* POC Dropdown */}
          {isAssignedTableButton && (selectedCandidate.status === "pending" || selectedCandidate.status === "assigned") && (
            <div className="flex flex-col">
              <select
                value={selectedHrId}
                onChange={(e) => {
                  const hrId = e.target.value;
                  setSelectedHrId(hrId);

                  // find HR name
                  const hr = hrList.find((h) => h._id === hrId);
                  setSelectedHrName(`${hr.firstName} ${hr.lastName}`);

                  // open popup immediately
                  setShowAssignPopup(true);
                }}
                className="border px-2 py-2 rounded"
              >
                <option value="">Change POC's</option>
                {hrList?.map((hr) => (
                  <option key={hr._id} value={hr._id}>
                    {hr.firstName} {hr.lastName}
                  </option>
                ))}
              </select>

              {showAssignPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded shadow-lg w-[350px]">
                    <h2 className="text-lg font-semibold mb-4">
                      Confirm Assignment
                    </h2>

                    <p className="text-sm mb-4">
                      Assign candidate to <b>{selectedHrName}</b>?
                    </p>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowAssignPopup(false)}
                        className="px-4 py-2 border rounded"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={async () => {
                          await handleAssign();
                          setShowAssignPopup(false);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {!isShortlistedTable && !disableStatus && (
            <button
              onClick={() => handleButtonClick("onhold", "On Hold...")}
              className="min-w-[100px] bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded text-sm text-center"
              disabled={isLoading}
            >
              {isLoading && buttonText === "On Hold..."
                ? buttonText
                : "On Hold"}
            </button>
          )}

          {isAssignedTableButton && selectedCandidate.status !== "assigned" && (
            <button
              onClick={() => handleButtonClick("assigned", "Accepting...")}
              className="min-w-[100px] bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded text-sm text-center"
              disabled={isLoading}
            >
              {isLoading && buttonText === "Accepting..."
                ? buttonText
                : "Accept"}
            </button>
          )}

          {!isShortlistedTable && !disableStatus &&(
            <button
              onClick={() => handleButtonClick("rejected", "Rejecting...")}
              className="min-w-[100px] bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm text-center"
              disabled={isLoading}
            >
              {isLoading && buttonText === "Rejecting..."
                ? buttonText
                : "Reject"}
            </button>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-sm">
          <Info label="Full Name" value={selectedCandidate.name} />
          <Info label="Email" value={selectedCandidate.email} />
          <Info label="Mobile" value={selectedCandidate.mobile} />
          <Info label="POC in ANDGATE" value={selectedCandidate.poc} />
          <Info
            label="Graduation Year"
            value={selectedCandidate.graduationYear}
          />
          <Info label="Degree" value={selectedCandidate.degree} />
          <Info label="Domain" value={selectedCandidate.domain.join(", ")} />
          <Info label="Availability" value={selectedCandidate.availability} />
          <Info
            label="Current Location"
            value={selectedCandidate.currentLocation}
          />
          <Info
            label="Preferred Locations"
            value={selectedCandidate.preferredLocation}
          />

          {/* Resume Link */}
          {selectedCandidate.resume &&
            (() => {
              const resumeUrl = `${baseUrl}/${selectedCandidate.resume}`;
              const isDoc =
                selectedCandidate.resume.endsWith(".doc") ||
                selectedCandidate.resume.endsWith(".docx");
              const viewUrl = isDoc
                ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                  resumeUrl
                )}`
                : resumeUrl;

              return (
                <Info
                  label="Resume"
                  value={
                    <a
                      href={viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800 transition"
                    >
                      📄 View Resume
                    </a>
                  }
                />
              );
            })()}
          {/* WhatsApp */}
          <Info
            label="WhatsApp"
            value={
              <a
                href={`https://wa.me/${selectedCandidate.mobile}`}
                className="text-green-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="text-2xl" />
              </a>
            }
          />
        </div>

        {/* Experience Section */}
        {selectedCandidate.experienceYears && (
          <div className="mt-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
              Experience Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-sm">
              <Info
                label="Experience Years"
                value={selectedCandidate.experienceYears}
              />
              <Info label="Self Rating" value={selectedCandidate.selfRating} />
              <Info
                label="Individual Role"
                value={selectedCandidate.individualRole}
              />
              <Info
                label="Bond Details"
                value={selectedCandidate.bondDetails}
              />
              <Info
                label="Bond Willingness"
                value={selectedCandidate.bondWilling}
              />
              <Info
                label="Relevant Experience"
                value={selectedCandidate.releventExp}
              />
              <Info
                label="Experience Including Training"
                value={selectedCandidate.expIncludingTraining}
              />
              <Info
                label="Job Change Reason"
                value={selectedCandidate.jobChangeReason}
              />
              <Info
                label="Interviews Attended"
                value={selectedCandidate.interviewsAttended}
              />
              <Info
                label="Foreign Work Experience"
                value={selectedCandidate.foreignWork}
              />
              <Info label="Skills" value={selectedCandidate.skills} />
              <Info label="CTC Details" value={selectedCandidate.currentCTC} />
              <Info
                label="Expected CTC"
                value={selectedCandidate.expectedCTC}
              />
              <Info
                label="Offers in Hand"
                value={selectedCandidate.offerDetails}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateInformation;
