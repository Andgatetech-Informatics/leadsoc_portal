import React, { useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../api";

const ConsentModel = ({
  setShowConsentModal,
  candidate,
  fetchCandidateDetails,
}) => {
  const [file, setFile] = useState(null);
  const [candidateType, setCandidateType] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  /* -------------------- DERIVED STATE -------------------- */
  const hasConsent = useMemo(
    () => candidate?.isConsentUploaded && candidate?.consentForm,
    [candidate]
  );

  const isFormInvalid = !file || !candidateType || isUploading;

  /* -------------------- HELPERS -------------------- */
  const closeModal = () => {
    setShowConsentModal(false);
    setFile(null);
    setCandidateType("");
  };

  /* -------------------- HANDLERS -------------------- */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (isFormInvalid) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("candidateType", candidateType);

      const res = await axios.post(
        `${baseUrl}/api/upload_consent/${candidate._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status !== 200) throw new Error();

      toast.success("Consent uploaded successfully");
      fetchCandidateDetails();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Consent upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`relative w-full rounded-2xl bg-white shadow-2xl
      ${hasConsent ? "max-w-6xl" : "max-w-md"}
    `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {hasConsent ? "Consent Preview" : "Upload Consent"}
          </h3>

          <button
            onClick={closeModal}
            className="rounded-md p-1.5 text-gray-400 transition
        hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        {hasConsent ? (
          <div className="h-[80vh] w-full overflow-hidden">
            <iframe
              src={`${candidate.consentForm}#toolbar=0&navpanes=0&scrollbar=0`}
              title="Consent Form"
              className="h-full w-full border-0"
            />
          </div>
        ) : (
          <div className="space-y-5 px-6 py-5">
            {/* Candidate Type */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Candidate Type <span className="text-red-500">*</span>
              </label>

              <select
                value={candidateType}
                onChange={(e) => setCandidateType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="">Select type</option>
                <option value="internal">On Bench</option>
                <option value="external">On Pipeline</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Upload PDF <span className="text-red-500">*</span>
              </label>

              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={isUploading}
                className="w-full cursor-pointer text-sm
            file:mr-4 file:rounded-lg file:border-0
            file:bg-blue-600 file:px-4 file:py-2
            file:text-white transition hover:file:bg-blue-700"
              />

              {file && (
                <p className="text-xs text-gray-500 truncate">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer (Upload only) */}
        {!hasConsent && (
          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <button
              onClick={closeModal}
              className="rounded-lg border px-4 py-2 text-sm
          text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isFormInvalid}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white transition
          hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsentModel;
