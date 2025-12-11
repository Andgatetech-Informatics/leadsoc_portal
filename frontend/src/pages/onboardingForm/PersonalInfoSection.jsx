import React from "react";
import { useFormikContext } from "formik";
import FormField from "./FormField";
import FormSelect from "./FormSelect";
import AddressSection from "./AddressSection";

const PersonalInfoSection = ({ setFieldValue }) => {
  const { values } = useFormikContext();

  return (
    <>
      {/* ✅ Personal Information */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
          Personal Information
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <FormField label="Full Name" name="name" disabled />
          <FormField label="Mobile Number" name="mobile" disabled />
          <FormField
            label="Emergency Contact Person Name"
            name="emergencyContactPerson"
          />
          <FormField
            label="Emergency Contact Person Number"
            name="emergencyContact"
          />
          <FormField label="Email Address" name="email" type="email" disabled />
          <FormField label="Date of Birth" name="dob" type="date" disabled />

          <FormSelect
            label="Marital Status"
            name="maritalStatus"
            options={["Single", "Married", "Other"]}
          />

          {values.maritalStatus === "Married" && (
            <FormField
              label="Date of Marriage (if married)"
              name="dateOfMarriage"
              type="date"
            />
          )}

          <FormField label="Blood Group" name="bloodGroup" />
          <FormSelect
            label="Gender"
            name="gender"
            options={["Male", "Female", "Other"]}
          />
        </div>
      </section>

      {/* ✅ Address Details */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
          Address Details
        </h2>
        <AddressSection setFieldValue={setFieldValue} />
      </section>

      {/* ✅ Professional Information */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
          Professional Information
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <FormSelect
            label="Domain"
            name="domain"
            options={[
              "PD",
              "DV",
              "DFT",
              "RTL",
              "Software",
              "Human Resource",
              "Other",
            ]}
            isMulti
            disabled
          />

          {/* Experience Type */}
          {/* <FormSelect
              label="Experience Type"
              name="experienceType"
              options={["Fresher", "Experienced"]}
            /> */}

          
          <FormField
            label="Experience Type"
            name="experienceType"
            type="text"
            value={
              values.experienceType === true
                ? "Experienced"
                : values.experienceType === false
                ? "Fresher"
                : ""
            }
            disabled
          />

          {values.experienceType === false && (
            <FormSelect
              label="Internship Experience"
              name="internship"
              options={["Yes", "No"]}
            />
          )}

          {values.experienceType === true && (
            <>
              <FormField
                label="Total Years of Experience"
                name="totalExperience"
                type="number"
                value={values.totalExperience}
                disabled
              />
              <FormField
                label="Relevant Experience"
                name="relevantExperience"
                type="number"
                value={values.relevantExperience}
                disabled
              />
            </>
          )}

          <FormField label="Aadhar Card Number" name="aadharNumber" />
          <FormField label="PAN Card Number" name="panNumber" />
        </div>
      </section>
    </>
  );
};

export default PersonalInfoSection;
