import React from "react";

const LoadingButton = ({ className }) => {
  return (
    <button
      disabled
      className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg inline-flex items-center justify-center cursor-not-allowed bg-opacity-80 ${className}`}
    >
      <svg
        className="w-5 h-5 text-white animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
    </button>
  );
};

export default LoadingButton;
