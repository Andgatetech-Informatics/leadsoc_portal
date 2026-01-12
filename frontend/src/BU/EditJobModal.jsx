import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../api";
import Select from "react-select";

const accessOptions = [
  { value: "ta", label: "TA" },
  { value: "vendor", label: "Vendor" },
  { value: "all", label: "All" },
];

const EditJobModal = ({
  isOpen,
  onClose,
  job,
  token,
  onUpdated,
  fetchJobs,
}) => {
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [modifiedBudgetMin, setModifiedBudgetMin] = useState(job || {});
  const [modifiedBudgetMax, setModifiedBudgetMax] = useState(job || {});
  const [visibility, setVisibility] = useState("");

  useEffect(() => {
    if (job) {
      setTitle(job.title || "");
      setOrganization(job.organization || "");
      setModifiedBudgetMin(job.budgetMin || "");
      setModifiedBudgetMax(job.budgetMax || "");
      setVisibility(job.visibility || []);
    }
  }, [job]);

  const updateJob = async () => {
    try {
      const payload = {
        modifiedBudgetMin,
        modifiedBudgetMax,
        visibility,
      };

      const { data } = await axios.patch(
        `${baseUrl}/api/update/${job._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdated(data);
      fetchJobs();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold">Edit Job Details</h2>

        {/* Show Job ID */}
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-semibold">Job ID:</span> {job?.jobId}
        </p>

        {/* Title */}
        <input
          disabled={true}
          className="border p-2 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Job Title"
        />

        {/* Client */}
        <input
          disabled={true}
          className="border p-2 w-full rounded"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder="Organization Name"
        />

        {/* Salary */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={modifiedBudgetMin}
            onChange={(e) => setModifiedBudgetMin(e.target.value)}
            placeholder="Modify Budget Min"
          />
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={modifiedBudgetMax}
            onChange={(e) => setModifiedBudgetMax(e.target.value)}
            placeholder="Modify Budget Max"
          />
        </div>

        {/* Checkbox Access */}
        <div className="border-t pt-3">
          <p className="font-medium text-sm mb-2">Visiblity</p>

          <Select
            options={accessOptions}
            value={
              accessOptions.find((opt) => opt.value === visibility) || null
            }
            onChange={(selected) => setVisibility(selected?.value || "")}
            className="text-sm"
            classNamePrefix="select"
            placeholder="Select Visiblity"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
            onClick={updateJob}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditJobModal;
