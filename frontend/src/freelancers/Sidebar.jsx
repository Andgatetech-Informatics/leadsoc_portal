import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  UserCircleIcon,
  CheckCircle,
  BriefcaseBusiness,
} from "lucide-react";

const navItems = [
  { to: "/dashboard/freelancer", label: "Dashboard", icon: LayoutDashboard },
  { to: "/applicants-list", label: "Applicants", icon: BriefcaseBusiness },
  { to: "/current-active-jobs", label: "Active Jobs", icon: CheckCircle },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const fullName = `${capitalize(user?.userData?.firstName)} ${capitalize(
    user?.userData?.lastName
  )}`.trim();

  return (
    <div
      className={`h-screen bg-[#1e1e2f] text-gray-300 transition-all duration-300 ease-in-out fixed z-50 border-r border-gray-700
        ${isOpen ? "w-56" : "w-0"}`}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Top Section */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <Link to="/dashboard/freelancer" className="flex items-center gap-2">
            <UserCircleIcon size={22} />
            {isOpen && (
              <span className="text-sm font-semibold text-white tracking-wide">
                {fullName}
              </span>
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav
          className={`flex-1 px-2 py-4 space-y-1 transition-all duration-300
      ${
        isOpen
          ? "overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-1"
          : "overflow-hidden"
      }`}
        >
          {navItems.map(({ to, label, icon: Icon }, index) => {
            const isActive = location.pathname.startsWith(to);
            return (
              <Link
                key={index}
                to={to}
                className={`group relative flex items-center px-3 py-2 rounded-md transition-colors duration-200 text-sm ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span
                  className={`absolute left-0 top-0 h-full w-1 rounded-r-full ${
                    isActive ? "bg-blue-400" : "bg-transparent"
                  }`}
                ></span>

                <Icon
                  size={20}
                  className={`min-w-[20px] transition-transform duration-300 ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                />

                {isOpen && <span className="ml-3">{label}</span>}

                {!isOpen && (
                  <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded z-50 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-300 shadow-lg">
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ✅ Bottom Incentive — will stay fixed at bottom */}
        <div className="border-t mb-16 border-gray-700 bg-gray-800 p-3">
          <div className="p-3 rounded-lg bg-gray-900 text-center font-semibold text-white text-sm">
            Total Incentive: ₹1000
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
