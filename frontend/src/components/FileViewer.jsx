import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import PdfOrImageModal from "./PdfOrImageModal";
import { toast } from "react-toastify";

const FileViewer = ({ label, file }) => {
  const [showModal, setShowModal] = useState(false);

  const handleView = () => {
    if (file) {
      setShowModal(true);
    } else {
      toast.warning("No document uploaded");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <FaEye
          onClick={handleView}
          className={`cursor-pointer text-lg ${
            file ? "text-blue-500 hover:text-blue-700" : "text-gray-300"
          }`}
          title={file ? "View Document" : "No File"}
        />
      </div>

      {/* Modal for PDF or Image preview */}
      <PdfOrImageModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        file={file}
        label={label}
      />
    </>
  );
};

export default FileViewer;
