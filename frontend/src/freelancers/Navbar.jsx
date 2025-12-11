import {
  Bell,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
  Search,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { FaRegUser } from "react-icons/fa6";
import { useSelector } from "react-redux";
import AndGatePopup from "../andgateExtension/AndGatePopup";
import Notifications from "../components/Notifications";
import SearchResult from "../components/SearchResult";
import { companyLogoText } from "../api"

const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const location = useLocation();
  const showPopup = location.pathname === "/dashboard/hr";

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const initials =
    capitalize(user?.userData?.firstName?.charAt(0)) +
    capitalize(user?.userData?.lastName?.charAt(0) || "");

  const fullName = `${capitalize(user?.userData?.firstName)} ${capitalize(
    user?.userData?.lastName
  )}`.trim();

  const handleLogout = () => {
    localStorage.clear();
    setIsDropdownOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest("#user-dropdown") &&
        !e.target.closest("#user-button")
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="w-full flex items-center justify-between bg-white px-4 sm:px-6 py-3 shadow-sm border-b ">
      {/* Left: Logo + Toggle (for mobile) */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-500 hover:text-blue-600 transition"
        >
          {isSidebarOpen ? (
            <PanelRightCloseIcon size={25} />
          ) : (
            <PanelRightOpenIcon size={25} />
          )}
        </button>

        <div>
          <h1 className="text-xl font-bold text-blue-600 leading-tight">
            {companyLogoText}
          </h1>
          <p className="text-xs font-semibold text-gray-500  -mt-1">
            Freelancer Management Panel
          </p>
        </div>
      </div>

      {/* Center: Search Bar */}
      {/* <div className="hidden md:flex relative w-full max-w-md mx-4">
        <span className="absolute left-3 top-2.5 text-gray-400">
          <Search size={16} />
        </span>
        <input
          value={searchTerm}
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value.trim())}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && <SearchResult searchTerm={searchTerm} navigateUrl="application-tracker_hr" setSearchTerm={setSearchTerm} />}
      </div> */}

      {/* Right: User Options */}
      {user && (
        <div className="flex items-center gap-4 relative">
       
          {/* Notification Bell */}
          {/* <div className="relative">
            <button
              onClick={() => setIsNotificationOpen((prev) => !prev)}
              className="relative text-black hover:text-blue-600 transition mt-1"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {isNotificationOpen && (
              <Notifications onClose={() => setIsNotificationOpen(false)} />
            )}
          </div> */}

          {/* User Button */}
          <button
            id="user-button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="w-9 h-9 flex items-center justify-center bg-white border border-gray-300 text-black rounded-full font-medium shadow-sm hover:shadow transition"
          >
            {initials || <FaRegUser />}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              id="user-dropdown"
              className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl z-50 border border-gray-200 animate-slideDown"
            >
              {/* User card */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-lg">
                  <FaRegUser />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    {fullName}
                  </span>
                  <span className="text-xs text-gray-500">Manage Profile</span>
                </div>
              </div>

              <div className="flex flex-col py-2">
                <Link
                  to="/profile/freelancer"
                  onClick={() => setIsDropdownOpen(false)}
                  className="px-5 py-3 hover:bg-gray-50 text-gray-700 transition-all duration-200 font-medium flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M5.121 17.804A13.937 13.937 0 0112 15c2.686 0 5.175.79 7.121 2.137M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-5 py-3 hover:bg-gray-50 text-gray-700 transition-all duration-200 font-medium flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Andgate All Products */}
          <div className="">{showPopup && <AndGatePopup />}</div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
