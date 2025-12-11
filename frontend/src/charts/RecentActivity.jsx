export default function HrRecentActivity() {
  const activities = [
    {
      id: 1,
      name: "Reema Soni",
      action: "sent an offer letter to",
      candidate: "Rajeev Verma",
      date: "2025-07-24T09:00:00Z",
    },
    {
      id: 2,
      name: "Shamna OV",
      action: "marked",
      candidate: "Neha Saxena as Hired",
      date: "2025-07-23T14:30:00Z",
    },
    {
      id: 3,
      name: "Richa Sharma",
      action: "deployed candidate",
      candidate: "Aman Tiwari to Sales Team",
      date: "2025-07-22T11:00:00Z",
    },
    {
      id: 4,
      name: "Saundarya",
      action: "scheduled an interview with",
      candidate: "Pratik Kulkarni",
      date: "2025-07-21T10:15:00Z",
    },
    {
      id: 5,
      name: "Shubhi",
      action: "rejected application of",
      candidate: "Shraddha Singh",
      date: "2025-07-20T16:45:00Z",
    },
    {
      id: 6,
      name: "Preeti Chauhan",
      action: "on hold application of",
      candidate: "Santosh",
      date: "2025-07-20T16:45:00Z",
    },
    

    {
      id: 7,
      name: "Shrashti Gupta",
      action: "pending application of",
      candidate: "Vivek Kumar",
      date: "2025-07-20T16:45:00Z",
    },

  ];

  return (
    <div className="h-[295px] flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        Recent HR Activities
      </h3>

      {/* Scrollable area */}
      <div className="overflow-y-auto pr-2 flex-1">
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="border-l-4 border-blue-500 pl-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{activity.name}</span>{" "}
                {activity.action}{" "}
                <span className="text-gray-900 font-medium">
                  {activity.candidate}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(activity.date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
