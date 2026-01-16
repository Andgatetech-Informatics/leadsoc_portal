import React, { useCallback, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import PersonalInfoSection from "./PersonalInfoSection";
import EducationSection from "./EducationSection";
import BankDetailsSection from "./BankDetailsSection";
import { validationSchemaFresher } from "../../utils/validationSchema";
import { convertImageToBase64, convertPDFToBase64 } from "../../utils/utils";
import { baseUrl } from "../../api";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import MiniLoading from "../../components/MiniLoading";

const FresherOnboardingForm = () => {
  const { candidateId } = useParams();
  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(true);
  const [candidate, setCandidate] = useState(null);

  const fetchCandidateDetails = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/candidate_details/${candidateId}`
      );
      // console.log("data:", data.data);
      setCandidate(data.data);
    } catch (error) {
      console.error("Candidate Fetch Error:", error);
      toast.error("Failed to fetch candidate.");
    } finally {
      setScreenLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    fetchCandidateDetails();
  }, [fetchCandidateDetails]);

  if (screenLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <MiniLoading />
      </div>
    );
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);

    try {
      const convertAndSet = async (key, convertFn) => {
        if (values[key]) {
          values[key] = await convertFn(values[key]);
        }
      };

      await convertAndSet("tenthMarksheet", convertPDFToBase64);
      await convertAndSet("twelfthMarksheet", convertPDFToBase64);
      await convertAndSet("graduationMarksheet", convertPDFToBase64);
      await convertAndSet("postGraduation", convertPDFToBase64);
      await convertAndSet("aadhar", convertPDFToBase64);
      await convertAndSet("pan", convertPDFToBase64);
      await convertAndSet("passport", convertPDFToBase64);
      await convertAndSet("signedOfferLetter", convertPDFToBase64);
      await convertAndSet("cancelledCheque", convertPDFToBase64);
      await convertAndSet("passportPhoto", convertImageToBase64);

      values.candidateId = candidateId;

      const response = await axios.post(
        `${baseUrl}/api/onboarding-form/create`,
        values
      );
      // console.log("res",response.data)
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit the form.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        <span className="text-gray-700 text-xl">Fresher's Onboarding Form</span>
      </h1>

      <Formik
        validateOnChange={true}
        validateOnBlur={true}
        // validateOnMount={false}
        initialValues={{
          name: candidate?.name,
          mobile: candidate?.mobile,
          emergencyContactPerson: "",
          emergencyContact: "",
          email: candidate?.email,
          country: "",
          state: "",
          city: "",
          street: "",
          pincode: "",
          dob: candidate?.dob,
          maritalStatus: "",
          dateOfMarriage: "",
          gender: "",
          bloodGroup: "",
         domain: candidate?.domain.join(", ") || "",
          experienceType:
            candidate?.isExperienced === true
              ? true
              : candidate?.isExperienced === false
              ? false
              : "",
          internship: "",
          aadharNumber: "",
          panNumber: "",
          joiningDate: "",
          offeredDesignation: "",
          bankName: "",
          accountHolderName: "",
          accountNumber: "",
          confirmAccountNumber: "",
          ifscCode: "",
          branchName: "",
          orientationLocation: "",
          tenthMarksheet: null,
          twelfthMarksheet: null,
          graduationMarksheet: null,
          postGraduation: null,
          aadhar: null,
          pan: null,
          passport: null,
          cancelledCheque: null,
          signedOfferLetter: null,
          passportPhoto: null,
        }}
        validationSchema={validationSchemaFresher}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, validateForm, setTouched, submitForm }) => (
          <Form
            onSubmit={async (e) => {
              e.preventDefault();

              const fieldKeys = Object.keys(validationSchemaFresher.fields);
              setTouched(
                fieldKeys.reduce((acc, key) => {
                  acc[key] = true;
                  return acc;
                }, {}),
                true
              );

              const errors = await validateForm();

              if (Object.keys(errors).length > 0) {
                const firstError = Object.values(errors)[0];
                toast.error(firstError);
                return;
              }

              submitForm();
            }}
            className="space-y-8"
          >
            <PersonalInfoSection setFieldValue={setFieldValue} />
            <EducationSection setFieldValue={setFieldValue} />
            <BankDetailsSection setFieldValue={setFieldValue} />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FresherOnboardingForm;

// import React, { useCallback, useEffect, useState } from "react";
// import { Formik, Form } from "formik";
// import PersonalInfoSection from "./PersonalInfoSection";
// import EducationSection from "./EducationSection";
// import BankDetailsSection from "./BankDetailsSection";
// import { validationSchemaFresher } from "../../utils/validationSchema";
// import { convertImageToBase64, convertPDFToBase64 } from "../../utils/utils";
// import { baseUrl } from "../../api";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import MiniLoading from "../../components/MiniLoading";

// const FresherOnboardingForm = () => {
//   const { candidateId } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [screenLoading, setScreenLoading] = useState(true);
//   const [candidate, setCandidate] = useState(null);
//   const [currentStep, setCurrentStep] = useState(0);

//     const steps = [
//     "Personal Info",
//     "Education",
//     "Bank Details",
//     "Documents Upload",
//   ];

//   const fetchCandidateDetails = useCallback(async () => {
//     try {
//       const { data } = await axios.get(
//         `${baseUrl}/api/candidate_details/${candidateId}`
//       );
//       // console.log("data:", data.data);
//       setCandidate(data.data);
//     } catch (error) {
//       console.error("Candidate Fetch Error:", error);
//       toast.error("Failed to fetch candidate.");
//     } finally {
//       setScreenLoading(false);
//     }
//   }, [candidateId]);

//   useEffect(() => {
//     fetchCandidateDetails();
//   }, [fetchCandidateDetails]);

//   if (screenLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <MiniLoading />
//       </div>
//     );
//   }

//   const handleSubmit = async (values, { setSubmitting }) => {
//     setLoading(true);

//     try {
//       const convertAndSet = async (key, convertFn) => {
//         if (values[key]) {
//           values[key] = await convertFn(values[key]);
//         }
//       };

//       await convertAndSet("tenthMarksheet", convertPDFToBase64);
//       await convertAndSet("twelfthMarksheet", convertPDFToBase64);
//       await convertAndSet("graduationMarksheet", convertPDFToBase64);
//       await convertAndSet("postGraduation", convertPDFToBase64);
//       await convertAndSet("aadhar", convertPDFToBase64);
//       await convertAndSet("pan", convertPDFToBase64);
//       await convertAndSet("passport", convertPDFToBase64);
//       await convertAndSet("signedOfferLetter", convertPDFToBase64);
//       await convertAndSet("cancelledCheque", convertPDFToBase64);
//       await convertAndSet("passportPhoto", convertImageToBase64);

//            // Convert files
//       // const fileFields = [
//       //   "tenthMarksheet",
//       //   "twelfthMarksheet",
//       //   "graduationMarksheet",
//       //   "postGraduation",
//       //   "aadhar",
//       //   "pan",
//       //   "passport",
//       //   "cancelledCheque",
//       //   "signedOfferLetter",
//       //   "passportPhoto",
//       // ];

//       // for (let field of fileFields) {
//       //   const fn = field === "passportPhoto" ? convertImageToBase64 : convertPDFToBase64;
//       //   await convertAndSet(field, fn);
//       // }
//       values.candidateId = candidateId;

//       const response = await axios.post(
//         `${baseUrl}/api/onboarding-form/create`,
//         values
//       );
//       // console.log("res",response.data)
//       toast.success("Form submitted successfully!");
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       toast.error("Failed to submit the form.");
//     } finally {
//       setLoading(false);
//       setSubmitting(false);
//     }
//   };

//     const renderStep = (step, formikProps) => {
//     switch (step) {
//       case 0:
//         return <PersonalInfoSection {...formikProps} />;
//       case 1:
//         return <EducationSection {...formikProps} />;
//       case 2:
//         return <BankDetailsSection {...formikProps} />;
//       case 3:
//         return (
//           <div>
//             <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
//             {/* Add your file input fields here */}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg">
//       <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
//         AndGate Informatics Pvt. Ltd. <br />
//         <span className="text-gray-700 text-xl">Fresher's Onboarding Form</span>
//       </h1>

//       <Formik
//         validateOnChange={true}
//         validateOnBlur={true}
//         // validateOnMount={false}
//         initialValues={{
//           name: candidate?.name,
//           mobile: candidate?.mobile,
//           emergencyContactPerson: "",
//           emergencyContact: "",
//           email: candidate?.email,
//           country: "",
//           state: "",
//           city: "",
//           street: "",
//           pincode: "",
//           dob: candidate?.dob,
//           maritalStatus: "",
//           dateOfMarriage: "",
//           gender: "",
//           bloodGroup: "",
//          domain: candidate?.domain.join(", ") || "",
//           experienceType:
//             candidate?.isExperienced === true
//               ? true
//               : candidate?.isExperienced === false
//               ? false
//               : "",
//           internship: "",
//           aadharNumber: "",
//           panNumber: "",
//           joiningDate: "",
//           offeredDesignation: "",
//           bankName: "",
//           accountHolderName: "",
//           accountNumber: "",
//           confirmAccountNumber: "",
//           ifscCode: "",
//           branchName: "",
//           orientationLocation: "",
//           tenthMarksheet: null,
//           twelfthMarksheet: null,
//           graduationMarksheet: null,
//           postGraduation: null,
//           aadhar: null,
//           pan: null,
//           passport: null,
//           cancelledCheque: null,
//           signedOfferLetter: null,
//           passportPhoto: null,
//         }}
//         validationSchema={validationSchemaFresher}
//         onSubmit={handleSubmit}
//       >
//         {({ setFieldValue, validateForm, setTouched, submitForm }) => (
//           <Form
//             onSubmit={async (e) => {
//               e.preventDefault();

//               const fieldKeys = Object.keys(validationSchemaFresher.fields);
//               setTouched(
//                 fieldKeys.reduce((acc, key) => {
//                   acc[key] = true;
//                   return acc;
//                 }, {}),
//                 true
//               );

//               const errors = await validateForm();

//               if (Object.keys(errors).length > 0) {
//                 const firstError = Object.values(errors)[0];
//                 toast.error(firstError);
//                 return;
//               }

//               submitForm();
//             }}
//             className="space-y-8"
//           >
//             <PersonalInfoSection setFieldValue={setFieldValue} />
//             <EducationSection setFieldValue={setFieldValue} />
//             <BankDetailsSection setFieldValue={setFieldValue} />

//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`${
//                   loading
//                     ? "bg-blue-400 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 } text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2`}
//               >
//                 {loading ? (
//                   <>
//                     <svg
//                       className="animate-spin h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                       ></path>
//                     </svg>
//                     Submitting...
//                   </>
//                 ) : (
//                   "Submit"
//                 )}
//               </button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default FresherOnboardingForm;
