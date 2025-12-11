import moment from "moment";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const RemarkModal = ({ isOpen, onClose, onSave, initialRemark }) => {
  const [remarks, setRemarks] = useState([]);
  const [remarkText, setRemarkText] = useState("");

  useEffect(() => {
    if (isOpen) setRemarks(initialRemark || "");
  }, [isOpen, initialRemark]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-[80vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors"
        >
          <FaTimes size={18} />
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Remark</h2>

        {/* Remarks List */}
        <div className="space-y-2 mb-4">
          {remarks && remarks.length > 0 ? (
            remarks.map((remark, index) => (
              <div key={index} className="p-2 border-b border-gray-200">
                <p className="text-sm text-gray-600">{remark.title}</p>
                <p className="text-xs text-gray-400">{moment(remark.date).format("lll")}</p>
                <p className="text-xs text-gray-400">By: {remark.name}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">No remarks available</p>
          )}
        </div>

        {/* Add New Remark */}
        <textarea
          value={remarkText}
          onChange={(e) => setRemarkText(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          placeholder="Add a remark..."
          rows={3}
        />

        {/* Save Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onSave(remarkText)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>

  );
};

export default RemarkModal;
