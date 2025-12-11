import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OpeningCompanyCard = ({ company }) => {
  const location = useLocation();
  const { logo, organization, industry } = location.state || {};
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-200 w-full p-6 mb-8">
      {/* Company Header */}
      <div className="flex items-center gap-5 pb-6 border-b border-gray-200">
        {/* Company Logo */}
        {organization?.logo ? (
          <img
            src={organization.logo}
            alt={organization.organization}
            className="w-16 h-16 object-contain rounded-full border border-gray-300"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold text-lg">
            {organization?.organization?.charAt(0).toUpperCase() || ""}
          </div>
        )}

        {/* Company Info */}
        <div className="flex flex-col">
          {/* Name */}
          <h2 className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer">
            {organization || "Andgate Informatics Pvt Ltd"}
          </h2>

          {/* Industry */}
          <p className="text-base text-gray-600 font-medium mt-0.5">
            {industry || "Semiconductor"}
          </p>

          {/* Active Openings Badge */}
          <span className="mt-2 inline-flex items-center text-xs font-medium text-green-700 ">
            {jobOpenings.length} Active Openings
          </span>
        </div>
      </div>

      {/* Job Listings */}
      <div className="mt-6 space-y-5">
        {jobOpenings && jobOpenings.length > 0 ? (
          jobOpenings.map((job) => (
            <div
              key={job._id}
              className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/jobs/${job._id}`)}
            >
              {/* Job Header */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                    {job.title}
                  </p>
                  <p className="text-sm text-gray-600">{job.location}</p>
                </div>

                {/* CTA */}
                <button
                  className="text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-lg shadow hover:scale-105 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/jobs/${job._id}`);
                  }}
                >
                  View Candidates
                </button>
              </div>

              {/* Job Meta */}
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md font-medium">
                  {job.experience}
                </span>
                <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md font-medium">
                  {job.skills}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                  {job.applicants} Applicants
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No active openings
          </p>
        )}
      </div>
    </div>
  );
};

export default OpeningCompanyCard;
