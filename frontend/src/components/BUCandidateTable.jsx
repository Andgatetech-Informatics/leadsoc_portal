import React, { useEffect, useMemo, useState } from "react";
import {
  FaEye,
  FaPhoneSquareAlt,
  FaWhatsapp,
  FaBriefcase,
} from "react-icons/fa";
import ProgressBar from "./ProgressBar";

/* ================= SKELETONS ================= */
const TableSkeletonRow = () => (
  <tr>
    {[...Array(8)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
      </td>
    ))}
  </tr>
);

const MobileSkeletonCard = () => (
  <div className="bg-white border rounded-xl p-4 space-y-3 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-2/3" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="h-8 bg-gray-200 rounded" />
  </div>
);

/* ================= RESPONSIVE HOOK ================= */
const useResponsive = (breakpoint = 1100) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(`(max-width:${breakpoint}px)`).matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${breakpoint}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
};

/* ================= SELECTION HOOK ================= */
const useSelection = (items, selected, setSelected) => {
  const allIds = useMemo(() => items.map((c) => c._id), [items]);

  const isAll = allIds.length > 0 && selected.length === allIds.length;
  const isPartial = selected.length > 0 && !isAll;

  const toggleAll = () => {
    setSelected(isAll ? [] : allIds);
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  return { isAll, isPartial, toggleAll, toggleOne };
};

/* ================= MAIN COMPONENT ================= */
const BUCandidateTable = ({
  loading,
  candidates = [],
  onView,
  selected = [],
  setSelected,
}) => {
  const isMobile = useResponsive(1100);

  const { isAll, isPartial, toggleAll, toggleOne } = useSelection(
    candidates,
    selected,
    setSelected
  );

  const renderVendorName = (c) => {
    if (!c.isFreelancer) return c.hrName || "-";

    return (
      `${c.FreelancerId?.firstName || ""} ${c.FreelancerId?.lastName || ""
        }`.trim() ||
      c.freelancerName ||
      "-"
    );
  };

  /* ================= DESKTOP VIEW ================= */
  if (!isMobile) {
    return (
      <div className="overflow-x-auto bg-white border rounded-xl shadow">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-200 text-xs uppercase font-semibold">
            <tr>
              <th className="px-4 py-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAll}
                  ref={(el) => el && (el.indeterminate = isPartial)}
                  onChange={toggleAll}
                  className="h-4 w-4 cursor-pointer"
                />
              </th>

              <th className="px-4 py-3">Applicant Details</th>
              <th className="px-4 py-3 text-center w-20">Action</th>
              <th className="px-4 py-3 w-40">Status</th>
              <th className="px-4 py-3 w-56">Contact</th>
              <th className="px-4 py-3">Job Position</th>
              <th className="px-4 py-3">Candidate Type</th>
              <th className="px-4 py-3">TA</th>
            </tr>
          </thead>

          <tbody>
            {loading &&
              [...Array(5)].map((_, i) => <TableSkeletonRow key={i} />)}

            {!loading && candidates.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No candidates found
                </td>
              </tr>
            )}

            {!loading &&
              candidates.map((c) => (
                <tr
                  key={c._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(c._id)}
                      onChange={() => toggleOne(c._id)}
                      className="h-4 w-4 cursor-pointer"
                    />
                  </td>

                  <td className="px-4 py-3 truncate max-w-[140px]">
                    <p title={c.name}>{c.name}</p>
                    <div className="flex items-center mt-2">
                      <FaBriefcase className="mr-2 text-gray-500" />
                      <p>
                        {c.experienceYears
                          ? `${c.experienceYears} yrs`
                          : "Fresher"}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => onView?.(c)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition"
                    >
                      <FaEye />
                    </button>
                  </td>

                  <td className="px-4 py-3 relative group">
                    <ProgressBar status={c.status} candidate={c} />
                  </td>

                  <td className="px-4 py-4 max-w-[220px]">
                    <a
                      href={`mailto:${c.email}`}
                      className="block truncate text-gray-600"
                    >
                      {c.email}
                    </a>

                    <div className="flex items-center mt-2 text-gray-500 gap-3">
                      <a
                        href={`tel:${c.mobile}`}
                        className="flex items-center hover:text-blue-600"
                      >
                        <FaPhoneSquareAlt className="mr-2" />
                        {c.mobile}
                      </a>

                      <a
                        href={`https://wa.me/${c.mobile}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-green-500"
                      >
                        <FaWhatsapp />
                      </a>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {c.jobTitle || "N/A"}
                  </td>

                  <td className="px-4 py-4">
                    {c.candidateType === "internal"
                      ? "Bench"
                      : "Pipeline"}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">
                        {renderVendorName(c)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {c.isFreelancer ? "Vendor" : "TA"}
                      </span>

                      {c.isFreelancer && (
                        <span className="text-xs text-blue-600">
                          Assigned TA: {c.hrName || "-"}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* ================= MOBILE VIEW ================= */
  return (
    <div className="grid gap-4 p-2">
      {loading &&
        [...Array(4)].map((_, i) => <MobileSkeletonCard key={i} />)}

      {!loading && candidates.length === 0 && (
        <div className="text-center py-6 bg-white border rounded-xl text-gray-500">
          No candidates found
        </div>
      )}

      {!loading &&
        candidates.map((c) => (
          <div
            key={c._id}
            className="bg-white border rounded-xl p-4 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start">
              <input
                type="checkbox"
                checked={selected.includes(c._id)}
                onChange={() => toggleOne(c._id)}
                className="mt-1 h-4 w-4 cursor-pointer"
              />

              <div>
                <h3 className="font-semibold text-lg">{c.name}</h3>
                <p className="text-xs text-gray-500">
                  {c.experienceYears
                    ? `${c.experienceYears} yrs experience`
                    : "Fresher"}
                </p>
              </div>

              <div className="min-w-[120px]">
                <ProgressBar status={c.status} candidate={c} />
              </div>
            </div>

            <div className="text-sm space-y-1">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${c.email}`}
                  className="text-blue-600 break-all"
                >
                  {c.email}
                </a>
              </p>

              <p className="flex items-center gap-2">
                <strong>Mobile:</strong>
                <a href={`tel:${c.mobile}`} className="text-blue-600">
                  {c.mobile}
                </a>
                <a
                  href={`https://wa.me/${c.mobile}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-600"
                >
                  <FaWhatsapp />
                </a>
              </p>
            </div>

            <div className="text-sm">
              <p>
                <strong>Job:</strong>{" "}
                {c.jobTitle || "N/A"}
              </p>
              <p>
                <strong>Type:</strong> {c.candidateType || "-"}
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <strong>TA:</strong> {renderVendorName(c)} •{" "}
              {c.isFreelancer ? "Vendor" : "TA"}
            </div>

            <button
              onClick={() => onView?.(c)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center justify-center gap-2"
            >
              <FaEye /> View Candidate
            </button>
          </div>
        ))}
    </div>
  );
};

export default BUCandidateTable;
