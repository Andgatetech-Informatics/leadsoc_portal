import React, { useState } from "react";

const JobFilter = () => {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "companyName") setCompanyName(value);
    if (name === "jobTitle") setJobTitle(value);
    if (name === "experience") setExperience(value);
    if (name === "location") setLocation(value);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    console.log("Filter Submitted:", { companyName, jobTitle, experience, location });
  };

  const handleReset = () => {
    setCompanyName("");
    setJobTitle("");
    setExperience("");
    setLocation("");
  };

  return (
    <div className="filter-container bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleFilterSubmit} className="flex items-center gap-4">
        {/* Company Name Filter */}
        <div className="flex flex-col w-1/5">
          <label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company Name</label>
          <select
            id="companyName"
            name="companyName"
            value={companyName}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Company</option>
            <option value="HCL">HCL</option>
            <option value="TCS">TCS</option>
            <option value="Accenture">Accenture</option>
          </select>
        </div>

        {/* Job Title Filter */}
        <div className="flex flex-col w-1/5">
          <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">Job Title</label>
          <select
            id="jobTitle"
            name="jobTitle"
            value={jobTitle}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Job Title</option>
            <option value="Engineer">Engineer</option>
            <option value="Manager">Manager</option>
            <option value="Developer">Developer</option>
          </select>
        </div>

        {/* Experience Filter */}
        <div className="flex flex-col w-1/5">
          <label htmlFor="experience" className="text-sm font-medium text-gray-700">Experience</label>
          <select
            id="experience"
            name="experience"
            value={experience}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Experience</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>

        {/* Location Filter */}
        <div className="flex flex-col w-1/5">
          <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
          <select
            id="location"
            name="location"
            value={location}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Location</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center items-center w-full mt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all mr-4"
          >
            Search
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-100 transition-all"
          >
            Reset Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobFilter;
