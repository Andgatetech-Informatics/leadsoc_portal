import React from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { toDatetimeLocalValue } from "../utils/utils";

export default function EventModal({
    title,
    isOpen,
    onClose,
    onSubmit,
    eventOptions,
    interviewers,
    companies,
    btnLoading,
    formData,
    setFormData,
    handleChange,
}) {
    if (!isOpen) return null;

    const meetingRequiredEvents = [
        "Technical 1",
        "Technical 2",
        "Technical 3",
        "Client 1",
        "Client 2",
        "Client 3",
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <h3 className="text-xl font-semibold mb-4 text-center">
                    {title} Interview Event
                </h3>

                <form onSubmit={(e) => onSubmit(e, formData._id)} className="space-y-4">
                    {/* Event Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Name
                        </label>
                        <CreatableSelect
                            options={eventOptions}
                            value={
                                formData.eventName
                                    ? { label: formData.eventName, value: formData.eventName }
                                    : null
                            }
                            onChange={(selected) =>
                                setFormData({ ...formData, eventName: selected?.value || "" })
                            }
                            isClearable
                            placeholder="Select or type event name..."
                        />
                    </div>

                    {/* Interviewer */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Interviewer
                        </label>
                        <Select
                            options={interviewers}
                            getOptionLabel={(e) => `${e.label}`}
                            getOptionValue={(e) => e.interviewerId}   // optional but recommended
                            onChange={(selected) =>
                                setFormData({
                                    ...formData,
                                    interviewer: {
                                        interviewerId: selected.interviewerId,
                                        name: selected.label,
                                        email: selected.value,
                                    },
                                })
                            }
                            value={interviewers.find(
                                (i) => i.interviewerId === formData?.interviewer?.interviewerId
                            ) || null}
                            placeholder="Search by name..."
                        />

                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                        </label>
                        <Select
                            options={companies.map((company) => ({
                                value: company._id,
                                label: company.organization,
                            }))}

                            onChange={(selected) =>
                                setFormData({
                                    ...formData,
                                    organization: {
                                        name: selected.label,
                                        companyId: selected.value,
                                    },
                                })
                            }

                            value={
                                formData?.organization?.companyId
                                    ? companies
                                        .map((company) => ({
                                            value: company._id,
                                            label: company.organization,
                                        }))
                                        .find((c) => c.value === formData.organization.companyId)
                                    : null
                            }

                            placeholder="Search by company name..."
                        />
                    </div>

                    {/* Event Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Date
                        </label>
                        <input
                            type="datetime-local"
                            name="interviewDate"
                            value={formData.interviewDate ? toDatetimeLocalValue(formData.interviewDate).slice(0, 16) : ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    </div>

                    {/* Interviewer Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Interviewer Email
                        </label>
                        <input
                            type="email"
                            readOnly
                            className="w-full border bg-gray-100 border-gray-300 rounded px-3 py-2 text-sm"
                            value={formData.interviewer?.email || ""}
                        />
                    </div>

                    {/* Meeting Link Dynamic Field */}
                    {meetingRequiredEvents.includes(formData.eventName) && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meeting Link
                            </label>
                            <input
                                type="text"
                                name="meetingLink"
                                value={formData.meetingLink}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        {btnLoading ? (
                            <button
                                type="button"
                                disabled
                                className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 cursor-not-allowed"
                            >
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
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Submit
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
