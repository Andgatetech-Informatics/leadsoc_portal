import React from "react";
import { Field, ErrorMessage } from "formik";

const FormField = ({
  label,
  name,
  type = "text",
  placeholder = "",
  required = true,
  disabled = false, 
}) => (
  <div className="mb-4">
    <label className="block font-semibold text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Field
      name={name}
      type={type}
      placeholder={placeholder}
      disabled={disabled} 
      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
    <ErrorMessage
      name={name}
      component="p"
      className="text-red-500 text-sm mt-1"
    />
  </div>
);

export default FormField;
