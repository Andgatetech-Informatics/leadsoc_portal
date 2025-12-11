import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { motion, useAnimation } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../../api";
import { getUserDetails } from "../../utils/auth";
import { setUser } from "../../store/slice/userSclice";

const LoginScreen = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const controls = useAnimation();
  // const orbRef = useRef(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginResponse = await axios.post(
        `${baseUrl}/api/auth/login`,
        formData
      );
      const token = loginResponse?.data?.token;

      if (!token) {
        throw new Error("No token received from login response.");
      }

      const { user } = await getUserDetails(token);

      localStorage.setItem("token", token);
      dispatch(setUser({ ...user, token }));

      toast.success("Login successful!");

      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Login failed.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-inter bg-neutral-900 text-white">
      {/* Left Side */}
      <div className="relative hidden md:flex w-1/2 flex-col justify-center items-start px-14 bg-[#0f0f19] overflow-hidden font-sans">
        {/* Animated Gradient Glow Orbs */}
        <motion.div
          // ref={orbRef}
          className="absolute w-[500px] h-[500px] top-[-150px] left-[-150px] rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 opacity-20 blur-3xl"
          animate={controls}
        />

        {/* Main Welcome Text */}
        <motion.div
          className="z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Welcome to <span className="text-blue-500">AndGate Portal</span>
          </h1>
          <p className="text-sm text-neutral-300 max-w-lg">
            Your all-in-one system for HR, Candidate Management & Smart
            Onboarding.
          </p>
          <p className="mt-5 text-sm text-neutral-500 tracking-wide">
            Reliable • Secure • Efficient
          </p>
        </motion.div>
      </div>

      {/* Right Side (Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 bg-gradient-to-br bg-gray-300">
        <div className="w-full max-w-md bg-[#26263b] p-8 rounded-xl shadow-2xl border border-neutral-700">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white">Sign In </h2>

            <p className="text-sm text-neutral-400 mt-2">
              Enter your credentials below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                required
                placeholder=""
                className="w-full px-4 py-2.5 rounded-md bg-[#1e1e2f] text-white border border-neutral-600 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm focus:shadow-md"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder=""
                className="w-full px-4 py-2.5 rounded-md bg-[#1e1e2f] text-white border border-neutral-600 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm focus:shadow-md"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-10 text-neutral-400 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-500 hover:underline hover:text-blue-400 transition"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-md font-semibold text-sm transition-all duration-300 ${
                isLoading
                  ? "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-xs text-center text-neutral-500 mt-6">
            © {new Date().getFullYear()} ANDGATE IT Solutions. All rights
            reserved.
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default LoginScreen;
