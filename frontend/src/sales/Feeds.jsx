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
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Company Directory */}
        <div className="mt-8">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 rounded-full bg-gray-300" />
                    <div className="space-y-3">
                      <div className="h-4 w-32 rounded bg-gray-300" />
                      <div className="h-3 w-24 rounded bg-gray-200" />
                    </div>
                  </div>
                  <div className="h-3 w-28 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : companies.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {companies.map((c) => (
                <div
                  key={c._id}
                  onClick={() =>
                    navigate("/all-job-feeds/company/openings", {
                      state: { organization: c },
                    })
                  }
                  className="group cursor-pointer rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Accent bar */}
                  <div className="h-1 w-full scale-x-0 bg-gradient-to-r from-indigo-500 to-blue-500 transition-transform duration-300 group-hover:scale-x-100" />

                  <div className="flex items-center gap-4 p-6">
                    {c.logo ? (
                      <img
                        src={`${baseUrl}/${c.logo}`}
                        alt={c.organization}
                        className="h-14 w-14 rounded-full border border-gray-200 bg-white object-contain"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-xl font-semibold text-white">
                        {c.organization?.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-gray-800 group-hover:text-indigo-600">
                        {c.organization}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {c.industry || "Technology Solutions"}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-5">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:text-indigo-800">
                      View Openings →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              No companies found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feeds;
