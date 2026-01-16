import React, { useEffect, useState } from "react";
import RecruitmentStatusChart from "../charts/RecruitmentStatus";
import RecentActivity from "../charts/RecentActivity";
import StatusOverview from "../charts/StatusOverview";
import TeamsOverview from "../charts/TeamsOverview";
import DomainDoughnutChart from "../charts/DomainDoughnutChart";
// import JobDashboard from "../jobPost/JobDashboard";
import DateFilter from "../components/DateFilter";
import { getDateRange } from "../utils/getDateRange";

const HrDashboard = () => {
  const [activeFilter, setActiveFilter] = useState("week");
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState({
    status: true,
    domain: true,
    activity: true,
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
    <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 w-full">
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
      </header>

      {/* Status Summary */}
      <Card>
        <StatusOverview
          loading={loading.status}
          setLoading={(v) => updateLoading("status", v)}
          dateRange={dateRange}
        />
      </Card>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card>
            <DomainDoughnutChart
              loading={loading.domain}
              setLoading={(v) => updateLoading("domain", v)}
              dateRange={dateRange}
            />
          </Card>

          <Card>
            <TeamsOverview
              loading={loading.team}
              setLoading={(v) => updateLoading("team", v)}
              dateRange={dateRange}
            />
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <RecruitmentStatusChart
              loading={loading.bars}
              activeFilter={activeFilter}
              setLoading={(v) => updateLoading("bars", v)}
              dateRange={dateRange}
            />
          </Card>
          <Card className="space-y-6">
            <RecentActivity
              loading={loading.activity}
              setLoading={(v) => updateLoading("activity", v)}
              dateRange={dateRange}
            />
          </Card>
        </div>
      </div>
      {/* <div className="w-full">
        <JobDashboard />
      </div> */}
    </div>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white p-4 rounded-xl shadow ${className}`}>
    {children}
  </div>
);

export default HrDashboard;
