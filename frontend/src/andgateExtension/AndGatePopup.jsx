import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, PlayCircle, Globe, Grid, Grid2X2 } from "lucide-react";
import { baseUrl } from "../api";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaRegCopy, FaCheck } from "react-icons/fa";
import { candidateRegistrationUrl } from "../api";

const hrDmAccess = ["shubhi@andgatetech.com", "preeti.chauhan@andgatetech.com", "shamna@andgatetech.com", "udit@andgatetech.com"];


const products = [
  {
    name: "VerifPlay",
    url: "https://verifplay.com",
    icon: <PlayCircle size={28} className="text-blue-600" />,
  },
  // {
  //   name: "Portal",
  //   url: "https://myportal.andgatetech.com",
  //   icon: <Globe size={28} className="text-green-600" />,
  // },
  // Add more products here
];

const AndGatePopup = ({ path }) => {
  const user = useSelector((state) => state.user.userData);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);


  const closePopup = () => setIsOpen(false);

  const handleChangeUserRole = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.reload();
        return;
      }

      const role = path === "/dashboard/delivery" ? "hr" : "delivery";

      console.log("Changing role to:", role);

      const response = await axios.put(
        `${baseUrl}/api/auth/change-user-role`,
        { newRole: role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to change user role");
      }

      // Remove token & reload page
      localStorage.removeItem("token");
      window.location.reload();

    } catch (error) {
      console.error("Error changing user role:", error?.response?.data || error.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(candidateRegistrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  return (
    <div className="relative z-50">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center justify-center  transition-all duration-300 "
        aria-label="Open App Launcher"
      >
        {isOpen ? <X size={20} /> : <Grid size={20} />}
      </motion.button>

      {/* Popup */}
      {
        isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:block absolute top-14 right-4 w-[320px] bg-white rounded-2xl shadow-xl p-5 border border-gray-100 z-20"
          >
            {/* Header + Copy Section Horizontal */}
            <div className="flex items-center justify-between mb-5 gap-3">
              {/* Heading */}
              <h3 className="text-lg font-semibold text-gray-800 whitespace-nowrap">
                Launch App
              </h3>

              {/* Copy button container */}
              <div className="flex items-center">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${copied
                    ? "bg-green-100 text-green-700 border border-green-400"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                  {copied ? (
                    <>
                      <FaCheck className="text-green-700" />
                      Copied
                    </>
                  ) : (
                    <>
                      <FaRegCopy />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Link Display Box */}
            <div className="mb-4">
              <div className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 truncate">
                https://myportal.andgatetech.com/candidate-registration
              </div>
              {copied && (
                <div className="text-center mt-1 text-xs text-green-600 animate-fadeInOut">
                  Link copied!
                </div>
              )}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-3">
              {products.map((product, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.04 }}
                  onClick={() => window.open(product.url, "_blank")}
                  className="group flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition shadow-sm cursor-pointer"
                  title={product.name}
                >
                  <div className="mb-2">{product.icon}</div>
                  <span className="text-[13px] font-medium text-gray-700 group-hover:text-blue-600 transition text-center">
                    {product.name}
                  </span>
                </motion.button>
              ))}

              {/* Role Switch Box */}
              {hrDmAccess.includes(user?.email) && (
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.04 }}
                  onClick={handleChangeUserRole}
                  className="group flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition shadow-sm cursor-pointer"
                >
                  <div className="mb-2">
                    <Globe size={28} className="text-green-600" />
                  </div>
                  <span className="text-[13px] font-medium text-gray-700 group-hover:text-blue-600 transition text-center">
                    {path === "/dashboard/delivery"
                      ? "Switch To HR"
                      : "Switch To Delivery Manager"}
                  </span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )
      }


    </div>
  );
};

export default AndGatePopup;
