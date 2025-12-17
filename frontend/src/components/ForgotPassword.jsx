import React, { useState } from "react";
import { Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";
import axios from "axios";
import { baseUrl } from "../api";
import { toast } from "react-toastify";

/* ===================== VALIDATION HELPERS ===================== */

const isValidEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const passwordRules = {
  length: (pwd) => pwd.length >= 8,
  uppercase: (pwd) => /[A-Z]/.test(pwd),
  lowercase: (pwd) => /[a-z]/.test(pwd),
  number: (pwd) => /\d/.test(pwd),
  special: (pwd) => /[@$!%*?&#]/.test(pwd),
};

/* ===================== RULE ITEM ===================== */

const PasswordRule = ({ label, isValid }) => (
  <div
    className={`flex items-center gap-2 text-sm transition-all ${
      isValid ? "text-green-600" : "text-gray-400"
    }`}
  >
    <span className="text-lg">{isValid ? "✔" : "○"}</span>
    <span>{label}</span>
  </div>
);

/* ===================== COMPONENT ===================== */

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailSent, setEmailSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [passwordStatus, setPasswordStatus] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const isPasswordValid =
    passwordStatus.length &&
    passwordStatus.uppercase &&
    passwordStatus.lowercase &&
    passwordStatus.number &&
    passwordStatus.special;

  /* ===================== SEND OTP ===================== */

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/api/auth/send-otp`, { email });
      toast.success(res.data.message || "OTP sent");
      setEmailSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== VERIFY OTP ===================== */

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join("");

    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/api/auth/verify-otp`, {
        email,
        otp,
      });
      toast.success(res.data.message || "OTP verified");
      setOtpVerified(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== RESET PASSWORD ===================== */

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Password does not meet requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const otp = otpDigits.join("");
      await axios.post(`${baseUrl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });

      toast.success("Password reset successful");
      setTimeout(() => (window.location.href = "/login"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border">
        <div className="text-center mb-6">
          <ShieldCheck className="mx-auto text-blue-600 mb-3" size={42} />
          <h2 className="text-2xl font-semibold">Reset Password</h2>
          <p className="text-sm text-gray-500">
            Secure your account with a strong password
          </p>
        </div>

        {/* EMAIL */}
        {!emailSent && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="flex items-center border rounded-md px-3 py-2">
              <Mail size={18} className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-md flex justify-center items-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* OTP */}
        {emailSent && !otpVerified && (
          <form onSubmit={handleOtpSubmit} className="space-y-4 mt-6">
            <div className="flex justify-center gap-3">
              {otpDigits.map((d, i) => (
                <input
                  key={i}
                  maxLength={1}
                  inputMode="numeric"
                  value={d}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!/^\d?$/.test(val)) return;
                    const copy = [...otpDigits];
                    copy[i] = val;
                    setOtpDigits(copy);
                    if (val && e.target.nextElementSibling)
                      e.target.nextElementSibling.focus();
                  }}
                  className="w-12 h-12 text-center border rounded-md text-lg"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-md flex justify-center items-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* RESET PASSWORD */}
        {otpVerified && (
          <form onSubmit={handleResetPassword} className="space-y-4 mt-6">
            <div className="flex items-center border rounded-md px-3 py-2">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="New password"
                className="flex-1 outline-none text-sm"
                value={newPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewPassword(value);
                  setPasswordStatus({
                    length: passwordRules.length(value),
                    uppercase: passwordRules.uppercase(value),
                    lowercase: passwordRules.lowercase(value),
                    number: passwordRules.number(value),
                    special: passwordRules.special(value),
                  });
                }}
                required
              />
            </div>

            {/* LIVE PASSWORD RULES */}
            <div className="space-y-1">
              <PasswordRule
                label="Minimum 8 characters"
                isValid={passwordStatus.length}
              />
              <PasswordRule
                label="At least 1 uppercase letter"
                isValid={passwordStatus.uppercase}
              />
              <PasswordRule
                label="At least 1 lowercase letter"
                isValid={passwordStatus.lowercase}
              />
              <PasswordRule
                label="At least 1 number"
                isValid={passwordStatus.number}
              />
              <PasswordRule
                label="At least 1 special character"
                isValid={passwordStatus.special}
              />
            </div>

            <div className="flex items-center border rounded-md px-3 py-2">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Confirm password"
                className="flex-1 outline-none text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-md flex justify-center items-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
