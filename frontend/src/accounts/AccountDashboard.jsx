import React from "react";
import RecruitmentStatusChart from "../charts/RecruitmentStatus";

import RecentActivity from "../charts/RecentActivity";
import StatusOverview from "../charts/StatusOverview";
import TeamsOverview from "../charts/TeamsOverview";

import DomainDoughnutChart from "../charts/DomainDoughnutChart";
import CompanyCharts from "./stats/CompanyCharts";

const AccountDashboard = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Overview */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome back
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Here’s a quick overview of your team's recruitment progress.
          </p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="bg-white p-4 rounded-xl shadow">
        <StatusOverview />
      </div>
      <CompanyCharts />
      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <DomainDoughnutChart />
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <RecruitmentStatusChart />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <RecentActivity />
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <TeamsOverview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
