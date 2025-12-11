import React, { useMemo } from "react";
import CreatableSelect from "react-select/creatable";
import { ErrorMessage, useFormikContext } from "formik";

const normalizeOption = (opt) =>
  typeof opt === "object" ? opt : { value: opt, label: String(opt) };

const FormSelect = ({ label, name, options, disabled = false }) => {
  const { setFieldValue, values } = useFormikContext();

  const formattedOptions = useMemo(
    () => options.map((opt) => normalizeOption(opt)),
    [options]
  );

  // ✅ Auto-detect if value is array → multi-select mode
  const value = values[name];
  const isMulti = Array.isArray(value);

  // 🧠 Normalize selected value
  const selectedValue = isMulti
    ? formattedOptions.filter((opt) => value.includes(opt.value))
    : formattedOptions.find((opt) => opt.value === value) || null;

  // 💡 If disabled, show plain read-only text instead of dropdown
  if (disabled) {
    const displayValue = isMulti
      ? value.length
        ? value.join(", ")
        : "—"
      : value || "—";

    return (
      <div>
        <label className="block font-semibold text-gray-700 mb-1">
          {label} <span className="text-red-500">*</span>
        </label>
        <div className="p-2 border rounded bg-gray-50 text-gray-700">
          {displayValue}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block font-semibold text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>

      <CreatableSelect
        isClearable
        isDisabled={disabled}
        isMulti={isMulti} // 👈 automatic based on array detection
        options={formattedOptions}
        value={selectedValue}
        onChange={(option) =>
          setFieldValue(
            name,
            isMulti
              ? option.map((o) => o.value) // store array
              : option
              ? option.value
              : ""
          )
        }
      />

      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default FormSelect;
