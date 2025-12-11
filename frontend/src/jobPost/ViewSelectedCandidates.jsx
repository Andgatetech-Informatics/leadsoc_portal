import React from "react";
import { useLocation } from "react-router-dom";

const ViewSelectedCandidates = () => {
  const location = useLocation();
  const { jobId, jobTitle } = location.state || {};

  // Random sample data for candidates
  const candidates = [
    {
      name: "John Doe",
      location: "New York",
      skills: ["Java", "Spring Boot", "REST APIs"],
      status: "Shortlisted",
      hrName: "Sarah Lee",
    },
    {
      name: "Jane Smith",
      location: "San Francisco",
      skills: ["React", "Node.js", "MongoDB"],
      status: "Interview Scheduled",
      hrName: "Johnathan White",
    },
    {
      name: "Michael Johnson",
      location: "Chicago",
      skills: ["Python", "Django", "REST APIs"],
      status: "Rejected",
      hrName: "Emily Green",
    },
    {
      name: "Emily Davis",
      location: "Los Angeles",
      skills: ["JavaScript", "React", "GraphQL"],
      status: "Applied",
      hrName: "Jessica Turner",
    },
    {
      name: "David Wilson",
      location: "Austin",
      skills: ["Java", "Spring Boot", "SQL"],
      status: "Shortlisted",
      hrName: "Michael Brown",
    },
  ];

  return (
    <div className="bg-gray-50 p-8">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">{`Candidates for ${jobTitle}`}</h2>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Candidate Name</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Position</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">HR Name</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {candidates && candidates.length > 0 ? (
              candidates.map((candidate, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition duration-300">
                  <td className="px-4 py-4">{candidate.name}</td>
                  <td className="px-4 py-4">{candidate.location}</td>
                  <td className="px-4 py-4">{candidate.skills.join(", ")}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        candidate.status === "Shortlisted"
                          ? "bg-green-100 text-green-700"
                          : candidate.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">{candidate.hrName}</td>
                  <td className="px-4 py-4 flex gap-2">
                    <button className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200">
                      Shortlist
                    </button>
                    <button className="px-4 py-2 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-200">
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No candidates selected yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewSelectedCandidates;
