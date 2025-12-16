import React, { useEffect, useState } from "react";
import JobDashboard from "../jobPost/JobDashboard";
// import StatusOverview from "./charts/StatusOverview";
// import DomainDoughnutChart from "./charts/DomainDoughnutChart";
// import RecruitmentStatus from "./charts/RecruitmentStatus";
import DomainDoughnutChart from "../charts/DomainDoughnutChart";
import StatusOverview from "../charts/StatusOverview";
import RecruitmentStatus from "../charts/RecruitmentStatus";
import DateFilter from "../components/DateFilter";
import { getDateRange } from "../utils/getDateRange";

const FreelancerDashboard = () => {
  const [activeFilter, setActiveFilter] = useState("week");
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState({
    status: true,
    domain: true,
    team: true,
    bars: true,
  });

  const updateLoading = (key, value) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setDateRange(getDateRange(activeFilter));
  }, [activeFilter]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-gray-50 h-full">
      {/* Welcome Overview */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 w-full">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome back
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Here’s a quick overview of your team's recruitment progress.
          </p>
        </div>
      <DateFilter
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      </div>

      {/* Status Summary */}
      <div className="bg-white p-4 rounded-xl shadow">
        <StatusOverview
          loading={loading.status}
          setLoading={(v) => updateLoading("status", v)}
          dateRange={dateRange}
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <DomainDoughnutChart
              loading={loading.domain}
              setLoading={(v) => updateLoading("domain", v)}
              dateRange={dateRange}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <RecruitmentStatus
              loading={loading.bars}
              activeFilter={activeFilter}
              setLoading={(v) => updateLoading("bars", v)}
              dateRange={dateRange}
            />
          </div>
        </div>
      </div>

      {/* <div className=" p-4 mt-1">
              <JobDashboard />
            </div> */}
    </div>
  );
};

export default FreelancerDashboard;
