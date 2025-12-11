import React from "react";
import { FaDownload, FaTimes } from "react-icons/fa";

const PdfOrImageModal = ({ isOpen, onClose, file, label }) => {
  if (!isOpen) return null;

  // Detect file type
  const isPdf =
    file?.includes("application/pdf") ||
    file?.startsWith("JVBER") ||
    file?.endsWith(".pdf");

  const isImage =
    file?.includes("image/") ||
    file?.startsWith("/") ||
    file?.startsWith("iVBOR") ||
    file?.startsWith("/9j/");

  let src = file;
  if (!file?.startsWith("data:")) {
    if (isPdf) src = `data:application/pdf;base64,${file}`;
    if (isImage) src = `data:image/jpeg;base64,${file}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
            <p className="text-sm text-gray-500">Preview Document</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-all"
              title="Close"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex-1 bg-gray-100 p-5 flex items-center justify-center">
          {isPdf ? (
            <iframe
              src={src}
              title="PDF Viewer"
              className="w-full h-full rounded-xl border border-gray-300 shadow-inner bg-white"
            ></iframe>
          ) : isImage ? (
            <div className="w-full h-full flex items-center justify-center bg-white rounded-xl border border-gray-300 shadow-inner">
              <img
                src={src}
                alt={label}
                className="max-h-full max-w-full rounded-lg object-contain"
              />
            </div>
          ) : (
            <div className="text-center text-gray-500 text-sm">
              Unsupported file format
            </div>
          )}
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PdfOrImageModal;
