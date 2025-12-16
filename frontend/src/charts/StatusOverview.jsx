import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../api";
import { useLocation, useNavigate } from "react-router-dom";

const StatusOverview = ({ loading, setLoading, dateRange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.pathname.split("/")[2];

  const [data, setData] = useState({});

  useEffect(() => {
    if (!dateRange?.startDate || !dateRange?.endDate) {
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/api/stats/candidates`, {
          params: {
            "range[startDate]": dateRange.startDate,
            "range[endDate]": dateRange.endDate,
            role: role,
          },
        });

        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch candidate stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dateRange]);

  const statusItems = [
    {
      key: "assigned",
      label: "Assigned",
      bg: "bg-green-100",
      border: "border-green-500",
      text: "text-green-700",
      navigateTo: "/candidates-status",
    },
    {
      key: "pending",
      label: "Pending",
      bg: "bg-slate-50",
      border: "border-slate-500",
      text: "text-slate-700",
      navigateTo: "/candidates-status",
    },
    {
      key: "onhold",
      label: "On Hold",
      bg: "bg-amber-100",
      border: "border-amber-700",
      text: "text-amber-700",
      navigateTo: "/candidates-status",
    },
    {
      key: "shortlisted",
      label: "Shortlisted",
      bg: "bg-purple-100",
      border: "border-purple-700",
      text: "text-purple-700",
      navigateTo: "/candidates-status",
    },
    {
      key: "hired",
      label: "Hired",
      bg: "bg-fuchsia-100",
      border: "border-fuchsia-600",
      text: "text-fuchsia-700",
      navigateTo: "/candidates-status",
    },
    {
      key: "rejected",
      label: "Rejected",
      bg: "bg-rose-50",
      border: "border-rose-500",
      text: "text-rose-700",
      navigateTo: "/candidates-status",
    },
  ];

  return (
    <div className="">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      
        {loading &&
          statusItems.map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-4 bg-gray-100 border border-gray-300 animate-pulse"
            >
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2 mt-3"></div>
            </div>
          ))}

        {/* ----------- ACTUAL DATA ----------- */}
        {!loading &&
          statusItems.map(({ key, label, bg, border, text, navigateTo }) => {
            const isDisabled = data[key] === 0 || data[key] === undefined;

            return (
              <div
                key={key}
                onClick={() => {
                  if (!isDisabled) {
                    navigate(`${navigateTo}-${role}`, {
                      state: { dateRange, currentStatus: key },
                    });
                  }
                }}
                className={`
  rounded-xl p-4 border-l-4 shadow-sm transition-all duration-200
  ${bg} ${border}
  ${isDisabled
                    ? " cursor-not-allowed pointer-events-none"
                    : "hover:shadow-md cursor-pointer"
                  }
`}
                title={label}
              >
                <p className="text-sm text-gray-600">{label}</p>
                <p className={`text-3xl font-bold mt-1 ${text}`}>
                  {data[key] ?? 0}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default StatusOverview;
