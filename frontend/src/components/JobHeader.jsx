import React, { useState } from "react";
import { Search, MapPin } from "lucide-react";

const JobHeader = ({
  title,
  search,
  setSearch,

  setFilterStatus,
  experience,
  setExperience,
  location,
  setLocation,
}) => {
  return (
    <div className="bg-white border-b shadow-sm">
      {/* 🔹 Top Bar */}
      <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold"> {title}</h2>

        {/* 🔹 Search + Status + Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {/* Location Filter */}
          <div className="relative flex-1">
            <MapPin className="absolute left-2 top-2.5 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Experience Filter */}
          <div>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Experience</option>

              <option value="1">1 & above Years</option>
              <option value="3">3 & above Years</option>
              <option value="5">5 & above Years</option>
              <option value="8">8 & above Years</option>
              <option value="12">12 & above Years</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobHeader;
