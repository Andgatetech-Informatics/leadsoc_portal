import { useState, useEffect } from "react";

const InvoiceDetails = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const [data, setData] = useState(null);

  useEffect(() => {
    if (invoice.source === "PDF" && invoice.uploadedPdf?.fileBase64) {
      setData(
        `data:application/pdf;filename=${invoice.uploadedPdf.filename};base64,${invoice.uploadedPdf.fileBase64}`
      );
    } else if (invoice.pdfBase64) {
      setData(`data:application/pdf;base64,${invoice.pdfBase64}`);
    }
  }, [invoice]);

  return (
<div
  className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50 transition-all duration-300 ease-in-out"
  onClick={onClose}
  aria-hidden="true"
>
  <div
    className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl relative transform transition-all duration-500 ease-in-out"
    onClick={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
  >
    {/* Modal Header with Title */}
    <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-4">
      <h2 className="text-2xl font-semibold text-gray-800">View Invoice</h2>
      {/* Close Button with subtle hover effect */}
      <button
        className="p-2 bg-transparent border-2 border-gray-300 rounded-full text-gray-600 hover:bg-gray-300 transition duration-300 ease-in-out"
        onClick={onClose}
        aria-label="Close Modal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 20 20"
          className="text-gray-600 hover:text-gray-800"
        >
          <path
            fillRule="evenodd"
            d="M10 8.586l4.707-4.707 1.414 1.414L11.414 10l4.707 4.707-1.414 1.414L10 11.414l-4.707 4.707-1.414-1.414L8.586 10 3.879 5.293 5.293 3.88 10 8.586z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>

    {/* Modal Content with Smooth Scroll and clean design */}
    <div className="overflow-hidden">
      {data && (
        <iframe
          src={data}
          width="100%"
          height="500px"
          title="Base64 PDF"
          allow="fullscreen"
          className="rounded-xl shadow-lg border-none transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-3xl"
        ></iframe>
      )}
    </div>
  </div>
</div>



  );
};

export default InvoiceDetails;
