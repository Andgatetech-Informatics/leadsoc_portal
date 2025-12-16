import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../api";

const Feeds = () => {
  const token = localStorage.getItem("token");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/getAllOrganizations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (Array.isArray(response.data?.data)) {
        setCompanies(response.data.data);
      } else {
        console.log("No company data found");
      }
    } catch (error) {
      console.error("Error fetching company details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="p-8 bg-gray-50 relative">
      {/* Company Directory */}
      <div className="mt-10">
        {loading ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Skeleton Loader */}
            {[...Array(4)].map(
              (
                _,
                index // Use 4 as a placeholder for the loader, or use companies.length if necessary
              ) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg p-6 cursor-pointer border border-gray-100 animate-pulse relative overflow-hidden"
                >
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full animate-pulse"></div>
                    <div className="space-y-4">
                      <div className="w-32 h-5 bg-gradient-to-r from-gray-300 to-gray-400 rounded animate-pulse"></div>
                      <div className="w-24 h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-28 h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded animate-pulse"></div>
                </div>
              )
            )}
          </div>
        ) : companies.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {companies.map((c) => (
              <div
                key={c._id}
                onClick={() =>
                  navigate("/all-job-feeds/company/openings", {
                    state: {
                      logo: c.logo,
                      organization: c.organization,
                      industry: c.industry,
                    },
                  })
                }
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                {/* Decorative bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                <div className="p-6 flex items-center gap-5">
                  {c.logo ? (
                    <img
                      src={c.logo}
                      alt={c.organization}
                      className="w-16 h-16 object-contain rounded-full border border-gray-200 bg-white shadow"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold text-2xl shadow">
                      {c.organization?.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {c.organization}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {c.industry || "Technology Solutions"}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                    View Openings <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No companies found.</p>
        )}
      </div>
    </div>
  );
};

export default Feeds;
