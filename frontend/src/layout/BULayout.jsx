import React, { useState, useEffect } from "react";

import { Outlet } from "react-router-dom";
import Navbar from "../BU/Navbar";
import Sidebar from "../BU/Sidebar";

const BULayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 850px)");

    const handleResize = (e) => {
      setIsSidebarOpen(!e.matches);
    };

    handleResize(mediaQuery);
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="">
        <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      {/* Content Wrapper */}
      <div className="flex flex-1 overflow-hidden ">
        {/* Sidebar */}
        {isSidebarOpen && (
          <>
            {/* Sidebar overlay on small screens */}
            <div className="fixed md:static md:w-56">
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>

            <div
              className="fixed  bg-black bg-opacity-30  md:hidden"
              onClick={toggleSidebar}
            />
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BULayout;
