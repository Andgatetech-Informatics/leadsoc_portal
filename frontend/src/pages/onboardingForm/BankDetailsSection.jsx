import React from "react";
import FormField from "./FormField";
import FormFile from "./FormFile";

const BankDetailsSection = ({ setFieldValue }) => {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
        Bank & Joining Details
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Bank Account Details */}
        <FormField label="Bank Name" name="bankName" />
        <FormField label="Branch Name" name="branchName" />
        <FormField label="Account Holder Name" name="accountHolderName" />
        <FormField label="Account Number" name="accountNumber" />
        <FormField label="Confirm Account Number" name="confirmAccountNumber" />
        <FormField label="IFSC Code" name="ifscCode" />

        {/* Joining Details */}
       
        <FormField label="Date of Joining" name="joiningDate" type="date" />
        <FormField label="Designation Offered" name="offeredDesignation" />
        <FormField label="Orientation Location" name="orientationLocation" />

        {/* Document Uploads */}
        <FormFile
          label="Cancelled Cheque"
          name="cancelledCheque"
          setFieldValue={setFieldValue}
          accept="application/pdf,image/*"
        />
        <FormFile
          label="Aadhar"
          name="aadhar"
          setFieldValue={setFieldValue}
          accept="application/pdf,image/*"
        />
        <FormFile
          label="PAN"
          name="pan"
          setFieldValue={setFieldValue}
          accept="application/pdf,image/*"
        />
        <FormFile
          label="Passport"
          name="passport"
          setFieldValue={setFieldValue}
          accept="application/pdf,image/*"
          required={false}
        />
        <FormFile
          label="Signed Offer Letter"
          name="signedOfferLetter"
          setFieldValue={setFieldValue}
          accept="application/pdf"
        />
        <FormFile
          label="Passport Size Photo"
          name="passportPhoto"
          setFieldValue={setFieldValue}
          accept="image/*"
        />
      </div>
    </section>
  );
};

export default BankDetailsSection;
