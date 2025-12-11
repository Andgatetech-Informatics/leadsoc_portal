// import React, { useState } from "react";
// import { domainSkills } from "./domainSkills";
// import { StarRating } from "../components/RatingStart";

// const FeedbackForm = () => {
//   const [selectedDomain, setSelectedDomain] = useState("");
//   const [ratings, setRatings] = useState({});
//   const [feedback, setFeedback] = useState("");

//   const handleDomainChange = (e) => {
//     setSelectedDomain(e.target.value);
//     setRatings({});
//   };

//   const handleRatingChange = (skill, value) => {
//     setRatings((prev) => ({ ...prev, [skill]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log({
//       domain: selectedDomain,
//       ratings,
//       feedback,
//     });
//     alert("✅ Feedback submitted successfully!");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//       <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-4xl border border-gray-200">
//         <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
//           Candidate Technical Feedback Form
//         </h1>

//         {/* Domain Selection */}
//         <div className="mb-8">
//           <label className="block text-gray-700 font-medium mb-2">
//             Select Domain
//           </label>
//           <select
//             value={selectedDomain}
//             onChange={handleDomainChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="">-- Select Domain --</option>
//             {Object.keys(domainSkills).map((domain) => (
//               <option key={domain} value={domain}>
//                 {domain}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Skills Rating */}
//         {selectedDomain && (
//           <div className="mb-10">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
//               ⭐ Rate the following {selectedDomain} skills
//             </h2>
//             <div className="space-y-5">
//               {domainSkills[selectedDomain].map((skill) => (
//                 <div
//                   key={skill}
//                   className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:shadow-md transition"
//                 >
//                   <span className="text-gray-700 font-medium">{skill}</span>
//                   <StarRating
//                     field={skill}
//                     rating={ratings[skill] || 0}
//                     onRate={handleRatingChange}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Additional Feedback */}
//         <div className="mb-8">
//           <label className="block text-gray-700 font-medium mb-2">
//             Additional Feedback / Comments
//           </label>
//           <textarea
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//             rows={4}
//             placeholder="Write overall feedback here..."
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 resize-none"
//           ></textarea>
//         </div>

//         {/* Submit Button */}
//         <div className="text-center">
//           <button
//             onClick={handleSubmit}
//             className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
//           >
//             Submit Feedback
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeedbackForm;

import React, { useState } from "react";
import { domainSkills } from "./domainSkills";
import { StarRating } from "../components/RatingStart";

/* ---------------- DEFAULT TEMPLATE ---------------- */
export const evaluationTemplate = {
  domainSpecificSkills: {},
  technicalCompetency: {
    knowledgeDepth: 0,
    conceptUnderstanding: 0,
    logicalThinking: 0,
    accuracy: 0,
  },
  problemSolving: {
    debuggingSkill: 0,
    rootCauseAnalysis: 0,
    creativity: 0,
  },
  communication: {
    clarity: 0,
    explanation: 0,
    teamwork: 0,
  },
  professionalism: {
    discipline: 0,
    behavior: 0,
  },
  overall: {
    finalScore: 0,
    strengths: "",
    improvementAreas: "",
    recommendation: "",
  },
};

/* ---------------- TABS ---------------- */
const tabs = [
  "Domain Skills",
  "Technical Competency",
  "Problem Solving",
  "Communication / Professionalism",
  "Summary",
];

/* ---------------- MAIN COMPONENT ---------------- */
const FeedbackForm = () => {
  const [selectedDomain, setSelectedDomain] = useState("");
  const [evaluation, setEvaluation] = useState(evaluationTemplate);
  const [activeTab, setActiveTab] = useState("Domain Skills");

  const updateCategoryRating = (category, field, value) => {
    setEvaluation((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  const handleDomainChange = (e) => {
    setSelectedDomain(e.target.value);
    setEvaluation(evaluationTemplate);
  };

  const handleDomainSkillRating = (skill, value) => {
    setEvaluation((prev) => ({
      ...prev,
      domainSpecificSkills: {
        ...prev.domainSpecificSkills,
        [skill]: value,
      },
    }));
  };

  const handleSubmit = () => {
    console.log("FINAL FEEDBACK:", evaluation);
    alert("Feedback submitted!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow space-y-6">
        <h1 className="text-3xl font-bold text-indigo-700 text-center">
          Technical Feedback Form
        </h1>

        {/* Domain Selection */}
        <div>
          <label className="font-medium text-gray-700">Select Domain</label>

          <select
            value={selectedDomain}
            onChange={handleDomainChange}
            className="w-full mt-2 p-3 border rounded-md"
          >
            <option value="">-- Select Domain --</option>
            {Object.keys(domainSkills).map((domain) => (
              <option key={domain}>{domain}</option>
            ))}
          </select>
        </div>

        {/* TABS */}
        <div className="flex gap-2 border-b pb-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              disabled={tab === "Domain Skills" && !selectedDomain}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-t border-b-2 transition ${
                activeTab === tab
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-gray-500"
              } ${
                !selectedDomain && tab === "Domain Skills"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="p-4 bg-gray-50 rounded-lg border min-h-[300px]">
          {/* DOMAIN SKILLS (ARRAY or GROUPED OBJECT) */}
          {activeTab === "Domain Skills" && selectedDomain && (
            <DomainSkillsTab
              selectedDomain={selectedDomain}
              evaluation={evaluation}
              onRate={handleDomainSkillRating}
            />
          )}

          {/* TECHNICAL */}
          {activeTab === "Technical Competency" && (
            <GridRating
              fields={{
                knowledgeDepth: "Knowledge Depth",
                conceptUnderstanding: "Concept Understanding",
                logicalThinking: "Logical Thinking",
                accuracy: "Accuracy",
              }}
              category="technicalCompetency"
              evaluation={evaluation}
              onRate={updateCategoryRating}
            />
          )}

          {/* PROBLEM SOLVING */}
          {activeTab === "Problem Solving" && (
            <GridRating
              fields={{
                debuggingSkill: "Debugging Skill",
                rootCauseAnalysis: "Root Cause Analysis",
                creativity: "Creativity",
              }}
              category="problemSolving"
              evaluation={evaluation}
              onRate={updateCategoryRating}
            />
          )}

          {/* COMMUNICATION */}
          {activeTab === "Communication / Professionalism" && (
            <GridRating
              fields={{
                clarity: "Clarity",
                explanation: "Explanation",
                teamwork: "Teamwork",
                discipline: "Discipline",
                behavior: "Behavior",
              }}
              category="communication"
              evaluation={evaluation}
              onRate={updateCategoryRating}
            />
          )}

          {/* SUMMARY TAB */}
          {activeTab === "Summary" && (
            <SummarySection
              evaluation={evaluation}
              update={updateCategoryRating}
            />
          )}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

/* ---------------- DOMAIN SKILLS HANDLER ---------------- */

const DomainSkillsTab = ({ selectedDomain, evaluation, onRate }) => {
  const fields = domainSkills[selectedDomain];

  if (Array.isArray(fields)) {
    return (
      <GridRating
        fields={fields}
        category="domainSpecificSkills"
        evaluation={evaluation}
        onRate={onRate}
      />
    );
  }

  // SOFTWARE GROUPED CATEGORY UI
  return (
    <div className="space-y-4">
      {Object.entries(fields).map(([group, skills]) => (
        <div key={group}>
          <h3 className="font-semibold text-gray-700 mb-2">{group}</h3>
          <GridRating
            fields={skills}
            category="domainSpecificSkills"
            evaluation={evaluation}
            onRate={onRate}
          />
        </div>
      ))}
    </div>
  );
};

/* ---------------- GRID RATING ---------------- */
const GridRating = ({ fields, category, evaluation, onRate }) => (
  <div className="grid grid-cols-2 gap-3">
    {Array.isArray(fields)
      ? fields.map((skill) => (
          <Row
            key={skill}
            label={skill}
            rating={evaluation.domainSpecificSkills[skill] || 0}
            onRate={onRate}
          />
        ))
      : Object.entries(fields).map(([key, label]) => (
          <Row
            key={key}
            label={label}
            rating={evaluation[category][key]}
            onRate={(value) => onRate(category, key, value)}
          />
        ))}
  </div>
);

/* ---------------- ROW ---------------- */
const Row = ({ label, rating, onRate }) => (
  <div className="flex justify-between items-center bg-white p-2 rounded-md border">
    <span className="text-sm font-medium">{label}</span>
    <StarRating rating={rating} onRate={onRate} />
  </div>
);

/* ---------------- SUMMARY ---------------- */
const SummarySection = ({ evaluation, update }) => (
  <div className="grid grid-cols-2 gap-3">
    <Text
      label="Strengths"
      value={evaluation.overall.strengths}
      onChange={(v) => update("overall", "strengths", v)}
    />

    <Text
      label="Improvement Areas"
      value={evaluation.overall.improvementAreas}
      onChange={(v) => update("overall", "improvementAreas", v)}
    />
    <Input
      label="Final Score (0–10)"
      type="number"
      value={evaluation.overall.finalScore}
      onChange={(v) => update("overall", "finalScore", v)}
    />
    <Input
      label="Recommendation (Hire / No Hire / Keep in Pipeline)"
      value={evaluation.overall.recommendation}
      onChange={(v) => update("overall", "recommendation", v)}
    />
  </div>
);

/* ---------------- INPUT FIELDS ---------------- */
const Input = ({ label, value, type = "text", onChange }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      className="w-full mt-1 px-3 py-2 border rounded-md"
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Text = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <textarea
      rows={3}
      className="w-full mt-1 px-3 py-2 border rounded-md"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default FeedbackForm;
