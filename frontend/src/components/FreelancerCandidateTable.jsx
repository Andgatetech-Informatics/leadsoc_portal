import React, { useEffect, useState } from "react";
import {
  FaEye,
  FaUserPlus,
  FaBriefcase,
  FaPhoneSquareAlt,
  FaWhatsapp,
  FaUserAlt,
  FaEdit,
  FaCalendarCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import ProgressBar from "./ProgressBar";

const FreelancerCandidateTable = ({
  handleRemarkSave,
  loading,
  candidates = [],
  onAssign,
  onView,
  onEdit,
  showAssignButton = false,
  showEditButton = false,
  isFreelancerAssignedTable = false,
  showShortlistedDetails = false,
  redirect,
  selectedCandidate,
  isFreelancerTable = false,
}) => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1180);
  const [candidateData, setCandidateData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 1180);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCandidateData(candidates);
  }, [candidates]);

  const capitalize = (str) => (str ? str[0].toUpperCase() + str.slice(1) : "");

  const renderStatusBadge = (status, candidate) => {
    const badgeColors = {
      Pending: "bg-slate-100 text-slate-700",
      Assigned: "bg-green-100 text-green-700",
      Onhold: "bg-amber-100 text-amber-700",
      Shortlisted: "bg-indigo-100 text-indigo-700",
      Rejected: "bg-rose-100 text-rose-700",
      Submitted: "bg-sky-100 text-sky-700",
      Approved: "bg-teal-100 text-teal-700",
      default: "bg-gray-100 text-gray-700",
    };
    const base = "px-3 py-1 rounded-full text-xs font-medium cursor-pointer";
    const color = badgeColors[status] || "bg-gray-200 text-gray-700";
    const navigableStatuses = ["Assigned", "Shortlisted"];

    return (
      <span
        className={`${base} ${color} inline-flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:opacity-80 transition`}
        onClick={() => {
          if (
            navigableStatuses.includes(status) &&
            candidate?._id &&
            redirect !== "/teams"
          ) {
            navigate(`/application-tracker${redirect}/${candidate._id}`);
          }
        }}
      >
        <span>{status || "Pending"}</span>
        {redirect !== "/teams" &&
          (navigableStatuses.includes(status) && candidate?._id ? (
            <FaEye className="w-4 h-4 ml-1" />
          ) : null)}
      </span>
    );
  };

  const renderSkeletonLoader = () => (
    <>
      {Array(5)
        .fill()
        .map((_, index) => (
          <tr key={index} className="hover:bg-gray-100 transition">
            <td className="px-4 py-3">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </td>
            <td className="px-4 py-3 text-center">
              <div className="flex justify-center space-x-2">
                <div className="w-8 h-6 bg-gray-200 rounded" />
                {showAssignButton && (
                  <div className="w-8 h-6 bg-gray-200 rounded" />
                )}
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </td>
            <td className="px-4 py-3">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </td>
            <td className="px-4 py-3">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </td>
            <td className="px-4 py-3">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </td>
            {isFreelancerAssignedTable && (
              <td className="px-4 py-3">
                <div className="w-8 h-6 bg-gray-200 rounded" />
              </td>
            )}
          </tr>
        ))}
    </>
  );

  return (
    <>
      {!isMobileView ? (
        <div className="overflow-x-auto bg-white border border-gray-200 shadow-sm rounded-xl">
          <table className="w-full text-sm text-left table-auto">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs border-b sticky top-0 font-medium">
              <tr>
                <th className="px-4 py-3 text-center">APPLICANT NAME</th>
                <th className="px-4 py-3 text-center">ACTION</th>
                <th className="px-4 py-3">DOMAIN</th>
                <th className="px-8 py-3">STATUS</th>
                {!isFreelancerAssignedTable && (
                  <th className="px-4 py-3">HR NAME</th>
                )}
                <th className="px-4 py-3">CONTACT</th>
                <th className="px-4 py-3">AVAILABILITY</th>
                {isFreelancerAssignedTable && (
                  <th className="px-4 py-3">REMARKS</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y text-sm">
              {loading
                ? renderSkeletonLoader()
                : candidateData.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-100 transition">
                      <td className="px-4 py-3 truncate max-w-[120px]">
                        <div className="flex flex-col items-start space-y-1">
                          <span
                            title={c.name}
                            className="text-sm text-gray-800 mb-1"
                          >
                            {c.name}
                          </span>
                          <div
                            className="flex gap-1 items-center"
                            title={c._id}
                          >
                            <FaUserAlt className="mr-2 text-gray-500" />
                            <span>{c._id.slice(-5)}</span>{" "}
                            <span
                              title={moment(c.createdAt).format("ll")}
                              className="text-gray-500 text-[10px]"
                            >
                              {" "}
                              {moment(c.createdAt).format("ll")}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center space-x-2">
                        <button
                          onClick={() => onView(c)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded-full text-xs"
                        >
                          <FaEye />
                        </button>
                      </td>

                      <td className="px-4 py-3 truncate max-w-[100px]">
                        <p title={c.domain}>
                          {Array.isArray(c.domain)
                            ? c.domain.join(", ")
                            : c.domain}
                        </p>
                        <div className="flex mt-1 items-center">
                          <FaBriefcase className="mr-2 text-gray-500" />
                          <p>{c.experienceYears || "Fresher"}</p>
                        </div>
                      </td>

                      {/* <td className="px-4 py-3">
                        {renderStatusBadge(capitalize(c.status), c)}
                      </td> */}
                      <td className="px-4 py-3 relative group">
                        <ProgressBar status={c.status} candidate={c} />
                      </td>
                      {!isFreelancerAssignedTable && (
                        <td className="px-4 py-3">{c.poc}</td>
                      )}

                      <td className="px-4 py-3">
                        <p>
                          <a
                            href={`mailto:${c.email}`}
                            className="hover:text-blue-500"
                            title={c.email}
                          >
                            {c.email}
                          </a>
                        </p>
                        <div className="flex items-center mt-2">
                          <a
                            href={`tel:${c.mobile}`}
                            className="flex items-center text-gray-500 hover:text-blue-500"
                          >
                            <FaPhoneSquareAlt className="mr-2" />
                            {c.mobile}
                          </a>
                          <a
                            href={`https://wa.me/${c.mobile}`}
                            className="ml-2 text-gray-500 hover:text-green-500"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaWhatsapp className="text-lg" />
                          </a>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p className="capitalize mb-1">{c.currentLocation}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaCalendarCheck className="mr-2 text-gray-500" />
                          <span className="capitalize">
                            {c.availability || "N/A"}
                          </span>
                        </div>
                      </td>

                      {isFreelancerAssignedTable && (
                        <td className="px-2 py-2 ">
                          <button
                            key={c._id}
                            onClick={() => onEdit(c)}
                            className="text-gray-500 text-center hover:text-blue-600"
                          >
                            <FaEdit />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2 py-2">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm animate-pulse"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                    {isFreelancerAssignedTable && (
                      <>
                        <div className="h-3 w-full bg-gray-200 rounded"></div>
                        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <div className="h-8 w-full bg-gray-300 rounded"></div>
                    {showAssignButton && (
                      <div className="h-8 w-full bg-gray-300 rounded"></div>
                    )}
                  </div>
                </div>
              ))
            : candidateData.map((c) => {
                let sortedRemark = "";

                if (Array.isArray(c?.remark) && c.remark.length > 0) {
                  sortedRemark =
                    [...c.remark] // make a copy so original array is not mutated
                      .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
                      ?.title || "";
                }
                return (
                  <div
                    key={c._id}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{c.name}</h3>
                        <p className="text-sm text-gray-500">
                          {c.domain && Array.isArray(c.domain)
                            ? c.domain.join(", ")
                            : c.domain}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {renderStatusBadge(capitalize(c.status), c)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1 mb-3">
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        <a
                          href={`mailto:${c.email}`}
                          className="text-blue-500 hover:underline"
                        >
                          {c.email}
                        </a>
                      </p>
                      <p>
                        <span className="font-medium">Assigned To:</span>{" "}
                        <span>{c.hrName}</span>
                      </p>

                      {/* WhatsApp */}
                      <p>
                        <span className="font-medium">WhatsApp:</span>{" "}
                        <a
                          href={`https://wa.me/${c.mobile}`}
                          className="text-green-500 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Chat on WhatsApp
                        </a>
                      </p>

                      <p>
                        <span className="font-medium">Exp:</span>{" "}
                        {c.experienceYears || "Fresher"}
                      </p>

                      <p className="font-medium">
                        Updated At: {moment(c.updatedAt).format("ll")}
                      </p>

                      {isFreelancerAssignedTable && (
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-medium text-gray-700 mb-1">
                            Remarks:
                          </label>
                          <div className="relative w-full">
                            <p
                              className={`w-full border rounded-md px-3 ${
                                c?.remark ? "py-2" : "py-4"
                              } pr-12 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                            >
                              {sortedRemark}
                            </p>
                            <button
                              key={c._id}
                              type="button"
                              onClick={() => onEdit(c)}
                              className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-500 hover:text-blue-600 z-10 cursor-pointer"
                            >
                              <FaEdit className="text-lg pointer-events-none" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => onView(c)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm"
                      >
                        <FaEye className="inline mr-1" /> View
                      </button>
                      {showAssignButton && (
                        <button
                          onClick={() => onAssign(c._id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm"
                        >
                          <FaUserPlus className="inline mr-1" /> Assign
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>
      )}
    </>
  );
};

export default FreelancerCandidateTable;
