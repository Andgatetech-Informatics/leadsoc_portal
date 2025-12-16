import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register required modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CompanyInvoiceBarChart = () => {
  const data = {
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

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="p-4 rounded-xl shadow-md border">
      <h2 className="text-xl font-semibold mb-3">
        Company-wise Total Invoices
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CompanyInvoiceBarChart;
