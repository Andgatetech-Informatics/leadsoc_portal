import React from "react";
import { Link } from "react-router-dom";

const filters = ["Day", "Week", "Month", "Quarter", "Year"];

const TimeFilterButtons = ({ selectedFilter, setSelectedFilter }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {filters.map((label) => {
        const value = label.toLowerCase();
        const isActive = selectedFilter === value;

        return (
          <Link
            key={value}
            onClick={() => setSelectedFilter(value)}
            className={`text-sm transition hover:underline hover:text-blue-600 
              ${isActive ? "text-blue-600 font-semibold" : "text-gray-700"}`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
};

export default TimeFilterButtons;
