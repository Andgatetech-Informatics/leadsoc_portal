import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { baseUrl } from "../api";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const baseColors = [
  "#3B82F6",
  "#454B90",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#F97316",
];

const RecruitmentStatus = ({ loading, activeFilter, setLoading, dateRange }) => {
  const [chartRaw, setChartRaw] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${baseUrl}/api/stats/event_chart?type=${activeFilter}`
        );

        setChartRaw(res.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch candidate stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dateRange]);

  // hooks must run unconditionally
  const colors = useMemo(
    () => chartRaw.map((_, i) => baseColors[i % baseColors.length]),
    [chartRaw]
  );

  const chartData = useMemo(
    () => ({
      labels: chartRaw.map((item) => item.label),
      datasets: [
        {
          label: "Total Interviews",
          data: chartRaw.map((item) => item.count),
          backgroundColor: colors,
          borderRadius: 6,
          maxBarThickness: 30,
          borderWidth: 1,
          hoverOffset: 10,
        }
      ]
    }),
    [chartRaw, colors]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 10 },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Interview Summary",
          align: "start",
          color: "#111827",
          font: { size: 18, weight: "600", family: "Inter, sans-serif" },
          padding: { bottom: 20 },
        },
        tooltip: {
          backgroundColor: "#1F2937",
          titleColor: "#F9FAFB",
          bodyColor: "#F9FAFB",
          padding: 10,
        },
      },
      scales: {
        x: {
          offset: true, // <-- key fix
          grid: { display: false },
          ticks: {
            color: "#374151",
            font: { size: 13, family: "Inter, sans-serif" },
            autoSkip: false,
            maxRotation: 45,
            minRotation: 0,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 2,
            color: "#374151",
            font: { size: 13, family: "Inter, sans-serif" },
          },
          grid: { color: "#E5E7EB", drawBorder: false },
        },
      }
    }),
    []
  );

  return (
    <div className="p-1 w-full max-w-2xl mx-auto h-[330.1px]">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RecruitmentStatus;
