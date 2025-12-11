import React, { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import moment from "moment";

const SkeletonNotification = () => (
  <div className="px-5 py-4 border-b border-gray-100 animate-pulse">
    <div className="flex items-start space-x-3">
      <div className="w-6 h-6 rounded-full bg-gray-200 mt-1" />
      <div className="flex-1 space-y-2">
        <div className="w-3/4 h-4 bg-gray-200 rounded" />
        <div className="w-full h-3 bg-gray-200 rounded" />
        <div className="w-2/3 h-3 bg-gray-200 rounded" />
        <div className="flex justify-between mt-3">
          <div className="w-1/4 h-3 bg-gray-200 rounded" />
          <div className="w-1/3 h-3 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  </div>
);

const Notifications = ({ onClose, loading, notifications, setNotifications }) => {
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const toggleReadStatus = (id, isRead) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: !isRead } : n))
    );
  };

  const getPriorityStyle = (priority) => {
    const styles = {
      high: "bg-red-100 text-red-700",
      low: "bg-gray-100 text-gray-600",
      medium: "bg-yellow-100 text-yellow-700",
    };
    return styles[priority] || styles.medium;
  };

  return (
    <div
      ref={dropdownRef}
      className="fixed sm:absolute right-0 top-14 sm:top-[44px] w-[90vw] sm:w-[360px] md:w-[380px] lg:w-[400px] bg-white rounded-lg shadow-xl border border-gray-200 z-50"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        <button className="text-sm text-blue-600 hover:underline" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {loading ? (
          Array(4).fill().map((_, i) => <SkeletonNotification key={i} />)
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500 p-6">No notifications</div>
        ) : (
          notifications.map(({ _id, title, message, isRead, priority, entityType, createdAt }) => (
            <div
              key={_id}
              className={`group px-5 py-4 border-b border-gray-100 transition ${isRead ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                }`}
            >
              <div className="flex items-start space-x-3">
                <div className="pt-1">
                  <FaBell className="text-blue-500 text-lg" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-gray-800">{title}</h3>
                    {/* {priority && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${getPriorityStyle(priority)}`}
                      >
                        {priority}
                      </span>
                    )} */}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {message || "No additional message."}
                  </p>
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-2 flex-wrap">
                      {entityType && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 text-[11px]">
                          {entityType}
                        </span>
                      )}
                      <span>{moment(createdAt).fromNow()}</span>
                    </div>
                    <button
                      onClick={() => toggleReadStatus(_id, isRead)}
                      className="text-blue-600 hover:underline"
                    >
                      {isRead ? "Mark as Unread" : "Mark as Read"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
