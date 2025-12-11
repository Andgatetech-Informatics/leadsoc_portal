import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Register chart modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const CompanyCharts = () => {

  const companyInvoiceData = {
    labels: ["TCS", "Infosys", "Accenture", "Wipro", "IBM"],
    datasets: [
      {
        label: "Total Invoices",
        data: [45, 32, 28, 21, 18],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const companyInvoiceOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // -----------------------------
  // MONTH-WISE REVENUE LINE DATA
  // -----------------------------
  const monthRevenueData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [12000, 15000, 18000, 22000, 19000, 25000, 30000, 31000, 28000, 32000, 35000, 38000],
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        tension: 0.4,
      },
    ],
  };

  const monthRevenueOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: false },
    },
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Bar Chart */}
      <div className="p-4 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold mb-3">
          Company-wise Total Invoices
        </h2>
        <Bar data={companyInvoiceData} options={companyInvoiceOptions} />
      </div>

      {/* Line Chart */}
      <div className="p-4 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold mb-3">
          Month-wise Revenue
        </h2>
        <Line data={monthRevenueData} options={monthRevenueOptions} />
      </div>
    </div>
  );
}

export default CompanyCharts;
