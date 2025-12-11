import React from "react";
import { ErrorMessage } from "formik";

const FormFile = ({ label, name, setFieldValue, required = true, multiple = false, accept }) => (
  <div className="mb-4">
    <label className="block font-semibold text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="file"
      name={name}
      multiple={multiple}
      accept={accept}
      onChange={(event) => {
        const fileInput = event.currentTarget.files;
        const fileValue = multiple ? Array.from(fileInput) : fileInput[0] || null;
        setFieldValue(name, fileValue);
      }}
      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <ErrorMessage name={name} component="p" className="text-red-500 text-sm mt-1" />
  </div>
);

export default FormFile;
