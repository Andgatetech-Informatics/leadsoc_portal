import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal";
import { baseUrl } from "../api";

/* -------------------- CONSTANTS -------------------- */
const SKILL_OPTIONS = [
  "Python",
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "DFT",
  "PD",
  "DV",
  "PDK",
  "RLT",
  "Analog Mixed Signaling",
  "Analog Layout Design",
  "Design Engineer",
  "Synthesis",
  "Physical Verification",
  "Embedded",
  "FPGA",
  "STA",
  "Software",
].map((s) => ({ label: s, value: s }));

const INITIAL_STATE = {
  title: "",
  location: "",
  organizationName: "",
  clientName: "",
  skills: [],
  priority: "",
  experienceMin: "",
  experienceMax: "",
  noOfPositions: "",
  description: "",
  postDate: "",
  endDate: "",
  workType: "",
  jobType: "",
  budgetMin: "",
  budgetMax: "",
};

/* -------------------- HELPERS -------------------- */
const isPositiveNumber = (v) => v !== "" && !isNaN(v) && Number(v) > 0;

const JobPostingForm = ({ organization, fetchJobs }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  /* -------------------- INIT ORG -------------------- */
  useEffect(() => {
    if (!organization) return;

    setFormData((prev) => ({
      ...prev,
      organizationName: organization.organization || "",
    }));
  }, [organization]);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = useCallback(({ target }) => {
    const { name, value } = target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  const handleSkillsChange = (values) => {
    setFormData((prev) => ({
      ...prev,
      skills: values?.map((v) => v.value) || [],
    }));
  };

  /* -------------------- VALIDATION -------------------- */
  const validate = () => {
    const e = {};
    const d = formData;

    if (!d.title) e.title = "Job title is required";
    if (!d.location) e.location = "Location is required";
    if (!d.organizationName) e.organizationName = "Organization is required";
    if (!d.priority) e.priority = "Priority is required";

    if (!d.description) e.description = "Description is required";
    if (!d.workType) e.workType = "Work type is required";
    if (!d.jobType) e.jobType = "Job type is required";

    if (!isPositiveNumber(d.experienceMin))
      e.experienceMin = "Min experience must be greater than 0";

    if (!isPositiveNumber(d.experienceMax))
      e.experienceMax = "Max experience must be greater than 0";

    if (
      isPositiveNumber(d.experienceMin) &&
      isPositiveNumber(d.experienceMax) &&
      Number(d.experienceMax) < Number(d.experienceMin)
    ) {
      e.experienceRange = "Max experience must be greater than Min";
    }

    if (!isPositiveNumber(d.noOfPositions))
      e.noOfPositions = "Positions must be greater than 0";

    if (!isPositiveNumber(d.budgetMin))
      e.budgetMin = "budget Min must be greater than 0";

    if (!isPositiveNumber(d.budgetMax))
      e.budgetMax = "budget Max must be greater than 0";

    if (!d.postDate) e.postDate = "Post date required";
    if (!d.endDate) e.endDate = "End date required";

    if (d.postDate && d.endDate && new Date(d.postDate) > new Date(d.endDate))
      e.dateRange = "End date must be after post date";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* -------------------- SUBMIT -------------------- */
  const submitJob = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await axios.post(`${baseUrl}/api/jobpost`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Job posted successfully");
      setFormData(INITIAL_STATE);
      fetchJobs?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <h2 className="text-xl font-semibold mb-6">Post New Requirement</h2>

      <form className="space-y-6">
        <Grid>
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            required
          />
          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={["Low", "Medium", "High"]}
            error={errors.priority}
            required
          />
        </Grid>

        <Grid>
          <Input
            label="Organization"
            value={formData.organizationName}
            disabled
          />
          <Input
            label="Client Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
          />
          <div>
            <label className="text-sm font-medium">Skills</label>
            <CreatableSelect
              isMulti
              options={SKILL_OPTIONS}
              value={formData.skills.map((s) => ({ label: s, value: s }))}
              onChange={handleSkillsChange}
            />
          </div>
        </Grid>

        <Grid>
          <Input
            type="number"
            label="Experience Min"
            name="experienceMin"
            value={formData.experienceMin}
            onChange={handleChange}
            error={errors.experienceMin}
            required
          />
          <Input
            type="number"
            label="Experience Max"
            name="experienceMax"
            value={formData.experienceMax}
            onChange={handleChange}
            error={errors.experienceMax || errors.experienceRange}
            required
          />
          <Select
            label="Work Type"
            name="workType"
            value={formData.workType}
            onChange={handleChange}
            options={["Hybrid", "Remote", "Onsite"]}
            error={errors.workType}
            required
          />
        </Grid>

        <Grid>
        
          <Select
            label="Type"
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            options={["Full Time", "Contract"]}
            error={errors.jobType}
            required
          />
           <Input
            type="number"
            label="Budget Min (LPA)"
            name="budgetMin"
            value={formData.budgetMin}
            onChange={handleChange}
            error={errors.budgetMin}
            required
          />
          <Input
            type="number"
            label="Budget Max (LPA)"
            name="budgetMax"
            value={formData.budgetMax}
            onChange={handleChange}
            error={errors.budgetMax || errors.budgetRange}
            required
          />
        </Grid>

        <Grid>
            <Input
            type="number"
            label="Positions"
            name="noOfPositions"
            value={formData.noOfPositions}
            onChange={handleChange}
            error={errors.noOfPositions}
            required
          />
           <Input
            type="date"
            label="Post Date"
            name="postDate"
            value={formData.postDate}
            onChange={handleChange}
            error={errors.postDate}
            required
          />
          <Input
            type="date"
            label="End Date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            error={errors.endDate || errors.dateRange}
            required
          />
        </Grid>

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          required
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {confirmOpen && (
        <ConfirmationModal
          onConfirm={submitJob}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
};

/* -------------------- UI HELPERS -------------------- */
const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
);

const Input = ({ label, error,required, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label} {required && <span className="text-red-500">*</span>}</label>
    <input
      {...props}
      className={`w-full mt-1 p-2 border rounded focus:ring-2 ${
        error ? "border-red-400 focus:ring-red-400" : "focus:ring-blue-500"
      }`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const Textarea = ({ label, error,required, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label} {required && <span className="text-red-500">*</span>}</label>
    <textarea
      {...props}
      rows={3}
      className={`w-full mt-1 p-2 border rounded focus:ring-2 ${
        error ? "border-red-400 focus:ring-red-400" : "focus:ring-blue-500"
      }`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const Select = ({ label, options,required, error, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label} {required && <span className="text-red-500">*</span>}</label>
    <select
      {...props}
      className={`w-full mt-1 p-2 border rounded focus:ring-2 ${
        error ? "border-red-400 focus:ring-red-400" : "focus:ring-blue-500"
      }`}
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default JobPostingForm;
