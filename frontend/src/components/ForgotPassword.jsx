import React, { useState } from "react";
import { Mail, Key, Lock, ShieldCheck, Loader2 } from "lucide-react";
import axios from "axios"
import { baseUrl } from "../api";
import { toast } from "react-toastify"

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailSent, setEmailSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${baseUrl}/api/auth/send-otp`, { email });

      if (![200, 201].includes(res.status)) {
        return toast("Failed to send otp.");
      }

      return toast(res.data.message)
    } catch (error) {
      console.log("Submit Error:", error);
      toast.error(error.response.data.message)
    } finally {
      setLoading(false);
      setEmailSent(true);
      setMessage("OTP has been sent to your email.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const otp = otpDigits.join("");
      if (otp.length !== 6) {
        setMessage("Please enter a valid 6-digit OTP.");
        return;
      }

      const res = await axios.post(`${baseUrl}/api/auth/verify-otp`, { email, otp });

      if (![200, 201].includes(res.status)) {
        return toast("Failed to send otp.");
      }
      toast(res.data.message)
      return setMessage("OTP verified successfully.");
    } catch (error) {
      console.log("Error Verify OTP:", error.message)
    } finally {
      setLoading(false);
      setOtpVerified(true);
    }

  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        setMessage("Passwords do not match!");
        return;
      }

      const otp = otpDigits.join("");

      const res = await axios.post(`${baseUrl}/api/auth/reset-password`, { email, otp, newPassword });
      if (![200, 201].includes(res.status)) {
        return toast("Failed to send otp.");
      }

      return toast("Reset Successful")
    } catch (error) {
      console.log("Reset Password Failed:", error.message)
    } finally {
      setLoading(false);
      setMessage("✅ Password has been reset successfully.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition-all duration-300">
        <div className="text-center mb-6">
          <ShieldCheck size={42} className="mx-auto text-blue-600 mb-3" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Reset Your Password
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Verify your identity and set a new password to regain access.
          </p>
        </div>

        {message && (
          <div className="mb-4 px-4 py-2 bg-blue-50 text-blue-600 text-sm rounded-lg border border-blue-100">
            {message}
          </div>
        )}

        {!emailSent && (
          <form
            onSubmit={handleEmailSubmit}
            className="space-y-4 animate-fade-in"
          >
            <label className="block text-sm font-medium text-gray-600">
              Email address
            </label>
            <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Mail size={18} className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Enter email address"
                className="flex-1 outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-md transition flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}
        {emailSent && !otpVerified && (
          <form
            onSubmit={handleOtpSubmit}
            className="space-y-4 animate-fade-in mt-6"
          >
            <label className="block text-sm font-medium text-gray-600">
              Enter OTP
            </label>

            <div className="flex justify-center gap-4">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!/^\d?$/.test(val)) return;
                    const newOtp = [...otpDigits];
                    newOtp[index] = val;
                    setOtpDigits(newOtp);
                    if (val && e.target.nextElementSibling) {
                      e.target.nextElementSibling.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      !otpDigits[index] &&
                      e.target.previousElementSibling
                    ) {
                      e.target.previousElementSibling.focus();
                    }
                  }}
                  className="w-12 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-md transition flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {otpVerified && (
          <form
            onSubmit={handleResetPassword}
            className="space-y-4 animate-fade-in mt-6"
          >
            <label className="block text-sm font-medium text-gray-600">
              New Password
            </label>
            <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="New password"
                className="flex-1 outline-none text-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <label className="block text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500">
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
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-md transition flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
