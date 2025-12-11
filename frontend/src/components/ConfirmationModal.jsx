import React from "react";

const ConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Confirm Action</h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to continue?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
