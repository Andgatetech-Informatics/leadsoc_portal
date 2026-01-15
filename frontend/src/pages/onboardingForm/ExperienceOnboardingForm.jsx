import React, { useCallback, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { validationSchemaExperience } from "../../utils/validationSchema";
import PersonalInfoSection from "./PersonalInfoSection";
import EducationSection from "./EducationSection";
import CompanyDetailsSection from "./CompanyDetailsSection";
import BankDetailsSection from "./BankDetailsSection";
import {
  convertImageToBase64,
  convertMultipleFilesToBase64,
  convertPDFToBase64,
} from "../../utils/utils";
import { baseUrl } from "../../api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import MiniLoading from "../../components/MiniLoading";
import axios from "axios";

const ExperienceOnboardingForm = () => {
  const { candidateId } = useParams();
  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(true);
  const [candidate, setCandidate] = useState(null);

  const fetchCandidateDetails = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/candidate_details/${candidateId}`
      );
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
      await convertAndSet("lastCompanyOfferLetter", convertPDFToBase64);
      await convertAndSet("lastCompanyExperienceLetter", convertPDFToBase64);
      await convertAndSet("lastCompanyRelievingLetter", convertPDFToBase64);
      await convertAndSet("aadhar", convertPDFToBase64);
      await convertAndSet("pan", convertPDFToBase64);
      await convertAndSet("passport", convertPDFToBase64);
      await convertAndSet("signedOfferLetter", convertPDFToBase64);
      await convertAndSet("cancelledCheque", convertPDFToBase64);
      await convertAndSet("passportPhoto", convertImageToBase64);

      values.lastCompanySalarySlips = await convertMultipleFilesToBase64(
        values.lastCompanySalarySlips
      );

      values.candidateId = candidateId;

      const response = await axios.post(
        `${baseUrl}/api/onboarding-form/create`,
        values
      );
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
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        AndGate Informatics Pvt. Ltd. <br />
        <span className="text-gray-700 text-xl">
          Experienced Onboarding Form
        </span>
      </h1>

      <Formik
        validateOnChange={true}
        validateOnBlur={true}
        initialValues={{
          name: candidate?.name || "",
          mobile: candidate?.mobile || "",
          email: candidate?.email || "",
          emergencyContactPerson: "",
          emergencyContact: "",
          country: "",
          city: "",
          state: "",
          street: "",
          pincode: "",
          dob: candidate?.dob || "",
          maritalStatus: "",
          dateOfMarriage: "",
          gender: "",
          bloodGroup: "",
          domain: candidate?.domain?.join(", ") || "",
          experienceType:
            candidate?.isExperienced === true
              ? true
              : candidate?.isExperienced === false
              ? false
              : "",
          totalExperience: candidate?.experienceYears || "",
          relevantExperience: candidate?.releventExp || "",
          aadharNumber: "",
          panNumber: "",
          lastCompanyName: "",
          lastCompanyStreet: "",
          lastCompanyCity: "",
          lastCompanyPincode: "",
          lastCompanyState: "",
          lastDesignation: "",
          lastCompanyHrContact: "",
          lastCompanyHrEmail: "",
          immediateManagerContact: "",
          immediateManagerEmail: "",
          lastWorkingDay: "",
          joiningDate: "",
          bankName: "",
          accountHolderName: "",
          accountNumber: "",
          confirmAccountNumber: "",
          ifscCode: "",
          branchName: "",
          offeredDesignation: "",
          pfNumber: "",
          orientationLocation: "",
          tenthMarksheet: null,
          twelfthMarksheet: null,
          graduationMarksheet: null,
          postGraduation: null,
          lastCompanyOfferLetter: null,
          lastCompanyExperienceLetter: null,
          lastCompanyRelievingLetter: null,
          lastCompanySalarySlips: [],
          cancelledCheque: null,
          aadhar: null,
          pan: null,
          passport: null,
          signedOfferLetter: null,
          passportPhoto: null,
        }}
        validationSchema={validationSchemaExperience}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, validateForm, setTouched, submitForm }) => (
          <Form
            onSubmit={async (e) => {
              e.preventDefault();

              const fieldKeys = Object.keys(validationSchemaExperience.fields);
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
            <CompanyDetailsSection setFieldValue={setFieldValue} />
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

export default ExperienceOnboardingForm;
