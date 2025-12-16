import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Briefcase, Users, MapPin } from "lucide-react";
import axios from "axios";
import { baseUrl } from "../api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// status & priority colors
const statusColors = {
  Active: "bg-green-100 text-green-600",
  Filled: "bg-blue-100 text-blue-600",
  Inactive: "bg-gray-200 text-gray-600",
  "On Hold": "bg-yellow-100 text-yellow-600",
};

const JobDashboard = ({ token }) => {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch jobs from API
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/getjobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobOpenings(response.data.jobs || []);
      if (response.data.jobs?.length > 0) {
        setSelectedJob(response.data.jobs[0]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Compute slides depending on viewport
  const getSlidesToShow = () =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 2;

  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());

  useEffect(() => {
    const onResize = () => setSlidesToShow(getSlidesToShow());
    window.addEventListener("resize", onResize);
    fetchJobs(); // Fetch jobs when the component is mounted
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Custom Prev Arrow
  const PrevArrow = ({ onClick, currentSlide }) => {
    const disabled = currentSlide === 0;
    return (
      <button
        onClick={(e) => !disabled && onClick(e)}
        aria-disabled={disabled}
        className={`absolute left-[-16px] z-20 top-1/2 transform -translate-y-1/2 bg-gray-50 text-black shadow-md rounded-full p-3 hover:opacity-90 transition           ${
          disabled ? "opacity-40 cursor-not-allowed" : ""
        }`}
        title="Previous"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    );
  };

  // Custom Next Arrow
  const NextArrow = ({ onClick, currentSlide, slideCount }) => {
    const lastIndex = Math.max(0, slideCount - slidesToShow);
    const disabled = currentSlide >= lastIndex;
    return (
      <button
        onClick={(e) => !disabled && onClick(e)}
        aria-disabled={disabled}
        className={`absolute right-[-16px] z-20 top-1/2 transform -translate-y-1/2 bg-gray-50 text-black shadow-md rounded-full p-3 hover:opacity-90 transition           ${
          disabled ? "opacity-40 cursor-not-allowed" : ""
        }`}
        title="Next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    );
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4, // ✅ BASE (Desktop)
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,

    responsive: [
      {
        breakpoint: 1536, // large desktop ↓
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1280, // laptop ↓
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024, // tablet ↓
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // mobile ↓
        settings: {
          slidesToShow: 1,
          arrows: true,
        },
      },
    ],
  };

  return (
    <div className="w-full px-2 py-2 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Jobs</h2>

      <Slider {...settings}>
        {jobOpenings.slice(0, 8).map((job) => (
          <div key={job.id} className="px-2">
    <div
    onClick={() => setSelectedJob(job)}
    className={`w-full h-[220px] flex flex-col
      p-4 bg-white border rounded-xl cursor-pointer transition
      hover:shadow-md hover:border-blue-400
      ${
        selectedJob?.id === job.id
          ? "border-blue-500 ring-1 ring-blue-200"
          : "border-gray-200"
      }
    `}
  >
    {/* Header */}
    <div className="flex justify-between items-start gap-2">
      <h3 className="font-semibold text-gray-800 text-sm md:text-base leading-snug line-clamp-2 min-h-[42px]">
        {job.title}
      </h3>
      <span className={`shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[job.status]}`}>
        {job.status}
      </span>
    </div>

    {/* Details */}
    <div className="flex-1 mt-3 space-y-2 text-sm text-gray-600">
      <p className="flex items-center gap-2">
        <Briefcase size={14} className="text-gray-400" />
        {job.experienceMin} - {job.experienceMax} yrs
      </p>
      <p className="flex items-center gap-2">
        <Users size={14} className="text-gray-400" />
        {job.noOfPositions} Positions
      </p>
      <p className="flex items-center gap-2 truncate">
        <MapPin size={14} className="text-gray-400" />
        {job.location}
      </p>
    </div>

    {/* Footer */}
    <p className="text-xs text-gray-400">
      Posted {job.createdAt ? dayjs(job.createdAt).fromNow() : "N/A"}
    </p>
  </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default JobDashboard;
