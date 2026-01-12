import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import MiniLoading from "../../components/MiniLoading";
import { baseUrl, frontendUrl } from "../../api";
import Pagination from "../../components/Pagination";
import { useSelector } from "react-redux";

const initialUserState = {
  firstName: "",
  lastName: "",
  companyEmail: "",
  email: "",
  password: "",
  role: "",
  reportingTo: "",
};

const roleOptions = [
  { key: "ta", label: "TA" },
  { key: "hr", label: "HR" },
  { key: "admin", label: "Admin" },
  { key: "bu", label: "Business Unit" },
  { key: "sales", label: "Sales" },
  { key: "vendor", label: "Vendor" },
  { key: "user", label: "User" },
];

const tabOptions = [
  { key: "admin", label: "Admins" },
  { key: "hr", label: "HR" },
  { key: "ta", label: "TA" },
  { key: "bu", label: "Business Unit" },
  { key: "sales", label: "Sales" },
  { key: "user", label: "Users" },
  { key: "vendor", label: "Vendor" },
];

const getToken = () => localStorage.getItem("token");

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("admin");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newUser, setNewUser] = useState(initialUserState);
  const [reportingManagers, setReportingManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [errors, setErrors] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const user = useSelector((state) => state.user.userData);

  const fetchUsers = useCallback(async () => {
    setUsers([]); // clear previous data
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/api/auth/get_every_user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        params: { userType: tab, page, limit: 6, search: searchTerm },
      });

      setUsers(data?.users ?? []);
      setTotalPages(data?.pagination?.totalPages ?? 1);
    } catch (error) {
      setUsers([]); // clear previous data on failure
      console.error("Fetch users error:", error?.response || error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, tab, page, searchTerm]); // ✅ memoized with dependencies

  const fetchManagers = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/auth/get_every_user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        params: { userType: "hr" },
      });

      setReportingManagers(
        (data?.users ?? []).map((mgr) => ({
          value: mgr._id,
          label: `${mgr.firstName} ${mgr.lastName}`,
        }))
      );
    } catch (error) {
      setReportingManagers([]); // clear stale managers on error
      console.error("Fetch managers error:", error?.response || error);
    }
  }, [baseUrl]); // ✅ memoized, runs only when baseUrl changes

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshKey]); // ✅ safe dependency

  useEffect(() => {
    fetchManagers(); // ✅ runs once unless baseUrl changes
  }, [fetchManagers]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter(
      ({ firstName, lastName, email, role }) =>
        `${firstName} ${lastName}`.toLowerCase().includes(term) ||
        email.toLowerCase().includes(term) ||
        role.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const validateForm = () => {
    const required = [
      "firstName",
      "lastName",
      "email",
      "password",
      "role",
      "reportingTo",
    ];
    const newErrors = {};

    required.forEach((field) => {
      if (!newUser[field])
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required.`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setNewUser((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const closeModal = () => {
    setShowModal(false);
    setShowConfirm(false);
    setNewUser(initialUserState);
    setSelectedManager(null);
    setErrors({});
  };

  const handleSaveUser = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    setBtnLoading(true);
    setShowConfirm(false);

    try {
      const { data, status } = await axios.post(
        `${baseUrl}/api/auth/register`,
        newUser,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (status === 201 || data?.success) {
        toast.success("User added successfully.");
        setRefreshKey((prev) => prev + 1);
        closeModal();
      } else {
        throw new Error(data?.message || "Failed to create user.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "User registration failed.");
      console.error("Save user error:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  const formFields = useMemo(
    () => [
      { key: "firstName", label: "First Name", placeholder: "First Name" },
      { key: "lastName", label: "Last Name", placeholder: "Last Name" },
      {
        key: "email",
        label: "Email",
        type: "email",
        placeholder: "Recipient Email",
      },
      {
        key: "companyEmail",
        label: "Company Email",
        type: "email",
        placeholder: "Work Email",
      },
      {
        key: "password",
        label: "Password",
        type: "password",
        placeholder: "Set Password",
      },
    ],
    []
  );

  const handleNewCandidate = () => {
    // Clear JWT
    localStorage.removeItem("token");
    window.location.href = `${frontendUrl}/candidate-registration`;
  };

  return (
    <div className="h-full bg-[#f9f9fb] w-full">
      <div className=" mx-auto bg-white p-6 ">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <p className="text-sm mt-2 text-gray-500">
              Add, manage and control user roles
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
            <input
              type="text"
              placeholder="Search users..."
              className="h-10 px-3 rounded-md border w-full sm:w-64 text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Conditionally render the buttons based on user role */}
            {user?.role === "admin" && (
              <button
                onClick={() => setShowModal(true)}
                className="h-10 px-4 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                + Add User
              </button>
            )}
            {user?.role === "hr" && (
              <>
                <button
                  onClick={() => setShowModal(true)}
                  className="h-10 px-4 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  + Add User
                </button>

                <button
                  onClick={handleNewCandidate}
                  className="h-10 px-4 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  + New Candidates
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation */}

        <div className="flex border-b space-x-4 mb-6 overflow-x-auto">
          {tabOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`pb-2 px-4 font-medium whitespace-nowrap ${
                tab === key
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Pagination */}
        <div className="mb-2">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                    </tr>
                  ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(
                  ({ _id, firstName, lastName, email, role }) => (
                    <tr key={_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {firstName} {lastName}
                      </td>
                      <td className="px-6 py-4">{email}</td>
                      <td className="px-6 py-4 capitalize text-gray-500">
                        {role}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Add New User
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {formFields.map(({ key, label, type = "text", placeholder }) => (
                <div
                  key={key}
                  className={key === "password" ? "sm:col-span-2 relative" : ""}
                >
                  <label
                    htmlFor={key}
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    {label}
                  </label>

                  {key === "password" ? (
                    <div className="relative">
                      <input
                        id={key}
                        type={showPassword ? "text" : "password"}
                        className={`mt-1 w-full pr-10 px-4 py-2 border text-sm rounded-md ${
                          errors[key]
                            ? "border-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        }`}
                        value={newUser[key]}
                        placeholder={placeholder}
                        onChange={(e) => {
                          setNewUser((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }));
                          setErrors((prev) => ({ ...prev, [key]: "" }));
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.094.176-2.145.507-3.127m18.985 6.254a10.05 10.05 0 01-1.167 2.282M12 5c.742 0 1.45.101 2.113.291M15 9a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm4.243 4.243a10 10 0 01-14.142 0M3 3l18 18"
                            />
                          </svg>
                        )}
                      </button>
                      {errors[key] && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors[key]}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <input
                        id={key}
                        type={type}
                        className={`mt-1 w-full px-4 py-2 border text-sm rounded-md ${
                          errors[key]
                            ? "border-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        }`}
                        value={newUser[key]}
                        placeholder={placeholder}
                        onChange={(e) => {
                          setNewUser((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }));
                          setErrors((prev) => ({ ...prev, [key]: "" }));
                        }}
                      />
                      {errors[key] && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors[key]}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}

              {/* Role Selection */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  className={`w-full px-4 py-2 rounded-md text-sm border ${
                    errors.role
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  }`}
                  value={newUser.role}
                  onChange={(e) => {
                    setNewUser((prev) => ({ ...prev, role: e.target.value }));
                    setErrors((prev) => ({ ...prev, role: "" }));
                  }}
                >
                  <option value="">Select role</option>
                  {roleOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-xs text-red-500 mt-1">{errors.role}</p>
                )}
              </div>

              {/* Reporting Manager */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Reporting Manager
                </label>
                <Select
                  options={reportingManagers}
                  value={selectedManager}
                  onChange={(option) => {
                    setSelectedManager(option);
                    setNewUser((prev) => ({
                      ...prev,
                      reportingTo: option?.value || "",
                    }));
                    setErrors((prev) => ({ ...prev, reportingTo: "" }));
                  }}
                  placeholder="Select Reporting Manager"
                  isClearable
                />
                {errors.reportingTo && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.reportingTo}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-8 gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowConfirm(true)}
                disabled={btnLoading}
                className={`px-6 py-2 text-sm font-semibold rounded-md text-white ${
                  btnLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 transition"
                }`}
              >
                {btnLoading ? "Saving..." : "Save User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg">
            <h3 className="text-lg font-medium mb-4">Confirm Save</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to save this user?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm border rounded-md text-gray-700"
              >
                No
              </button>
              <button
                onClick={handleSaveUser}
                className="px-5 py-2 text-sm bg-blue-600 text-white rounded-md"
              >
                Yes, Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
