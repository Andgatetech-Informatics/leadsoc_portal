import React, { useState } from "react";

const RequestResubmissionModal = ({ onCancel, onConfirm }) => {
  const [message, setMessage] = useState("");

  const handleConfirm = () => {
    onConfirm(message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-xl w-full max-w-96 shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Request Resubmission</h3>
        <p className="text-sm text-gray-600 mb-4">
          Your form needs correction. Please specify what needs to be fixed and
          confirm to request resubmission from this candidate.
        </p>

        {/* Textarea for correction details */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter correction details or comments..."
          rows={4}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-6"
        ></textarea>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            No
          </button>
          <button
            onClick={handleConfirm}
            disabled={!message.trim()}
            className={`px-5 py-2 text-sm rounded-md text-white transition ${
              message.trim()
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-400 cursor-not-allowed"
            }`}
          >
            Yes, Request Resubmission
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestResubmissionModal;
