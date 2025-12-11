import React, { useEffect, useState } from "react";
import { StarRating } from "../../components/RatingStart";
import { useLocation, useParams } from "react-router-dom";
import { baseUrl } from "../../api";
import axios from "axios";
import { toast } from "react-toastify";

const TechnicalFeedbackForm = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const eventId = pathSegments[pathSegments.length - 1];
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    verilogRating: 0,
    systemVerilogRating: 0,
    uvmRating: 0,
    assertionRating: 0,
    constraintsRating: 0,
    coverageRating: 0,
    pdRating: 0,
    dftRating: 0,
    rtlRating: 0,
    technicalSkillsRating: 0,
    problemSolvingRating: 0,
    communicationRating: 0,
    scripting: "",
    protocols: "",
    comments: "",
    finalDecision: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      eventId,
      constraints: formData.constraintsRating,
      coverage: formData.coverageRating,
      assertion: formData.assertionRating,
      uvm: formData.uvmRating,
      systemVerilog: formData.systemVerilogRating,
      verilog: formData.verilogRating,
      pd: formData.pdRating,
      dft: formData.dftRating,
      rtl: formData.rtlRating,
      technicalSkills: formData.technicalSkillsRating,
      problemSolving: formData.problemSolvingRating,
      communication: formData.communicationRating,
      scripting: formData.scripting,
      protocols: formData.protocols,
      remark: formData.comments,
      decision: formData.finalDecision,
    };

    try {
      const response = await axios.post(
        `${baseUrl}/api/feedback/create`,
        payload
      );

      if ([200, 201].includes(response.status)) {
        toast.success("Screening feedback submitted!");
        setIsSubmitted(true);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error submitting feedback. Try again later.");
    }
  };

  useEffect(() => {
    const fetchFeedbackStatus = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/feedback/check_event/${eventId}`
        );
        console.log("data", data.status);
        if (data) {
          setIsSubmitted(data.status);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (eventId) fetchFeedbackStatus();
  }, [eventId]);

  const renderRatingWithFeedback = (label, ratingField) => (
    <div className="text-center space-y-3">
      <label className="block text-base font-medium text-gray-700">
        {label}
      </label>
      <div className="flex justify-center">
        <StarRating
          field={ratingField}
          rating={formData[ratingField]}
          onRate={handleRatingChange}
        />
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Feedback Submitted
          </h2>
          <p className="text-gray-600 text-sm">
            Thank you! Your screening feedback has been saved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-white shadow-2xl rounded-3xl border border-gray-200">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-indigo-700 mb-12">
        🛠️ Technical Assessment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-16 text-gray-800">
        {/* Technical Topics */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
            🧪 Technical Topics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderRatingWithFeedback("Verilog", "verilogRating")}
            {renderRatingWithFeedback("System Verilog", "systemVerilogRating")}
            {renderRatingWithFeedback("UVM", "uvmRating")}
            {renderRatingWithFeedback("Assertions", "assertionRating")}
            {renderRatingWithFeedback("Constraints", "constraintsRating")}
            {renderRatingWithFeedback("Coverage", "coverageRating")}
            {renderRatingWithFeedback("PD", "pdRating")}
            {renderRatingWithFeedback("DFT", "dftRating")}
            {renderRatingWithFeedback("RTL", "rtlRating")}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
            🧠 Skills Evaluation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderRatingWithFeedback(
              "Technical Skills",
              "technicalSkillsRating"
            )}
            {renderRatingWithFeedback(
              "Problem Solving",
              "problemSolvingRating"
            )}
            {renderRatingWithFeedback("Communication", "communicationRating")}
          </div>
        </section>

        {/* Tools & Protocols */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
            🧰 Tools & Protocols
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Scripting
              </label>
              <input
                type="text"
                name="scripting"
                value={formData.scripting}
                onChange={handleChange}
                placeholder="e.g., Python, Shell"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Protocols
              </label>
              <input
                type="text"
                name="protocols"
                value={formData.protocols}
                onChange={handleChange}
                placeholder="e.g., AXI, PCIe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </section>

        {/* Final Comments */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
            📝 Final Comments
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Additional Comments
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                rows={4}
                placeholder="Any other observations..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Action
              </label>
              <select
                name="finalDecision"
                value={formData.finalDecision}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select decision</option>
                <option value="good"> Good </option>
                <option value="very-good"> Very Good </option>
                <option value="excellent"> Excellent </option>
                <option value="very-bad"> Very bad </option>
                <option value="Bad"> Bad </option>
              </select>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-10">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-lg shadow-md transition-all duration-200"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default TechnicalFeedbackForm;
