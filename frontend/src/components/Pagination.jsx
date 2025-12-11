import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  className = "",
}) => {
  const buttonClass = (disabled = false) =>
    `px-3 py-1 border rounded-md transition ${
      disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-white text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div
      className={`flex flex-col mb-2 sm:flex-row sm:justify-between sm:items-center gap-2 ${className}`}
    >
      {/* Desktop: Page info on left */}
      <div className="hidden sm:flex items-center text-sm text-gray-600">
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      {/* Desktop: Buttons on right */}
      <div className="hidden sm:flex items-center gap-1">
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className={buttonClass(currentPage === 1)}
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={buttonClass(currentPage === totalPages)}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Mobile: arrows on edges, description centered */}
      <div className="flex sm:hidden items-center justify-between relative w-full text-sm text-gray-600">
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className={buttonClass(currentPage === 1)}
        >
          <ChevronLeft size={16} />
        </button>

        <span className="absolute left-1/2 transform -translate-x-1/2">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={buttonClass(currentPage === totalPages)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
