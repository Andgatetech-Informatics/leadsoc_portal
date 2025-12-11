import { AlertTriangle } from "lucide-react";

const JobsAlerts = () => {
 const jobs = [
  { title: "Fullstack Developer", age: "12 days", status: "At Risk", color: "text-red-500" },
  { title: "QA Engineer", age: "6 days", status: "Slow", color: "text-yellow-500" },
  { title: "UI/UX Designer", age: "18 days", status: "Critical Delay", color: "text-red-600" },
  { title: "Data Analyst", age: "9 days", status: "Pending Profiles", color: "text-orange-500" },
  { title: "DevOps Engineer", age: "3 days", status: "Healthy", color: "text-green-600" },
  { title: "Product Manager", age: "15 days", status: "Needs Action", color: "text-amber-600" },
  { title: "Backend Developer", age: "20 days", status: "Stalled", color: "text-red-700" },
  { title: "Mobile App Developer", age: "8 days", status: "Slow Progress", color: "text-yellow-600" },
];


  return (
    <div className="rounded-xl shadow-sm h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold">Jobs At Risk</h2>
        </div>

        <div className="space-y-4 max-h-64 overflow-y-auto">
          {jobs.map((job, i) => (
            <div key={i} className="border p-3 rounded-lg bg-gray-50 shadow-sm">
              <p className="font-medium">{job.title}</p>
              <p className="text-xs text-gray-600">Ageing: {job.age}</p>
              <p className={`text-xs font-semibold ${job.color}`}>
                {job.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobsAlerts;
