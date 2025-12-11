import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import { baseUrl } from "../../api";
import "react-toastify/dist/ReactToastify.css";
import LoadingButton from "../../components/LoadingButton";

const capitalize = (str) =>
  str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();

const Profile = () => {
  const user = useSelector((state) => state.user.userData);

  const [editMode, setEditMode] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    image: user.image || "",
    displayName: `${capitalize(user.firstName)} ${capitalize(user.lastName)}`,
    email: user.email,
    workPhone: user.workPhone || "",
    personalMobile: user.personalMobile || "",
    extension: user.extension || "",
    department: user.department || "",
    designation: user.designation || "",
    seatingLocation: user.seatingLocation || "",
    organization: user.organization || "",
    reportingTo: user.reportingTo || "",
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;

      setUserInfo((prev) => ({
        ...prev,
        image: base64String,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setButtonLoading(true);
    try {
      const payload = {
        image: userInfo.image,
        workPhone: userInfo.workPhone,
        personalMobile: userInfo.personalMobile,
        extension: userInfo.extension,
        department: userInfo.department,
        designation: userInfo.designation,
        seatingLocation: userInfo.seatingLocation,
      };

      const response = await axios.patch(
        `${baseUrl}/api/auth/update_profile`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Save failed:", error.response?.data || error.message);
      toast.error("Failed to update profile.");
    } finally {
      setButtonLoading(false);
      setEditMode(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    toast.info("Changes canceled");
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const renderField = (label, name) => {
    const isEditable = !["displayName", "email", "reportingTo"].includes(name);

    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
        <label className="w-40 text-gray-600 font-medium">{label}</label>
        {editMode && isEditable ? (
          <input
            type="text"
            name={name}
            value={userInfo[name]}
            onChange={handleInputChange}
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm w-full sm:w-auto"
          />
        ) : (
          <p className="text-gray-800 text-sm truncate">
            {userInfo[name] || "-"}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 border-b">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-24 h-24 shrink-0 group">
                {userInfo.image ? (
                  <img
                    src={userInfo.image}
                    alt="Profile"
                    className="rounded-full w-full h-full object-cover border border-gray-300"
                  />
                ) : (
                  <FaUserCircle className="w-full h-full text-gray-400" />
                )}
                {editMode && (
                  <div className="absolute inset-0 bg-black/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      title="Upload"
                    />
                    <span className="text-white text-xs">Upload</span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold truncate">
                  {userInfo.displayName.split(" ").map(capitalize).join(" ")}
                </h2>
                <p className="text-gray-600 truncate">
                  {userInfo.organization}
                </p>
                {user.role === "admin" && (
                  <p className="text-sm text-green-600 font-semibold mt-1">
                    ✅ You have Admin Access
                  </p>
                )}
              </div>
            </div>
            {!editMode ? (
              <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md flex items-center gap-2 text-sm shadow-sm"
              >
                <FaEdit />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                {buttonLoading ? (
                  <LoadingButton className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm shadow-sm w-[100px]" />
                ) : (
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm shadow-sm w-[100px]"
                  >
                    Save
                  </button>
                )}

                <button
                  onClick={handleCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md text-sm shadow-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="p-6 space-y-10">
            <section>
              <h3 className="text-lg font-semibold text-gray-700 mb-5 border-b pb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 text-sm">
                {[
                  "displayName",
                  "email",
                  "workPhone",
                  "personalMobile",
                  "extension",
                ].map((name) => (
                  <div key={name}>
                    {renderField(
                      capitalize(name.replace(/([A-Z])/g, " $1")),
                      name
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-700 mb-5 border-b pb-2">
                Work Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 text-sm">
                {["designation", "department", "seatingLocation"].map(
                  (name) => (
                    <div key={name}>
                      {renderField(
                        capitalize(name.replace(/([A-Z])/g, " $1")),
                        name
                      )}
                    </div>
                  )
                )}
                <div>{renderField("Reporting To", "reportingTo")}</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
