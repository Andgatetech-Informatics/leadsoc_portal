import React, { useEffect, useState } from "react";

const CandidateFilter = ({ searchTerm, selectedDomain, selectedStatus, selectedExperience, setSearchTerm, setSelectedDomain, setSelectedStatus, setSelectedExperience }) => {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Search */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Search</label>
        <input
          type="text"
          placeholder="By name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Domain */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Domain</label>
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Domains</option>
          {[
            "DFT",
            "PD",
            "DV",
            "PDK",
            "Analog Mixed Signaling",
            "Analog Layout Design",
            "Design Engineer",
            "Synthesis",
            "Physical Verification",
            "Embedded",
            "FPGA",
            "Design",
            "Analog Design",
            "Formal Verification",
            "Software",
            "STA",
            "Others",
          ].map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="assigned">Assigned</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
          <option value="onhold">On Hold</option>
        </select>
      </div>

      {/* Experience */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Experience</label>
        <select
          value={selectedExperience}
          onChange={(e) => setSelectedExperience(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All</option>
          <option value="fresher">Fresher</option>
          <option value="1-3">1-3 yrs</option>
          <option value="3-5">3-5 yrs</option>
          <option value="5+">5+ yrs</option>
        </select>
      </div>
    </div>
  );
};

export default CandidateFilter;
