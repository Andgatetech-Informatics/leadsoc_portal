import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../api";
import { toast } from "react-toastify";

const ShareModal = ({ isOpen, onClose, jobId }) => {
  const token = localStorage.getItem("token");

  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const addEmail = () => {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) return;
    if (!validateEmail(trimmed)) return setError("Invalid email format");

    setError("");

    if (!emails.includes(trimmed)) {
      setEmails([...emails, trimmed]);
    }

    if (!selected.includes(trimmed)) {
      setSelected([...selected, trimmed]);
    }

    setEmailInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  const toggleSelect = (email) => {
    selected.includes(email)
      ? setSelected(selected.filter((e) => e !== email))
      : setSelected([...selected, email]);
  };

  const toggleSelectAll = () => {
    selected.length === emails.length
      ? setSelected([])
      : setSelected([...emails]);
  };

  const handleSend = async () => {
    if (selected.length === 0) return;
    setLoading(true);

    try {
      const payload = {
        vendorEmails: selected,
        jobId: jobId,
      };

      const response = await axios.post(
        `${baseUrl}/api/send_job_email_to_vendor`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Response:", response.data);

      toast.success("Emails sent successfully!");

      setEmails([]);
      setSelected([]);
      setEmailInput("");
      setError("");
      onClose();
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const sortedEmails = [
    ...selected.sort(),
    ...emails.filter((e) => !selected.includes(e)).sort(),
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl border border-gray-300 shadow-lg p-6 space-y-5">
        <div className="">
          <h2 className="text-lg font-semibold text-gray-900">Share email</h2>
          <p className="text-base text-gray-500">Send jobs to collaborators.</p>
        </div>

        {/* INPUT */}
        <div className="space-y-2">
          <label className="text-base font-medium text-gray-700">
            Add Email
          </label>

          <div className="flex gap-2">
            <input
              className="border border-gray-400 px-2 py-1.5 text-sm w-full outline-none focus:border-blue-600"
              placeholder="user@company.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {/* ADD BUTTON */}
            <button
              onClick={addEmail}
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        {/* LIST */}
        {emails.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-700">
                Added Emails
              </span>
              <button
                onClick={toggleSelectAll}
                className="text-xs font-medium text-blue-700 hover:underline"
              >
                {selected.length === emails.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            {/* Body */}
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
              {sortedEmails.map((email) => {
                const isChecked = selected.includes(email);
                return (
                  <label
                    key={email}
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-sm
              ${
                isChecked
                  ? "bg-blue-50 font-semibold text-gray-900"
                  : "text-gray-700"
              }
              hover:bg-blue-100/50 transition`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelect(email)}
                      className="accent-blue-600"
                    />
                    <span className="truncate">{email}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={selected.length === 0 || loading}
            className="px-5 py-2 bg-blue-700 text-white text-sm disabled:bg-gray-400 hover:bg-blue-800 flex items-center gap-2"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
