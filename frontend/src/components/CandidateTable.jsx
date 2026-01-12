import React, { useEffect, useState } from "react";
import {
  FaEye,
  FaUserPlus,
  FaBriefcase,
  FaPhoneSquareAlt,
  FaMapPin,
  FaMap,
  FaCalendarCheck,
  FaGraduationCap,
  FaWhatsapp,
  FaIdCard,
  FaIdCardAlt,
  FaUser,
  FaUserAlt,
  FaEdit,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Map, MapPin, MapPinCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { baseUrl } from "../api";

import Tooltip from "./Tooltip";
import ProgressBar from "./ProgressBar";

const CandidateTable = ({
  handleRemarkSave,
  loading,
  candidates = [],
  onAssign,
  onView,
  onEdit,
  showAssignButton = false,
  showEditButton = false,
  isAssignedTable = false,
  showShortlistedDetails = false,
  showShortlistedColumnsOnly = false,
  redirect,
  selectedCandidate,
  isFreelancerTable = false,
  page,
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

  const renderStatusBadge = (status = "Pending", candidate = {}) => {
    const BADGE_COLORS = {
      Pending: "bg-slate-100 text-slate-700",
      Assigned: "bg-green-100 text-green-700",
      Onhold: "bg-amber-100 text-amber-700",
      Shortlisted: "bg-indigo-100 text-indigo-700",
      Rejected: "bg-rose-100 text-rose-700",
      Submitted: "bg-sky-100 text-sky-700",
      Approved: "bg-teal-100 text-teal-700",
      default: "bg-gray-100 text-gray-700",
    };

    const normalizedStatus = status || "Pending";
    const navigableStatuses = new Set(["Assigned", "Shortlisted","Approved","Review","Onhold"]);
    const isTeamsPage = redirect === "/teams";
    const hasId = Boolean(candidate?._id);
    const isNavigableStatus = navigableStatuses.has(normalizedStatus);
    const canNavigate = !isTeamsPage && hasId && isNavigableStatus;

    const isEventPending = Boolean(candidate?.isEventPending);
    const latestEvent = candidate?.latestEvent;

    const colorClass = isEventPending
      ? "bg-orange-100 text-orange-700"
      : BADGE_COLORS[normalizedStatus] || BADGE_COLORS.default;

    const label =
      isEventPending && latestEvent
        ? `${capitalize(latestEvent.eventName || "")} ${capitalize(
            latestEvent.status || ""
          )}`.trim()
        : capitalize(normalizedStatus);

    const handleClick = () => {
      if (!canNavigate) return;

      navigate(`/application-tracker${redirect}/${candidate._id}`, {
        state: { page },
      });
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition ${colorClass}`}
        onClick={handleClick}
      >
        <span>{label}</span>

        {canNavigate && <FaEye className="w-4 h-4 ml-1" />}
      </span>
    );
  };

  const renderSkeletonLoader = () => {
    return (
      <>
        {Array(5)
          .fill()
          .map((_, index) => (
            <tr key={index} className="hover:bg-gray-100 transition">
              {/* Applicant Name */}
              <td className="px-4 py-3 truncate max-w-[120px]">
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

              {/* Domain */}
              <td className="px-4 py-3 truncate max-w-[100px]">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </td>

              {/* Applicant Details */}
              {!isFreelancerTable && (
                <td className="px-4 py-3 truncate max-w-[130px]">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
                </td>
              )}

              {/* Contact */}
              <td className="px-4 py-3">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded mt-2"></div>
              </td>

              {!showShortlistedColumnsOnly && (
                <td className="px-4 py-3">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded mt-2"></div>
                </td>
              )}
              {/* Remarks (if assigned table) */}
              {isAssignedTable && (
                <>
                  {/* <td className="px-4 py-3">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </td> */}

                  <td className="px-4 py-3">
                    <div className="w-8 h-6 bg-gray-200 rounded" />
                  </td>
                </>
              )}
            </tr>
          ))}
      </>
    );
  };

  return (
    <>
      {/* ✅ Desktop View */}
      {!isMobileView ? (
        <div className="overflow-x-auto bg-white border border-gray-200 shadow-sm rounded-xl">
          <table className="w-full text-sm text-left table-auto">
            {showShortlistedColumnsOnly ? (
              <thead className="bg-gray-200 text-gray-700 uppercase text-xs border-b sticky top-0 font-medium">
                <tr>
                  <th className="px-4 py-3">APPLICANT DETAILS</th>
                  <th className="px-4 py-3">ACTION</th>
                  <th className="px-4 py-3  text-center">STATUS</th>
                  <th className="px-4 py-3">HR NAME</th>
                  <th className="px-4 py-3">CONTACT</th>
                  <th className="px-4 py-3">LAST UPDATE</th>
                </tr>
              </thead>
            ) : (
              <thead className="bg-gray-200 text-gray-700 uppercase text-xs border-b sticky top-0 font-medium">
                <tr>
                  <th className="px-4 py-3 text-center">APPLICANT NAME</th>
                  <th className="px-4 py-3 text-center">ACTION</th>
                  <th className="px-4 py-3">DOMAIN</th>
                  <th className="px-8 py-3">STATUS</th>
                  {!isFreelancerTable && (
                    <th className="px-4 py-3">Passout Year</th>
                  )}
                  <th className="px-4 py-3">CONTACT</th>
                  <th className="px-4 py-3">Availability</th>

                  {isAssignedTable && (
                    <>
                      <th className="px-4 py-3">Remarks</th>
                      {/* <th className="px-4 py-3">Rating</th> */}
                    </>
                  )}
                </tr>
              </thead>
            )}

            <tbody className="divide-y text-sm">
              {loading
                ? renderSkeletonLoader()
                : candidateData.map((c) => {
                    return showShortlistedColumnsOnly ? (
                      <tr key={c._id}>
                        <td className="px-4 py-3 truncate max-w-[130px]">
                          <p title={c.name}>{c.name}</p>
                          <div className="flex items-center mt-2">
                            <FaBriefcase className="mr-2 text-start text-gray-500" />
                            <p>
                              {c.experienceYears
                                ? `${c.experienceYears} yrs`
                                : "Fresher"}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {/* {renderStatusBadge(capitalize(c.status), c)} */}
                          <button
                            onClick={() => onView(c)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm"
                          >
                            <FaEye />
                          </button>
                        </td>
                        <td className="px-4 py-3 relative group">
                          <ProgressBar status={c.status} candidate={c} />
                        </td>

                        <td className="px-4 py-3">
                          {c.user
                            ? `${c.user.firstName} ${c.user.lastName}`
                            : c.hrName}
                        </td>

                        <td className="px-4 py-3 truncate max-w-[200px]">
                          <p title={c.email}>
                            <a
                              href={`mailto:${c.email}`}
                              className="hover:text-blue-500 hover:text-sm"
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
                              <FaWhatsapp
                                className="text-lg"
                                title="Chat on WhatsApp"
                              />
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {moment(c.updatedAt).format("ll")}
                        </td>
                      </tr>
                    ) : (
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
                              className="flex items-center gap-1 text-gray-700 text-xs"
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
                          {showAssignButton && (
                            <button
                              onClick={() => onAssign(c._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded-full text-xs"
                            >
                              <FaUserPlus />
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3 truncate max-w-[100px]">
                          <p title={c.domain}>
                            {c.domain && Array.isArray(c.domain)
                              ? c.domain.join(", ")
                              : c.domain}
                          </p>
                          <div className="flex mt-1 items-center">
                            <FaBriefcase className="mr-2 text-start text-gray-500" />
                            <p>
                              {c.experienceYears
                                ? `${c.experienceYears} yrs`
                                : "Fresher"}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {renderStatusBadge(capitalize(c.status), c)}
                        </td>
                        {!isFreelancerTable && (
                          <td
                            className="px-4 py-3 truncate max-w-[130px]"
                            title={c.degree}
                          >
                            <p>{c.degree}</p>
                            <div className="flex items-center mt-1">
                              <FaGraduationCap className="mr-2 text-gray-500" />
                              <p>{c.graduationYear?.split("-")[0]}</p>
                            </div>
                          </td>
                        )}
                        <td className="px-4 py-3 truncate max-w-[200px]">
                          <p>
                            <a
                              href={`mailto:${c.email}`}
                              className="hover:text-blue-500 "
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
                              <FaWhatsapp
                                className="text-lg"
                                title="Chat on WhatsApp"
                              />
                            </a>
                          </div>
                        </td>

                        <td
                          className="px-4 py-3 truncate max-w-[100px]"
                          title={c.currentLocation}
                        >
                          <p className="capitalize mb-1">{c.currentLocation}</p>
                          <div className="flex items-center text-sm text-gray-600">
                            <FaCalendarCheck className="mr-2 text-gray-500" />
                            <span title={c.availability} className="capitalize">
                              {c.availability}
                            </span>
                          </div>
                        </td>

                        {isAssignedTable && (
                          <td className="px-2 py-2">
                            <button
                              key={c._id}
                              className="text-center"
                              onClick={() => onEdit(c)}
                            >
                              <FaEdit className="text-center text-gray-500" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      ) : (
        // ✅ Mobile View
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2 py-2">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm animate-pulse"
                >
                  <div className="h-5 w-32 bg-gray-200 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-8 w-full bg-gray-300 rounded"></div>
                    <div className="h-8 w-full bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            : candidateData.map((c) => {
                let sortedRemark = "";
                if (Array.isArray(c?.remark) && c?.remark?.length > 0) {
                  sortedRemark =
                    [...c?.remark].sort(
                      (a, b) => new Date(b.date) - new Date(a.date)
                    )[0]?.title || "";
                }

                return (
                  <div
                    key={c._id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm 
             hover:shadow-lg transition-all duration-200"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 leading-snug">
                          {c?.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {c?.domain && Array.isArray(c.domain)
                            ? c.domain.join(", ")
                            : c?.domain}
                        </p>
                      </div>
                      <div className="ml-2">
                        {renderStatusBadge(capitalize(c?.status), c)}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="text-[15px]  text-gray-700 space-y-3">
                      {/* ROW 1 */}
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div className="flex items-center gap-2">
                          <FaUserAlt className="text-gray-500 text-sm" />
                          <span className="text-sm">{c?._id.slice(-5)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <FaBriefcase className="text-gray-500 text-sm" />
                          <span className="text-sm">
                            {c?.experienceYears || "Fresher"}
                          </span>
                        </div>

                        {!isFreelancerTable && (
                          <div className="flex items-center gap-2">
                            <FaGraduationCap className="text-gray-500 text-sm" />
                            <span className="text-sm">
                              {c?.graduationYear?.split("-")[0]}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <FaCalendarCheck className="text-gray-500 text-sm" />
                          <span className="capitalize text-sm">
                            {c?.availability}
                          </span>
                        </div>
                      </div>

                      {/* Inline rows */}
                      <div className="space-y-1">
                        <p>
                          <span className="font-medium">Location:</span>{" "}
                          <span className="capitalize">
                            {c?.currentLocation}
                          </span>
                        </p>

                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          <a
                            href={`mailto:${c.email}`}
                            className="text-blue-500 hover:underline break-all"
                          >
                            {c?.email}
                          </a>
                        </p>

                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          <a
                            href={`tel:${c.mobile}`}
                            className="text-blue-500 hover:underline"
                          >
                            {c?.mobile}
                          </a>
                        </p>

                        <p>
                          <span className="font-medium">WhatsApp:</span>{" "}
                          <a
                            href={`https://wa.me/${c.mobile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 font-medium hover:underline"
                          >
                            Chat on WhatsApp
                          </a>
                        </p>

                        {isAssignedTable && (
                          <p>
                            <span className="font-medium">HR Name:</span>{" "}
                            {c?.user
                              ? `${c?.user?.firstName} ${c?.user?.lastName}`
                              : c.hrName}
                          </p>
                        )}

                        <p>
                          <span className="font-medium">Updated:</span>{" "}
                          {moment(c?.updatedAt).format("ll")}
                        </p>
                      </div>

                      {/* Remarks */}
                      {isAssignedTable && (
                        <div className="mt-3">
                          <label className="text-sm font-semibold text-gray-700 mb-1 block">
                            Latest Remark
                          </label>
                          <div className="relative w-full">
                            <p className="w-full border bg-gray-50 rounded-md px-3 py-3 pr-12 text-sm">
                              {sortedRemark || "No remarks yet"}
                            </p>
                            <button
                              onClick={() => onEdit(c)}
                              className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-500 hover:text-blue-600"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() => onView(c)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-md text-sm font-medium"
                      >
                        <FaEye className="inline mr-1" /> View
                      </button>

                      {showAssignButton && (
                        <button
                          onClick={() => onAssign(c._id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded-md text-sm font-medium"
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

export default CandidateTable;
