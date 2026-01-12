import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  UsersRoundIcon,
  BriefcaseIcon,
  Users,
  CheckCircle,
  User,
  UserCircleIcon,
  History,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { to: "/dashboard/hr", label: "Dashboard", icon: LayoutDashboard },
  // { to: "/applicants-Status", label: "Applicants Status", icon: UsersRoundIcon },
  // { to: "/candidates-list", label: "New Candidates", icon: BriefcaseIcon },
  // { to: "/assigned-candidates", label: "Assigned Candidates", icon: Users },
  // {
  //   to: "/shortlisted-candidates",
  //   label: "Shortlisted Candidates",
  //   icon: History,
  // },
  // { to: "/active-jobs", label: "Active Jobs", icon: CheckCircle },
  { to: "/onboarding-candidates", label: "Onboardings", icon: ClipboardCheck },
  { to: "/hired-candidates-hr", label: "Hired", icon: ShieldCheck },
  { to: "/user", label: "Teams", icon: User },
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
          <Link to="/dashboard" className="flex items-center gap-2">
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
                {/* Left Indicator */}
                <span
                  className={`absolute left-0 top-0 h-full w-1 rounded-r-full ${
                    isActive ? "bg-blue-400" : "bg-transparent"
                  }`}
                ></span>

                {/* Icon */}
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
      </div>
    </div>
  );
};

export default Sidebar;
