import React from "react";

const Info = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500 font-medium">{label}</span>
    <span className="text-base text-gray-800">
      {value !== undefined && value !== "" ? value : "—"}
    </span>
  </div>
);

export default Info;
