import React, { useEffect, useState, useRef } from "react";
import TooltipCard from "./Tooltip";
import { useLocation } from "react-router-dom";

const statusMap = {
  pending:      { label: "Pending",      color: "bg-gray-500" },     // Neutral
  assigned:     { label: "Assigned",     color: "bg-blue-600" },      // Action
  onhold:       { label: "On Hold",      color: "bg-yellow-500" },    // Warning
  shortlisted:  { label: "Shortlisted",  color: "bg-purple-600" },    // Highlight
  approved:     { label: "Approved",     color: "bg-emerald-600" },   // Success
  rejected:     { label: "Rejected",     color: "bg-red-600" },       // Danger
  hired:        { label: "Hired",        color: "bg-green-700" },     // Final success
};

const steps = ["pending", "assigned", "onhold", "shortlisted", "approved", "hired"];

const ProgressBar = ({ status, candidate, redirect }) => {
  if (!status) return null;

  const location = useLocation();
  const [redirectTo, setRedirectTo] = useState("");

  const [isHovered, setIsHovered] = useState(false);
  const normalizedStatus = status.toLowerCase();
  const totalSteps = steps.length;
  let progressPercent = 0;

  const progressBarRef = useRef(null);

  if (normalizedStatus === "hired") {
    progressPercent = 100; // always full
  } else if (normalizedStatus === "rejected") {
    progressPercent = 100;
  } else {
    const currentIndex = steps.indexOf(normalizedStatus);
    progressPercent =
      currentIndex >= 0 ? ((currentIndex + 1) / totalSteps) * 100 : 0;
  }

  useEffect(() => {
    const fullPath = location.pathname;
    const routeName = fullPath.split("/").filter(Boolean).pop();

    if (routeName === "shortlisted-all-candidates") {
      setRedirectTo("_bu");
    } else {
      setRedirectTo("_ta");
    }
  }, [location.pathname]);

  const getTooltipPosition = () => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      return {
        top: rect.top - 20,
        left: rect.left + rect.width / 2,
      };
    }
    return { top: 0, left: 0 };
  };

  const tooltipPosition = getTooltipPosition();

  return (
    <div className="w-full flex items-center px-4 py-3 relative">
      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="flex-1 relative h-2 bg-gray-200 rounded-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(true)}
      >
        <div
          className={`h-2 rounded-full transition-all duration-300 ${normalizedStatus === "reject"
            ? "bg-red-500"  // Ensure it turns red when rejected
            : statusMap[normalizedStatus]?.color
            }`}
          style={{ width: `${progressPercent}%` }}

        />
      </div>

      {/* Tooltip fixed above, without affecting table */}
      {isHovered && candidate && (
        <div
          className="ml-16"
          style={{
            position: "fixed",
            top: tooltipPosition.top + "px",
            left: tooltipPosition.left + "px",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          <TooltipCard candidate={candidate} redirect={redirectTo} statusMap={statusMap} />
        </div>
      )}

      {/* Percentage */}
      <span className="text-xs font-semibold text-gray-600 min-w-[40px] text-right">
        {normalizedStatus === "reject"
          ? "Rejected"
          : `${Math.round(progressPercent)}%`}
      </span>
    </div>
  );
};

export default ProgressBar;
