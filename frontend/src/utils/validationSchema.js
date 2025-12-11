import { useFormikContext } from "formik";
import * as Yup from "yup";

const FILE_SIZE = 10 * 1024 * 1024; // 10MB
const PDF_FORMAT = ["application/pdf"];
const IMAGE_FORMATS = ["image/jpeg", "image/png", "image/jpg"];

// ✅ Reusable PDF Validation
const pdfValidation = Yup.mixed()
  .required("This PDF file is required")
  .test("fileSize", "File too large (max 10MB)", (value) => {
    if (!value) return false;
    const file = value instanceof File ? value : value[0];
    return file && file.size <= FILE_SIZE;
  })
  .test("fileFormat", "Only PDF files are allowed", (value) => {
    if (!value) return false;
    const file = value instanceof File ? value : value[0];
    return file && PDF_FORMAT.includes(file.type);
  });

// ✅ Reusable Image Validation
const imageValidation = Yup.mixed()
  .required("Passport Size Photo is required")
  .test("fileSize", "File too large (max 10MB)", (value) => {
    if (!value) return false;
    const file = value instanceof File ? value : value[0];
    return file && file.size <= FILE_SIZE;
  })
  .test("fileFormat", "Only JPG, JPEG, or PNG images are allowed", (value) => {
    if (!value) return false;
    const file = value instanceof File ? value : value[0];
    return file && IMAGE_FORMATS.includes(file.type);
  });

// ✅ Main Validation Schema
export const validationSchemaExperience = Yup.object({
  // Personal Info
  name: Yup.string().required("Name is required"),
  mobile: Yup.string().required("Mobile Number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  emergencyContactPerson: Yup.string().required(
    "Emergency Person Name is required"
  ),
  emergencyContact: Yup.string().required(
    "Emergency Contact Number is required"
  ),
  country: Yup.string().required("Country is required"),
  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),
  dob: Yup.string().required("Date of Birth is required"),
  maritalStatus: Yup.string().required("Marital Status is required"),

  // ✅ Conditional Validation
  dateOfMarriage: Yup.string().when("maritalStatus", {
    is: (status) => status === "Married",
    then: (schema) =>
      schema.required("Date of Marriage is required for married candidates"),
    otherwise: (schema) => schema.notRequired(),
  }),

  bloodGroup: Yup.string().required("Blood Group is required"),
  gender: Yup.string().required("Gender is required"),
  domain: Yup.string().required("Domain is required"),
  totalExperience: Yup.number().required("Total Experience is required"),
  relevantExperience: Yup.number().required("Relevant Experience is required"),
  aadharNumber: Yup.string().required("Aadhar Number is required"),
  panNumber: Yup.string().required("PAN Number is required"),

  // Employment Details
  lastCompanyName: Yup.string().required("Last Company Name is required"),
  lastCompanyStreet: Yup.string().required("Street is required"),
  lastCompanyCity: Yup.string().required("City is required"),
  lastCompanyState: Yup.string().required("State is required"),
  lastCompanyPincode: Yup.string()
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),
  lastDesignation: Yup.string().required("Last Designation is required"),
  lastCompanyHrContact: Yup.string().required("HR Contact is required"),
  lastCompanyHrEmail: Yup.string()
    .email("Invalid email")
    .required("HR Email is required"),
  immediateManagerContact: Yup.string().required("Manager Contact is required"),
  immediateManagerEmail: Yup.string()
    .email("Invalid email")
    .required("Manager Email is required"),
  lastWorkingDay: Yup.string().required("Last Working Day is required"),
  joiningDate: Yup.string().required("Joining Date is required"),
  offeredDesignation: Yup.string().required("Designation is required"),
  pfNumber: Yup.string().required("PF Number is required"),
  orientationLocation: Yup.string().required(
    "Orientation Location is required"
  ),

  // Bank Details
  bankName: Yup.string().required("Bank Name is required"),
  branchName: Yup.string().required("Branch Name is required"),
  accountHolderName: Yup.string().required("Account Holder Name is required"),
  accountNumber: Yup.string()
    .matches(/^\d+$/, "Account Number must contain only digits")
    .min(9, "Account Number must be at least 9 digits")
    .max(18, "Account Number can't exceed 18 digits")
    .required("Account Number is required"),
  confirmAccountNumber: Yup.string()
    .oneOf([Yup.ref("accountNumber")], "Account numbers must match")
    .required("Confirm Account Number is required"),
  ifscCode: Yup.string()
    .matches(/^[A-Za-z]{4}\d{7}$/, "Invalid IFSC Code format")
    .required("IFSC Code is required"),

  // Documents (All PDFs except passport photo)
  tenthMarksheet: pdfValidation.required(
    "10th Class Marksheet / Certificate is required"
  ),
  twelfthMarksheet: pdfValidation.required(
    "12th Class Marksheet / Certificate is required"
  ),
  graduationMarksheet: pdfValidation.required(
    "Graduation Marksheet / Convocation is required"
  ),
  lastCompanyOfferLetter: pdfValidation.required("Offer Letter is required"),
  lastCompanyExperienceLetter: pdfValidation.required(
    "Experience Letter is required"
  ),
  lastCompanyRelievingLetter: pdfValidation.required(
    "Relieving Letter is required"
  ),
  lastCompanySalarySlips: Yup.array()
    .min(5, "At least 5 salary slips required")
    .max(8, "Max 8 slips allowed"),
  cancelledCheque: pdfValidation.required("Cancelled Cheque is required"),
  aadhar: pdfValidation.required("Aadhar file is required"),
  pan: pdfValidation.required("PAN file is required"),
  signedOfferLetter: pdfValidation.required("Signed Offer Letter is required"),

  // Photo (Image Only)
  passportPhoto: imageValidation,
});

export const validationSchemaFresher = Yup.object({
  // Personal Info
  name: Yup.string().required("Name is required"),
  mobile: Yup.string().required("Mobile Number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  emergencyContactPerson: Yup.string().required(
    "Emergency Person Name is required"
  ),
  emergencyContact: Yup.string().required(
    "Emergency Contact Number is required"
  ),
  country: Yup.string().required("Country is required"),
  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),
  dob: Yup.string().required("Date of Birth is required"),
  maritalStatus: Yup.string().required("Marital Status is required"),

  // ✅ Conditional validation for Date of Marriage
  dateOfMarriage: Yup.string().when("maritalStatus", {
    is: (status) => status === "Married",
    then: (schema) =>
      schema.required("Date of Marriage is required for married candidates"),
    otherwise: (schema) => schema.notRequired(),
  }),

  bloodGroup: Yup.string().required("Blood Group is required"),
  gender: Yup.string().required("Gender is required"),
  domain: Yup.string().required("Domain is required"),
  internship: Yup.string().required("Internship is required"),
  aadharNumber: Yup.string().required("Aadhar Number is required"),
  panNumber: Yup.string().required("PAN Number is required"),

  joiningDate: Yup.string().required("Joining Date is required"),
  offeredDesignation: Yup.string().required("Designation is required"),
  orientationLocation: Yup.string().required(
    "Orientation Location is required"
  ),

  // Bank Details
  bankName: Yup.string().required("Bank Name is required"),
  branchName: Yup.string().required("Branch Name is required"),
  accountHolderName: Yup.string().required("Account Holder Name is required"),
  accountNumber: Yup.string()
    .matches(/^\d+$/, "Account Number must contain only digits")
    .min(9, "Account Number must be at least 9 digits")
    .max(18, "Account Number can't exceed 18 digits")
    .required("Account Number is required"),
  confirmAccountNumber: Yup.string()
    .oneOf([Yup.ref("accountNumber")], "Account numbers must match")
    .required("Confirm Account Number is required"),
  ifscCode: Yup.string()
    .matches(/^[A-Za-z]{4}\d{7}$/, "Invalid IFSC Code format")
    .required("IFSC Code is required"),

  // Documents (All PDFs except passport photo)
  tenthMarksheet: pdfValidation.required(
    "10th Class Marksheet / Certificate is required"
  ),
  twelfthMarksheet: pdfValidation.required(
    "12th Class Marksheet / Certificate is required"
  ),
  graduationMarksheet: pdfValidation.required(
    "Graduation Marksheet / Convocation is required"
  ),
  cancelledCheque: pdfValidation.required("Cancelled Cheque is required"),
  aadhar: pdfValidation.required("Aadhar file is required"),
  pan: pdfValidation.required("PAN file is required"),
  signedOfferLetter: pdfValidation.required("Signed Offer Letter is required"),

  // Photo (Image Only)
  passportPhoto: imageValidation,
});
