import { User, CheckCircle, Clock, FileText } from "lucide-react";

const iconMap = {
  user: <User className="w-6 h-6 text-blue-500" />,
  check: <CheckCircle className="w-6 h-6 text-green-500" />,
  clock: <Clock className="w-6 h-6 text-yellow-500" />,
  file: <FileText className="w-6 h-6 text-purple-500" />,
};

export default function SummaryCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="p-3 rounded-full bg-gray-100">{iconMap[icon]}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
