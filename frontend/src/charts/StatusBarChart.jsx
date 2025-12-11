import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatusBarChart = () => {
  const labels = [
    "Pending",
    "Assigned",
    "On Hold",
    "Approved",
    "Employee",
    "Trainee",
    "Deployed",
    "Rejected",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Candidate Count",
        data: [12, 8, 6, 10, 14, 9, 7, 3],
        backgroundColor: [
          "#FACC15",
          "#3B82F6",
          "#A78BFA",
          "#10B981",
          "#6366F1",
          "#60A5FA",
          "#14B8A6",
          "#EF4444",
        ],
        borderRadius: 2,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#4B5563", 
          font: {
            size: 14,
            family: "Inter, sans-serif",
            weight: "500",
          },
        },
      },
      title: {
        display: true,
        text: "Candidate Status",
        font: {
          size: 20,
          family: "Inter, sans-serif",
          weight: "600",
        },
        color: "#111827", 
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "#1F2937", 
        titleFont: {
          size: 14,
          weight: "600",
        },
        bodyFont: {
          size: 13,
        },
        padding: 10,
        borderColor: "#E5E7EB", 
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280", 
          font: {
            family: "Inter, sans-serif",
            size: 13,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#E5E7EB", 
          drawBorder: false,
        },
        ticks: {
          stepSize: 2,
          color: "#6B7280", 
          font: {
            family: "Inter, sans-serif",
            size: 13,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[450px]  p-6">
      <Bar data={data} options={options} />
    </div>
  );
};

export default StatusBarChart;
