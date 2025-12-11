import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FilterDateMonth = ({
  getAllData,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <div className="w-full px-3 py-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-center gap-4 max-w-3xl mx-auto">
        {/* Start Date */}
        <div className="flex flex-row gap-3">
          <div className="w-full sm:w-32">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start Date"
              dateFormat="yyyy-MM-dd"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              isClearable
            />
          </div>

          {/* End Date */}
          <div className="w-full sm:w-32">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="End Date"
              dateFormat="yyyy-MM-dd"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              isClearable
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDateMonth;
