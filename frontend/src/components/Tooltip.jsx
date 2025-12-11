import { User } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const TooltipCard = ({ candidate, redirect, statusMap }) => {
  const [position, setPosition] = useState("bottom");
  const wrapperRef = useRef(null);

  useEffect(() => {
    const checkPosition = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        if (spaceBelow < 220 && spaceAbove > spaceBelow) {
          setPosition("top");
        } else {
          setPosition("bottom");
        }
      }
    };

    checkPosition(); // run on mount
    window.addEventListener("resize", checkPosition);
    return () => window.removeEventListener("resize", checkPosition);
  }, []);

  const statusColor = statusMap[candidate.status]?.color || "text-gray-600";

  return (
    <div className="relative inline-block group" ref={wrapperRef}>
      {/* Tooltip */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-80 bg-white 
        border border-gray-200 rounded-lg shadow-lg p-4 opacity-0 invisible 
        group-hover:opacity-100 group-hover:visible group-hover:scale-100 
        scale-95 transition-all duration-200 ease-in-out z-50
        ${position === "bottom" ? "top-full mt-3" : "bottom-full mb-3"}`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
            <User size={18} />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">
            Candidate Details
          </h3>
        </div>

        {/* Candidate Info */}
        <div className="mb-3 text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-semibold">Name:</span> {candidate.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {candidate.email}
          </p>
          <Link
            to={`/application-tracker${redirect}/${candidate._id}`}
            className="text-blue-600 text-sm hover:underline block mt-2"
          >
            Go to more details →
          </Link>
        </div>

        {/* Status Section */}
        <div className="border-t border-gray-200 pt-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Status
          </h4>

          <div className="flex items-center space-x-2">
            <p
              className={`text-sm font-semibold ${statusColor} bg-opacity-50 px-3 py-1 rounded-full`}
            >
              {candidate.status.charAt(0).toUpperCase() +
                candidate.status.slice(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TooltipCard;
