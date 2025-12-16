import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { baseUrl } from "../api";
import { useLocation } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DomainDoughnutChart = ({ loading, setLoading, dateRange }) => {
  const location = useLocation();
  const role = location.pathname.split("/")[2];
  const [domainData, setDomainData] = useState([]);

  useEffect(() => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fetchDomainStats = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/api/stats/domains`, {
          params: {
            "range[startDate]": dateRange.startDate,
            "range[endDate]": dateRange.endDate,
            role: role,
          },
        });
        setDomainData(res.data);
      } catch (error) {
        console.error("Failed to fetch domain stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDomainStats();
  }, [dateRange]);

  const labels = domainData.map((item) => item.domain);
  const dataValues = domainData.map((item) => item.count);

  const data = {
    labels,
    datasets: [
      {
        label: "Candidate Count",
        data: dataValues,
        backgroundColor: [
          "#FACC15",
          "#3B82F6",
          "#A78BFA",
          "#10B981",
          "#6366F1",
          "#60A5FA",
          "#14B8A6",
          "#EF4444",
          "#F97316",
          "#22D3EE",
          "#E879F9",
          "#4ADE80",
          "#EAB308",
          "#8B5CF6",
          "#06B6D4",
          "#DC2626",
        ],
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        align: "start",
        text: "Applications by Domain",
        font: { size: 20, weight: "600", family: "Inter, sans-serif" },
        color: "#111827",
        padding: { bottom: 20 },
      },
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="h-[300px] md:h-[300px] flex items-center justify-center">
        {/* ⭐ Skeleton Loader */}
        {loading ? (
          <div className="w-60 h-60 md:w-72 md:h-72 rounded-full bg-gray-200 animate-pulse shadow-inner"></div>
        ) : (
          <Doughnut data={data} options={options} />
        )}
      </div>
    </div>
  );
};

export default DomainDoughnutChart;
