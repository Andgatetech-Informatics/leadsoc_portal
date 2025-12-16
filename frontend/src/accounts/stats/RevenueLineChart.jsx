import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register required modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const RevenueLineChart = () => {
  const data = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [
          12000, 15000, 18000, 22000, 19000, 25000,
          30000, 31000, 28000, 32000, 35000, 38000,
        ],
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
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
    <div className="p-4 rounded-xl shadow-md border">
      <h2 className="text-xl font-semibold mb-3">
        Month-wise Revenue
      </h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default RevenueLineChart;
