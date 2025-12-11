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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Your data
const submittedProfileData = [
  { role: "Fullstack Dev", submitted: 12 },
  { role: "QA Engineer", submitted: 7 },
  { role: "UI/UX Designer", submitted: 5 },
  { role: "Data Analyst", submitted: 9 },
  { role: "DevOps Engineer", submitted: 4 },
  { role: "Product Manager", submitted: 6 },
];

// Gradient color palette for bars
const barColors = [
  "#4F46E5",
  "#6366F1",
  "#818CF8",
  "#A5B4FC",
  "#C7D2FE",
  "#E0E7FF",
];

const SubmittedProfileChart = () => {
  const labels = submittedProfileData.map((d) => d.role);
  const counts = submittedProfileData.map((d) => d.submitted);

  const data = {
    labels,
    datasets: [
      {
        label: "Profiles Submitted",
        data: counts,
        backgroundColor: barColors.slice(0, counts.length),
        borderRadius: 8,
        maxBarThickness: 50,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Submitted Profiles by Role",
        font: { size: 20, family: "Inter, sans-serif", weight: "600" },
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#fff",
        bodyColor: "#E5E7EB",
        padding: 10,
        borderWidth: 0,
        displayColors: false,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed.y} Profiles`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#374151", font: { family: "Inter, sans-serif" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#E5E7EB" },
        ticks: { color: "#6B7280", font: { family: "Inter, sans-serif" } },
      },
    },
  };

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-lg" style={{ height: "450px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default SubmittedProfileChart;
