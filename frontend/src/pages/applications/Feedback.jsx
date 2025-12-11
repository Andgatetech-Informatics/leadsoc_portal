import React from "react";

const EventDetails = ({ feedbackData, onClose }) => {
  if (!feedbackData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg relative">
        <button
          onClick={() => onClose(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        {["Screening", "Orientation"].includes(feedbackData.event) && (
          <div>
            <h3 className="text-xl font-semibold text-indigo-700 mb-4">
              Screening Feedback
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-700 font-medium">
                  Communication
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Rating: {feedbackData.communication}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Confidence</p>
                <p className="text-xs text-gray-500 mt-1">
                  Rating: {feedbackData.confidence}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-700 font-medium">Remarks</p>
                <div className="text-sm text-gray-800 bg-gray-100 rounded-md p-3 mt-1">
                  {feedbackData.remark || "N/A"}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Action</p>
                <p className="text-sm text-gray-800 mt-1 capitalize">
                  {feedbackData.decision || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
        {[
          "Technical 1",
          "Technical 2",
          "Technical 3",
          "Client 1",
          "Client 2",
          "Client 3",
        ].includes(feedbackData.event) && (
          <div className="bg-white p-6 rounded-lg shadow mt-4">
            <h3 className="text-xl font-semibold text-indigo-700 mb-6">
              Technical Feedback
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Constraints", value: feedbackData.constraints },
                { label: "Assertion", value: feedbackData.assertion },
                { label: "Coverage", value: feedbackData.coverage },
                {
                  label: "Problem Solving",
                  value: feedbackData.problemSolving,
                },
                { label: "Protocols", value: feedbackData.protocols },
                { label: "Scripting", value: feedbackData.scripting },
                { label: "System Verilog", value: feedbackData.systemVerilog },
                { label: "PD", value: feedbackData.pd },
                { label: "DFT", value: feedbackData.dft },
                { label: "RTL", value: feedbackData.rtl },
                {
                  label: "Technical Skills",
                  value: feedbackData.technicalSkills,
                },
                { label: "UVM Rating", value: feedbackData.uvm },
                { label: "Verilog", value: feedbackData.verilog },
              ].map((item, index) => (
                <div key={index}>
                  <p className="text-sm font-medium text-gray-700">
                    {item.label}
                  </p>
                  <p className="text-sm text-gray-800 mt-1 capitalize">
                    {item.value ?? "N/A"}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-1">Remarks</p>
              <div className="bg-gray-100 text-sm text-gray-800 rounded-md p-3">
                {feedbackData.remark || "N/A"}
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-700 font-medium">Decision</p>
              <p className="text-sm text-gray-800 mt-1 capitalize">
                {feedbackData.decision || "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
