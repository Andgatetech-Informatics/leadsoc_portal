import { Calendar } from "lucide-react";

const UpcomingInterviews = () => {
  return (
    <div className="rounded-xl shadow-sm h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Upcoming Interviews</h2>
        </div>

        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border p-3 rounded-lg shadow-sm bg-gray-50">
              <p className="font-medium">Aman Tiwari - Sales Executive</p>
              <p className="text-xs text-gray-500">
                Tomorrow • 3:00 PM (Online)
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingInterviews;
