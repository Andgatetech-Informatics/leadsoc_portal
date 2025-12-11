import React from "react";
import FormField from "./FormField";
import FormFile from "./FormFile";

const CompanyDetailsSection = ({ setFieldValue }) => {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
        Last Company Details
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <FormField label="Last Company Name" name="lastCompanyName" />
        <FormField label="Last Company Designation" name="lastDesignation" />
        <FormField label="HR Contact Number" name="lastCompanyHrContact" />
        <FormField label="HR Email" name="lastCompanyHrEmail" type="email" />
        <FormField label="Immediate Manager's Contact" name="immediateManagerContact" />
        <FormField label="Immediate Manager's Email" name="immediateManagerEmail" type="email" />
        <FormField label="Last Working Day" name="lastWorkingDay" type="date" />
      </div>

      {/* Company Address */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Last Company Address</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <FormField label="Street / Office No." name="lastCompanyStreet" />
          <FormField label="City" name="lastCompanyCity" />
          <FormField label="State" name="lastCompanyState" />
          <FormField label="Pincode" name="lastCompanyPincode" />
        </div>
      </div>

      {/* Supporting Documents */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Supporting Documents</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <FormFile
            label="Last Company Offer Letter (PDF)"
            name="lastCompanyOfferLetter"
            setFieldValue={setFieldValue}
            accept="application/pdf"
          />
          <FormFile
            label="Experience Letter (PDF)"
            name="lastCompanyExperienceLetter"
            setFieldValue={setFieldValue}
            accept="application/pdf"
          />
          <FormFile
            label="Relieving Letter (PDF)"
            name="lastCompanyRelievingLetter"
            setFieldValue={setFieldValue}
            accept="application/pdf"
          />
          <FormFile
            label="Salary Slips (up to 5)"
            name="lastCompanySalarySlips"
            setFieldValue={setFieldValue}
            accept="application/pdf"
            multiple
          />
           <FormField label="PF Number" name="pfNumber" />
        </div>
      </div>
    </section>
  );
};

export default CompanyDetailsSection;
