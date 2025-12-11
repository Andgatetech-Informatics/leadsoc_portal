// 📁 src/components/forms/AddressForm.jsx
import React, { useState } from "react";
import { Field, ErrorMessage } from "formik";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const AddressSection = ({ values, setFieldValue }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  // Custom style to remove border and match your input UI
  const selectStyle = {
    border: "none",
    outline: "none",
    width: "100%",
    backgroundColor: "transparent",
    fontSize: "0.95rem",
    padding: "0.3rem",
    color: "#374151", // text-gray-700
  };

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <div className="border-b border-gray-300 focus-within:border-blue-500">
            <CountrySelect
              placeHolder="Select Country"
              onChange={(country) => {
                setSelectedCountry(country);
                setFieldValue("country", country.name);
                setFieldValue("state", "");
                setFieldValue("city", "");
              }}
              style={selectStyle}
            />
          </div>
          <ErrorMessage
            name="country"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* State */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <div className="border-b border-gray-300 focus-within:border-blue-500">
            <StateSelect
              countryid={selectedCountry?.id}
              placeHolder="Select State"
              onChange={(state) => {
                setSelectedState(state);
                setFieldValue("state", state.name);
                setFieldValue("city", "");
              }}
              style={selectStyle}
            />
          </div>
          <ErrorMessage
            name="state"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        {/* City */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
          <div className="border-b border-gray-300 focus-within:border-blue-500">
            <CitySelect
              countryid={selectedCountry?.id}
              stateid={selectedState?.id}
              onChange={(city) => setFieldValue("city", city.name)}
              style={selectStyle}
            />
          </div>
          <ErrorMessage
            name="city"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        {/* Street */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Street / House No. <span className="text-red-500">*</span>
          </label>
          <Field
            name="street"
            className="border border-gray-300 focus:border-blue-500 outline-none p-2 w-full"
          />
          <ErrorMessage
            name="street"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Pincode <span className="text-red-500">*</span>
          </label>
          <Field
            name="pincode"
            className="border border-gray-300 focus:border-blue-500 outline-none p-2 w-full"
          />
          <ErrorMessage
            name="pincode"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
      </div>
    </section>
  );
};

export default AddressSection;
