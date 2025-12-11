import React, { useEffect, useState } from "react";
import { StarRating } from "../../components/RatingStart";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../../api";

const ScreeningFeedbackForm = () => {
  const location = useLocation();
  const eventId = location.pathname.split("/").pop();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    communication: 0,
    confidence: 0,
    remark: "",
    decision: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, eventId };

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
        if (data?.status) {
          setIsSubmitted(true);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (eventId) fetchFeedbackStatus();
  }, [eventId]);

  // ─────────────────────── UI START ───────────────────────
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-12">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">
          📝 Screening Feedback
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ───── Candidate Evaluation ───── */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Candidate Evaluation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {["communication", "confidence"].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field}
                  </label>
                  <StarRating
                    field={field}
                    rating={formData[field]}
                    onRate={handleRatingChange}
                  />
                  <p className="text-xs text-gray-500">
                    Rating: {formData[field]}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ───── Remarks ───── */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">
              Interviewer's Remarks
            </h3>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleInputChange}
              rows={4}
              placeholder="Share observations, remarks, or suggestions..."
              className="w-full border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </section>

          {/* ───── Final Decision ───── */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">
              Action
            </h3>
            <select
              name="decision"
              value={formData.decision}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select decision</option>
              <option value="can-consider">Can consider</option>
              <option value="good-to-go">Good to go</option>
              <option value="cannot-consider">Cannot consider</option>
            </select>
          </section>

          {/* ───── Submit Button ───── */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-lg text-base font-semibold shadow-md"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScreeningFeedbackForm;
