import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../../api";

const CandidateRegistration = () => {
    const [submitted, setSubmitted] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const initialFormState = {
        email: "",
        name: "",
        mobile: "",
        dob: "",
        degree: "",
        graduationYear: "",
        skills: "",
        currentLocation: "",
        preferredLocation: "",
        availability: "",
        resume: "",
        isDummy: true,
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "resume" && files?.length > 0) {
            handleFileUpload(files[0]);
            setErrors((prev) => ({ ...prev, [name]: "" }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for the field when user types
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleFileUpload = async (file) => {
        const formDataToSend = new FormData();
        formDataToSend.append("file", file);

        try {
            const { data } = await axios.post(`${baseUrl}/api/upload_resume`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const uploadedPath = data?.file?.filePath;
            if (uploadedPath) {
                setFormData((prev) => ({ ...prev, resume: uploadedPath }));
            } else {
                setErrors((prev) => ({ ...prev, resume: "File upload failed" }));
            }
        } catch (error) {
            console.error("Upload error:", error.response?.data || error.message);
            setErrors((prev) => ({ ...prev, resume: "Failed to upload resume" }));
        }
    };

    const validateForm = () => {
        let newErrors = {};
        for (const [key, value] of Object.entries(formData)) {
            if (!value && key !== "isDummy") {
                newErrors[key] = `${formatLabel(key)} is required`;
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatLabel = (key) =>
        key
            .replace(/([A-Z])/g, " $1") // split camelCase
            .replace(/^./, (str) => str.toUpperCase()); // capitalize

    const fresherCandidateSubmit = async () => {
        if (!validateForm()) return;

        setSubmitLoading(true);

        try {
            const { data } = await axios.post(
                `${baseUrl}/api/dummy_registration`,
                formData
            );

            if (data?.status) {
                setSubmitted(true);
                toast.success("Registration successful!");
            } else {
                toast.error(data?.message || "Something went wrong.");
            }
        } catch (error) {
            const errorMessage =
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Failed to register fresher candidate.";
            toast.error(errorMessage);
            console.error("Submit Error:", errorMessage);
        } finally {
            setSubmitLoading(false);
        }
    };

    const fields = [
        { name: "email", label: "Email", type: "email" },
        { name: "name", label: "Full Name", type: "text" },
        { name: "mobile", label: "Mobile Number", type: "tel" },
        { name: "dob", label: "Date of Birth", type: "date" },
        { name: "graduationYear", label: "Graduation Year", type: "month" },
        {
            name: "degree",
            label: "Degree",
            type: "select",
            options: ["B.Tech", "M.Tech", "Other"],
        },
        { name: "skills", label: "Technical Skills, Tools, Strengths", type: "text" },
        { name: "currentLocation", label: "Current Location", type: "text" },
        { name: "preferredLocation", label: "Preferred Location", type: "text" },
        { name: "availability", label: "Availability / Notice Period", type: "text" },
        { name: "resume", label: "Upload Resume", type: "file" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
            <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-8 space-y-10">
                <h2 className="text-3xl font-bold text-gray-800 text-center">
                    Registration Form
                </h2>

                {submitted ? (
                    <div className="text-center text-green-700 text-lg font-semibold py-20 space-y-4">
                        <div>🎉 Your form has been successfully submitted!</div>
                        <div>
                            Thank you for registering with{" "}
                            <strong>AndGate Informatics Pvt Ltd.</strong>
                        </div>
                        <p className="text-base text-gray-700 font-normal">
                            Our HR team will review your details shortly. If your profile matches our
                            requirements, you will hear from us via email or phone.
                        </p>
                        <p className="text-base text-gray-700 font-normal">
                            In the meantime, feel free to explore our website or connect with us on
                            LinkedIn for the latest updates and opportunities.
                        </p>
                        <div className="text-sm text-gray-500 italic">
                            We appreciate your interest and wish you the very best in your career
                            journey!
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {fields.map(({ name, label, type, options }) => (
                                <div
                                    key={name}
                                    className={`flex flex-col ${type === "file" ? "md:col-span-2" : ""}`} // Full row if file
                                >
                                    <label className="font-medium text-gray-700 mb-1">
                                        {label} <span className="text-red-500">*</span>
                                    </label>

                                    {type === "select" ? (
                                        <select
                                            name={name}
                                            value={formData[name]}
                                            onChange={handleChange}
                                            className={`border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${errors[name]
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-green-500"
                                                }`}
                                        >
                                            <option value="">Select</option>
                                            {options.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                    ) : type === "file" ? (
                                        <input
                                            type="file"
                                            name={name}
                                            onChange={handleChange}
                                            className={`w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition ${errors[name]
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-green-500"
                                                }`}
                                        />
                                    ) : (
                                        <input
                                            type={type}
                                            name={name}
                                            value={formData[name]}
                                            onChange={handleChange}
                                            className={`border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${errors[name]
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-green-500"
                                                }`}
                                        />
                                    )}

                                    {errors[name] && (
                                        <span className="text-red-500 text-xs mt-1">{errors[name]}</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t flex justify-center">
                            <button
                                type="button"
                                disabled={submitLoading}
                                onClick={fresherCandidateSubmit}
                                className={`px-8 py-3 rounded-lg font-semibold text-sm tracking-wide shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${submitLoading
                                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700"
                                    }`}
                            >
                                {submitLoading ? (
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
                                    "Submit Application"
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>

    );
};

export default CandidateRegistration;
