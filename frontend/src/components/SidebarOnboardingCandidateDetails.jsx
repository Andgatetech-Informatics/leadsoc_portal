import React, { useMemo, useState } from "react";
import moment from "moment";
import FileViewer from "./FileViewer";
import ConfirmationModal from "./ConfirmationModal";
import RequestResubmissionModal from "./RequestResubmissionModel";

const SidebarOnboardingCandidateDetails = ({
  selectedCandidate,
  closeSidebar,
  handleRequestResubmission,
  handleOnboardCandidate,
  setSelectedCandidate,
}) => {
  if (!selectedCandidate) return null;

  const [showConfirm, setShowConfirm] = useState(false);
  const [showRequestConfirm, setShowRequestConfirm] = useState(false);

  const handleConfirmOnboard = () => {
    handleOnboardCandidate(candidate.candidateId._id);
    setShowConfirm(false);
  };

  const handleConfirmResubmission = (message) => {
    handleRequestResubmission(message,candidate.candidateId._id);
    setShowRequestConfirm(false);
  };

  const candidate = useMemo(() => {
    return {
      ...(selectedCandidate.candidateId || {}),
      ...selectedCandidate,
    };
  }, [selectedCandidate]);

  const getExperienceType = (isExperienced) => {
    if (isExperienced === true) return "Experienced";
    if (isExperienced === false) return "Fresher";
    return "-";
  };

  // Determine if Fresher
  const isFresher =
    candidate?.isExperienced === false ||
    candidate?.experienceType === false ||
    getExperienceType(candidate?.isExperienced) === "Fresher";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="w-full sm:w-[500px] bg-white h-full shadow-2xl flex flex-col animate-slideInRight overflow-y-auto rounded-md">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-indigo-50 to-indigo-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
            {candidate.name || "Candidate"} —{" "}
            <span className="text-gray-600 font-medium">Details</span>
            <span
              className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                isFresher
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-blue-100 text-blue-700 border border-blue-300"
              }`}
            >
              {isFresher ? "Fresher" : "Experienced"}
            </span>
          </h2>
          <button
            onClick={closeSidebar}
            className="text-gray-500 hover:text-red-500 transition-colors text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          {/* 👤 Personal Information */}
          <Section title="👤 Personal Information">
            <Grid>
              <Detail label="Name" value={candidate.name} />
              <Detail label="Email" value={candidate.email} />
              <Detail label="Mobile" value={candidate.mobile} />
              <Detail label="Gender" value={candidate.gender} />
              <Detail
                label="Date of Birth"
                value={candidate.dob ? moment(candidate.dob).format("ll") : "-"}
              />
              <Detail label="Marital Status" value={candidate.maritalStatus} />
              <Detail
                label="Date of Marriage"
                value={
                  candidate.dateOfMarriage
                    ? moment(candidate.dateOfMarriage).format("ll")
                    : "-"
                }
              />
              <Detail label="Blood Group" value={candidate.bloodGroup} />
              <Detail
                label="Emergency Contact Person"
                value={candidate.emergencyContactPerson}
              />
              <Detail
                label="Emergency Contact"
                value={candidate.emergencyContact}
              />
            </Grid>
          </Section>

          {/* 🏠 Address */}
          <Section title="🏠 Address Details">
            <Grid>
              <Detail label="Street" value={candidate.street} />
              <Detail label="City" value={candidate.city} />
              <Detail label="State" value={candidate.state} />
              <Detail label="Country" value={candidate.country} />
              <Detail label="Pincode" value={candidate.pincode} />
            </Grid>
          </Section>

          {/* 💼 Professional Info */}
          <Section title="💼 Professional Information">
            <Grid>
              <Detail
                label="Experience Type"
                value={getExperienceType(candidate.isExperienced)}
              />
              <Detail
                label="Domain"
                value={
                  Array.isArray(candidate.domain)
                    ? candidate.domain.join(", ")
                    : candidate.domain || "-"
                }
              />

              {/* Show only for experienced */}
              {!isFresher && (
                <>
                  <Detail
                    label="Total Experience"
                    value={candidate.totalExperience || "-"}
                  />
                  <Detail
                    label="Relevant Experience"
                    value={candidate.relevantExperience || "-"}
                  />
                </>
              )}

              <Detail
                label="Offered Designation"
                value={candidate.offeredDesignation || "-"}
              />
              <Detail
                label="Joining Date"
                value={
                  candidate.joiningDate
                    ? moment(candidate.joiningDate).format("ll")
                    : "-"
                }
              />
              <Detail
                label="Orientation Location"
                value={candidate.orientationLocation || "-"}
              />
              <Detail
                label="Aadhar Number"
                value={candidate.aadharNumber || "-"}
              />
              <Detail label="Pan Number" value={candidate.panNumber || "-"} />
            </Grid>
          </Section>

          {/* 🏢 Previous Company (Experienced only) */}
          {!isFresher && (
            <Section title="🏢 Previous Company Details">
              <Grid>
                <Detail
                  label="Last Company Name"
                  value={candidate.lastCompanyName || "-"}
                />
                <Detail
                  label="Last Designation"
                  value={candidate.lastDesignation || "-"}
                />
                <Detail
                  label="Last Working Day"
                  value={
                    candidate.lastWorkingDay
                      ? moment(candidate.lastWorkingDay).format("ll")
                      : "-"
                  }
                />
                <Detail
                  label="Last Company HR Contact"
                  value={candidate.lastCompanyHrContact || "-"}
                />
                <Detail
                  label="Last Company HR Email"
                  value={candidate.lastCompanyHrEmail || "-"}
                />
              </Grid>
            </Section>
          )}

          {/* 🏦 Bank Details (Experienced only) */}

          <Section title="🏦 Bank Details">
            <Grid>
              <Detail label="Bank Name" value={candidate.bankName || "-"} />
              <Detail
                label="Account Holder"
                value={candidate.accountHolderName || "-"}
              />
              <Detail
                label="Account No"
                value={candidate.accountNumber || "-"}
              />
              <Detail label="IFSC Code" value={candidate.ifscCode || "-"} />
              <Detail label="Branch" value={candidate.branchName || "-"} />
            </Grid>
          </Section>

          {/* 📄 Uploaded Documents */}
          <Section title="📄 Uploaded Documents">
            <Grid>
              <FileViewer
                label="10th Marksheet"
                file={candidate.tenthMarksheet}
              />
              <FileViewer
                label="12th Marksheet"
                file={candidate.twelfthMarksheet}
              />
              <FileViewer
                label="Graduation Marksheet"
                file={candidate.graduationMarksheet}
              />
              <FileViewer
                label="Post Graduation"
                file={candidate.postGraduation}
              />

              {/* Experienced-only documents */}
              {!isFresher && (
                <>
                  <FileViewer
                    label="Last Company Offer Letter"
                    file={candidate.lastCompanyOfferLetter}
                  />
                  <FileViewer
                    label="Experience Letter"
                    file={candidate.lastCompanyExperienceLetter}
                  />
                  <FileViewer
                    label="Relieving Letter"
                    file={candidate.lastCompanyRelievingLetter}
                  />
                  {candidate.lastCompanySalarySlips?.length > 0 ? (
                    candidate.lastCompanySalarySlips.map((file, i) => (
                      <FileViewer
                        key={i}
                        label={`Salary Slip ${i + 1}`}
                        file={file}
                      />
                    ))
                  ) : (
                    <FileViewer label="Salary Slips" file={null} />
                  )}
                </>
              )}

              <FileViewer
                label="Cancelled Cheque"
                file={candidate.cancelledCheque}
              />
              <FileViewer label="Aadhar" file={candidate.aadhar} />
              <FileViewer label="PAN" file={candidate.pan} />
              <FileViewer label="Passport" file={candidate.passport} />
              <FileViewer
                label="Signed Offer Letter"
                file={candidate.signedOfferLetter}
              />
              <FileViewer
                label="Passport Photo"
                file={candidate.passportPhoto}
              />
            </Grid>
          </Section>
        </div>

        {/* Footer */}
        <div className="p-5 border-t bg-gray-50 sticky bottom-0 flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Onboard Candidate
          </button>

          <button
            onClick={() => setShowRequestConfirm(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M3 14h18M10 3v18M14 3v18"
              />
            </svg>
            Request Resubmission
          </button>
        </div>
      </div>
      {/* Modals */}
      {showConfirm && (
        <ConfirmationModal
          onConfirm={handleConfirmOnboard}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showRequestConfirm && (
        <RequestResubmissionModal
          onConfirm={handleConfirmResubmission}
          onCancel={() => setShowRequestConfirm(false)}
        />
      )}
    </div>
  );
};

// Reusable UI helpers
const Section = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-2 gap-3 text-sm">{children}</div>
);

const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="font-medium text-gray-800">{value || "-"}</p>
  </div>
);

export default SidebarOnboardingCandidateDetails;
