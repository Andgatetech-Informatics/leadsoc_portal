import React, { useEffect, useState } from "react";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal";
import { baseUrl } from "../api";

/* -------------------- CONSTANTS -------------------- */
const SKILL_OPTIONS = [
  "Python", "React", "Node.js", "MongoDB", "Express", "DFT", "PD", "DV", "PDK", "RLT",
  "Analog Mixed Signaling", "Analog Layout Design", "Design Engineer",
  "Synthesis", "Physical Verification", "Embedded", "FPGA", "STA", "Software"
].map(s => ({ label: s, value: s }));

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
  referralAmount: "",
  visibility: "",
};

const isValidNumber = (value) =>
  value !== "" && value !== null && !isNaN(value);


const CreatePostJob = () => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  /* -------------------- FETCH COMPANIES -------------------- */
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/getAllOrganizations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCompanyList(data?.data || []);
      } catch {
        toast.error("Failed to fetch companies");
      }
    };
    fetchCompanies();
  }, [token]);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSkillsChange = (values) => {
    setFormData(prev => ({
      ...prev,
      skills: values ? values.map(v => v.label) : [],
    }));
  };

  /* -------------------- VALIDATION -------------------- */
  const validate = () => {
    const e = {};
    const {
      title,
      location,
      organizationName,
      priority,
      experienceMin,
      experienceMax,
      noOfPositions,
      description,
      postDate,
      endDate,
      referralAmount,
      visibility,
    } = formData;

    if (!title) e.title = "Job title is required";
    if (!location) e.location = "Location is required";
    if (!organizationName) e.organizationName = "Company is required";
    if (!priority) e.priority = "Priority is required";
    if (!visibility) e.visibility = "Visibility is required";

    if (!isValidNumber(experienceMin))
      e.experienceMin = "Experience Min must be a number";
    else if (+experienceMin <= 0)
      e.experienceMin = "Experience Min must be greater than 0";

    if (!isValidNumber(experienceMax))
      e.experienceMax = "Experience Max must be a number";
    else if (+experienceMax <= 0)
      e.experienceMax = "Experience Max must be greater than 0";
    else if (+experienceMax < +experienceMin)
      e.experienceRange = "Max experience must be greater than Min experience";

    if (!isValidNumber(noOfPositions))
      e.noOfPositions = "No of Positions must be a number";
    else if (+noOfPositions <= 0)
      e.noOfPositions = "No of Positions must be greater than 0";

    if (referralAmount && !isValidNumber(referralAmount))
      e.referralAmount = "Referral Amount must be a number";

    if (!description) e.description = "Job description is required";
    if (!postDate) e.postDate = "Post date is required";
    if (!endDate) e.endDate = "End date is required";

    if (postDate && endDate && new Date(postDate) > new Date(endDate))
      e.dateRange = "End date must be later than post date";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitJob = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const response = await axios.post(
        `${baseUrl}/api/jobpost`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        toast.success("Job posted successfully");
        setFormData(INITIAL_STATE);
      }
    } catch (error) {
      console.error("Job post error:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to post job";

      toast.error(message);
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };


  /* -------------------- UI -------------------- */
  return (
    <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-12 xl:px-12 2xl:px-12 py-2">
      <h2 className="text-xl font-semibold mb-6">Post New Requirement</h2>

      <form className="space-y-6">
        <Grid>
          <Input label="Job Title" name="title" value={formData.title} onChange={handleChange} error={errors.title} />
          <Input label="Location" name="location" value={formData.location} onChange={handleChange} error={errors.location} />
          <Select label="Priority" name="priority" value={formData.priority} onChange={handleChange} options={["Low", "Medium", "High"]} error={errors.priority} />
        </Grid>

        <Grid>
          <Select label="Company" name="organizationName" value={formData.organizationName} onChange={handleChange}
            options={companyList.map(c => c.organization)} error={errors.organizationName} />
          <Input label="Client Name" name="clientName" value={formData.clientName} onChange={handleChange} />
          <div>
            <label className="text-sm font-medium">Skills</label>
            <CreatableSelect
              isMulti
              options={SKILL_OPTIONS}
              value={formData.skills.map(s => ({ label: s, value: s }))}
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
            min="0"
            step="1"
            onChange={handleChange}
            error={errors.experienceMin}
          />

          <Input
            type="number"
            label="Experience Max"
            name="experienceMax"
            value={formData.experienceMax}
            min="0"
            step="1"
            onChange={handleChange}
            error={errors.experienceMax || errors.experienceRange}
          />

          <Input
            type="number"
            label="No of Positions"
            name="noOfPositions"
            value={formData.noOfPositions}
            min="0"
            step="1"
            onChange={handleChange}
            error={errors.noOfPositions}
          />
        </Grid>


        <Textarea label="Job Description" name="description" value={formData.description} onChange={handleChange} error={errors.description} />

        <Grid>
          <Input type="date" label="Post Date" name="postDate" value={formData.postDate} onChange={handleChange} error={errors.postDate} />
          <Input type="date" label="End Date" name="endDate" value={formData.endDate} onChange={handleChange} error={errors.endDate || errors.dateRange} />
          <Input type="number" label="Referral Amount" name="referralAmount" value={formData.referralAmount} onChange={handleChange} error={errors.referralAmount} />
        </Grid>

        <Select label="Visibility" name="visibility" value={formData.visibility} onChange={handleChange} options={["Public", "BU"]} error={errors.visibility} />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
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

const Input = ({ label, error, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      {...props}
      className={`w-full mt-1 p-2 border rounded focus:ring-2 ${error ? "border-red-400 focus:ring-red-400" : "focus:ring-blue-500"
        }`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const Textarea = ({ label, error, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <textarea
      {...props}
      rows="3"
      className={`w-full mt-1 p-2 border rounded focus:ring-2 ${error ? "border-red-400 focus:ring-red-400" : "focus:ring-blue-500"
        }`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const Select = ({ label, options, error, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select
      {...props}
      className={`w-full mt-1 p-2 border rounded focus:ring-2 ${error ? "border-red-400 focus:ring-red-400" : "focus:ring-blue-500"
        }`}
    >
      <option value="">Select</option>
      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default CreatePostJob;
