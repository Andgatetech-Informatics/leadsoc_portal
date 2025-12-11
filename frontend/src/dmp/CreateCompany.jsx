import axios from "axios";
import React, { useState } from "react";
import { baseUrl } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCompany = () => {
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [logo, setLogo] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [token] = useState(localStorage.getItem("token"));

  const [errors, setErrors] = useState({
    organization: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};
    if (!organization)
      formErrors.organization = "Organization name is required";
    if (!email) formErrors.email = "Email is required";
    if (!phone) formErrors.phone = "Phone number is required";
    if (!address) formErrors.address = "Address is required";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);

    const formData = {
      organization,
      email,
      phone,
      address,
      industry,
      logo,
    };

    try {
      const response = await axios.post(
        `${baseUrl}/api/create_company`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if ([200, 201].includes(response.status)) {
        toast.success("Company created successfully!");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Error creating company");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = (e) => {
    handleSubmit(e);
    setShowConfirmation(false);
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  const handleInputChange = (e, field) => {
    // Update the field value
    const value = e.target.value;
    switch (field) {
      case "organization":
        setOrganization(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "address":
        setAddress(value);
        break;
      default:
        break;
    }

    if (value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    }
  };

  return (
    <div className="mt-10 px-20 py-6">
      <form onSubmit={handleConfirmation} className="space-y-6">
        <h2 className="text-2xl font-semibold text-start text-gray-800">
          Create a New Company
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Organization Name */}
          <div className="flex flex-col">
            <label
              htmlFor="organization"
              className="text-sm font-medium text-gray-700"
            >
              Organization Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={organization}
              onChange={(e) => handleInputChange(e, "organization")}
              required
              className={`mt-1 p-3 border ${
                errors.organization ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-2 focus:ring-blue-500`}
            />
            {errors.organization && (
              <span className="text-sm text-red-500">
                {errors.organization}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => handleInputChange(e, "email")}
              required
              className={`mt-1 p-3 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Phone */}
          <div className="flex flex-col">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => handleInputChange(e, "phone")}
              required
              pattern="^[0-9]{10,15}$"
              className={`mt-1 p-3 border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-2 focus:ring-blue-500`}
            />
            {errors.phone && (
              <span className="text-sm text-red-500">{errors.phone}</span>
            )}
          </div>

          {/* Website */}
          <div className="flex flex-col">
            <label
              htmlFor="website"
              className="text-sm font-medium text-gray-700"
            >
              Website URL
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col">
          <label
            htmlFor="address"
            className="text-sm font-medium text-gray-700"
          >
            Company Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            value={address}
            onChange={(e) => handleInputChange(e, "address")}
            required
            rows="3"
            className={`mt-1 p-3 border ${
              errors.address ? "border-red-500" : "border-gray-300"
            } rounded-md focus:ring-2 focus:ring-blue-500`}
          ></textarea>
          {errors.address && (
            <span className="text-sm text-red-500">{errors.address}</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Industry */}
          <div className="flex flex-col">
            <label
              htmlFor="industry"
              className="text-sm font-medium text-gray-700"
            >
              Industry
            </label>
            <select
              id="industry"
              name="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Industry</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="SemiConductor">SemiConductor</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Logo Upload */}
          <div className="flex flex-col">
            <label htmlFor="logo" className="text-sm font-medium text-gray-700">
              Upload Logo
            </label>
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
              className="mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {logo && (
              <div className="mt-3 flex justify-center">
                <img
                  src={URL.createObjectURL(logo)}
                  alt="Company Logo"
                  className="w-24 h-24 object-cover rounded-md shadow-md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Is Active Checkbox */}
        <div className="flex justify-end space-x-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Is the company active?
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            onClick={handleConfirmation}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Company"}
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800">
              Are you sure?
            </h3>
            <p className="mt-2 text-gray-600">
              Please confirm to create the company.
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={handleCancelSubmit}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCompany;
