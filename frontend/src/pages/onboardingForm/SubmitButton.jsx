import React, { useState } from "react";

const SubmitButton = ({ formType }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (formType === "fresher") {
        alert("Fresher form submitted successfully!");
      } else {
        alert("Experience form submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end">
      <button
        type="submit" 
        disabled={loading}
        onClick={handleClick} 
        className={`${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            {formType === "fresher"
              ? "Submitting..."
              : "Submitting..."}
          </>
        ) : formType === "fresher" ? (
          "Submit"
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
};

export default SubmitButton;
