import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { baseUrl } from "../api";

const TeamsOverview = ({ loading, setLoading, dateRange }) => {
  const [data, setData] = useState([]);

  // ---------- Fetch Data ----------
  useEffect(() => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fetchTeamLoad = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          `${baseUrl}/api/stats/teamload`,
          {
            params: {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            },
          }
        );

        if (!Array.isArray(response)) {
          console.error("Invalid response format:", response);
          setData([]);
          return;
        }

        setData(response);
      } catch (error) {
        console.error("Error fetching team load:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamLoad();
  }, [dateRange]);

  // ---------- Derived Values ----------
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.candidateCount - a.candidateCount);
  }, [data]);

  const maxCount = useMemo(() => {
    return Math.max(...sortedData.map((d) => d.candidateCount), 1);
  }, [sortedData]);

  // Generate initials from name
  const initials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // ---------- Skeleton Component ----------
  const SkeletonRow = () => (
    <div className="mb-4 animate-pulse">
      <div className="flex items-center justify-between mb-1">
        <div className="h-4 w-24 bg-gray-300 rounded" />
        <div className="h-4 w-20 bg-gray-300 rounded" />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="h-2 bg-gray-300 rounded-full w-3/4" />
        </div>
        <div className="h-4 w-10 bg-gray-300 rounded" />
      </div>
    </div>
  );

  // ---------- Main Render ----------
  return (
    <div className="h-[295px] flex flex-col">
      <h3 className="text-xl font-semibold  text-gray-800 mb-3">
        Team Workload
      </h3>

      <div className="overflow-y-auto pr-2 flex-1 space-y-5 custom-scroll">
        {/* Loading Skeleton */}
        {loading &&
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

        {/* No Data */}
        {!loading && sortedData.length === 0 && (
          <p className="text-gray-600 text-sm">
            No team workload data available.
          </p>
        )}

        {/* Actual Data */}
        {!loading &&
          sortedData.map((member, index) => {
            const percent = ((member.candidateCount / maxCount) * 100).toFixed(
              0
            );

            return (
              <div key={member._id || index} className="  relative">
                {/* Top Row — Name + Candidate Count */}
                <div className="flex items-center justify-between mb-1">
                  {/* Name aligned above the avatar */}
                  <span className="text-[14px] font-medium text-gray-800 pl-12">
                    {member.name}
                  </span>

                  <span className="text-sm text-gray-600 pr-12">
                    {member.candidateCount} candidates
                  </span>
                </div>

                {/* Bottom Row — Avatar + Bar + % */}
                <div className="flex items-center gap-3">
                  {/* Avatar shifted left exactly like your manual spacing but cleaner */}
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-full font-semibold text-white absolute left-0 top-3"
                    style={{ backgroundColor: member.color || "#4F46E5" }}
                  >
                    {initials(member.name)}
                  </div>

                  {/* Progress bar */}
                  <div className="flex-1 bg-gray-200 rounded-full h-2 ml-12">
                    <div
                      className="h-2 rounded-full bg-gray-600 transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Percentage */}
                  <span className="text-sm text-gray-600">{percent}%</span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TeamsOverview;
