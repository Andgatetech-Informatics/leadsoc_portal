import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../api";
import moment from "moment";

/* -------------------- SKELETON COMPONENT -------------------- */
const ActivitySkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-l-4 border-gray-200 pl-4">
          <div className="h-4 w-[85%] bg-gray-200 rounded" />
          <div className="h-3 w-[40%] bg-gray-200 rounded mt-2" />
        </div>
      ))}
    </div>
  );
};

const RecentActivity = ({ loading, setLoading, dateRange }) => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fetchActivities = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${baseUrl}/api/stats/get_activities`, {
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status !== 200) {
          setError("Failed to fetch activities");
          return;
        }

        setActivities(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError(err?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [dateRange]);

  return (
    <div className="h-[295px] flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        Recent HR Activities
      </h3>

      {/* Scrollable area */}
      <div className="overflow-y-auto pr-2 flex-1">
        {/* ✅ Loading Skeleton */}
        {loading && <ActivitySkeleton />}

        {/* ✅ Error State */}
        {!loading && error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* ✅ Empty State */}
        {!loading && !error && activities.length === 0 && (
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            No recent activities found.
          </div>
        )}

        {/* ✅ Activities */}
        {!loading && !error && activities.length > 0 && (
          <ul className="space-y-4">
            {activities.map((activity, idx) => (
              <li
                key={activity?._id || activity?.id || idx}
                className="border-l-4 border-blue-500 pl-4"
              >
                <div className="text-sm text-gray-700">
                  <span className="font-medium">
                    {activity?.message || "Untitled Activity"}
                  </span>
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  {moment(activity?.createdAt).format("MMM DD, YYYY [at] hh:mm A")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
