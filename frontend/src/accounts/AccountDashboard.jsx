import React from "react";
import CompanyInvoiceBarChart from "./stats/CompanyInvoiceBarChart";
import RevenueLineChart from "./stats/RevenueLineChart";
import StatusOverview from "./stats/StatusOverview";

const AccountDashboard = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-white h-full">
      
      {/* Welcome Overview */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome back
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Here’s a quick overview of your team's accounts.
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm space-y-8">
        
        {/* Status Overview */}
        <StatusOverview />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Invoice Chart */}
          <div className="h-full">
            <CompanyInvoiceBarChart />
          </div>

          {/* Revenue Chart */}
          <div className="h-full">
            <RevenueLineChart />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
