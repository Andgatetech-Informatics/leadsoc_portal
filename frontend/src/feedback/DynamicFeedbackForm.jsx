// import React, { useEffect, useState } from "react";
// import CreatableSelect from "react-select/creatable";
// import { StarRating } from "../components/RatingStart";

// const domainOptions = [
//   { value: "DFT", label: "DFT" },
//   { value: "PD", label: "PD" },
//   { value: "DV", label: "DV" },
//   { value: "PDK", label: "PDK" },
//   { value: "Analog Mixed Signaling", label: "Analog Mixed Signaling" },
//   { value: "Analog Layout Design", label: "Analog Layout Design" },
//   { value: "Design Engineer", label: "Design Engineer" },
//   { value: "Synthesis", label: "Synthesis" },
//   { value: "Physical Verification", label: "Physical Verification" },
//   { value: "Embedded", label: "Embedded" },
//   { value: "FPGA", label: "FPGA" },
//   { value: "Design", label: "Design" },
//   { value: "Analog Design", label: "Analog Design" },
//   { value: "Formal Verification", label: "Formal Verification" },
//   { value: "Software", label: "Software" },
//   { value: "STA", label: "STA" },
// ];

// const DynamicFeedbackForm = () => {
//   const [selectedDomains, setSelectedDomains] = useState([]);
//   const [ratings, setRatings] = useState({});
//   const [globalComment, setGlobalComment] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   const handleRate = (domain, value) => {
//     setRatings((prev) => ({ ...prev, [domain]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const finalData = {
//       ratings,
//       globalComment,
//     };
//     console.log("Submitted Feedback:", finalData);
//     setSubmitted(true);
//     setTimeout(() => setSubmitted(false), 2500);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-5 py-12">
//       <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl border border-slate-200 p-10 space-y-10">
//         {/* Header */}
//         <div className="pb-6 border-b border-slate-300">
//           <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
//             Technical & Behavioral Evaluation
//           </h2>
//           <p className="text-slate-500 mt-1 text-sm sm:text-base">
//             Assess the candidate’s proficiency, strengths, and development areas
//             based on observable skills and interview performance.
//           </p>
//         </div>

//         {/* Domain Select */}
//         <div className="">
//           <label className="text-xs font-semibold text-slate-600 uppercase">
//             Select Domains to Rate
//           </label>
//           <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-2">
//             <CreatableSelect
//               classNamePrefix="select"
//               isMulti
//               options={domainOptions}
//               placeholder="Choose or create domains..."
//               onChange={(opts) => {
//                 setSelectedDomains(opts || []);
//                 const updated = {};
//                 opts?.forEach(
//                   (o) => (updated[o.value] = ratings[o.value] || 0)
//                 );
//                 setRatings(updated);
//               }}
//             />
//           </div>
//         </div>

//         {/* Ratings */}
//         {selectedDomains.length > 0 && (
//           <form onSubmit={handleSubmit} className="space-y-10">
//             <div className="grid sm:grid-cols-2 gap-8">
//               {selectedDomains.map((item) => (
//                 <div
//                   key={item.value}
//                   className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm hover:shadow-lg transition-shadow"
//                 >
//                   <p className="font-semibold text-slate-800 text-lg mb-2 tracking-tight">
//                     {item.label}
//                   </p>
//                   <StarRating
//                     field={item.value}
//                     rating={ratings[item.value] || 0}
//                     onRate={handleRate}
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* Comment */}
//             <div>
//               <label className="text-xs font-semibold text-slate-600 uppercase">
//                 Additional Overall Feedback
//               </label>
//               <textarea
//                 rows={4}
//                 className="mt-2 w-full border border-slate-300 bg-slate-50 rounded-2xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/30 outline-none transition"
//                 placeholder="Share strengths, improvements & actionable suggestions..."
//                 value={globalComment}
//                 onChange={(e) => setGlobalComment(e.target.value)}
//               />
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               className="w-full py-3 text-white bg-blue-700 hover:bg-blue-800 font-semibold rounded-2xl shadow-md tracking-wide transition-transform hover:scale-[1.01]"
//             >
//               Submit Feedback
//             </button>

//             {submitted && (
//               <p className="text-center text-green-600 font-semibold">
//                 ✔ Feedback submitted successfully!
//               </p>
//             )}
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DynamicFeedbackForm;

import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { StarRating } from "../components/RatingStart";
import { toast } from "react-toastify";

const miscOptions = [
  { value: "Communication", label: "Communication" },
  { value: "Problem Solving", label: "Problem Solving" },
  { value: "Teamwork", label: "Teamwork" },
  { value: "Confidence", label: "Confidence" },
  { value: "Adaptability", label: "Adaptability" },
  { value: "Leadership", label: "Leadership" },
];

// ---------------------------
// DOMAIN LIST
// ---------------------------
const domainOptions = [
  { value: "DFT", label: "DFT" },
  { value: "PD", label: "PD" },
  { value: "DV", label: "DV" },
  { value: "PDK", label: "PDK" },
  { value: "Analog Mixed Signaling", label: "Analog Mixed Signaling" },
  { value: "Analog Layout Design", label: "Analog Layout Design" },
  { value: "Design Engineer", label: "Design Engineer" },
  { value: "Synthesis", label: "Synthesis" },
  { value: "Physical Verification", label: "Physical Verification" },
  { value: "Embedded", label: "Embedded" },
  { value: "FPGA", label: "FPGA" },
  { value: "Design", label: "Design" },
  { value: "Analog Design", label: "Analog Design" },
  { value: "Formal Verification", label: "Formal Verification" },
  { value: "Software", label: "Software" },
  { value: "STA", label: "STA" },
];

// ---------------------------
// SKILL SUGGESTIONS PER DOMAIN
// ---------------------------
const skillSuggestions = {
  DFT: [
    "Scan Insertion",
    "ATPG",
    "DFT Architecture",
    "Boundary Scan (JTAG)",
    "MBIST",
    "LBIST",
  ],
  PD: [
    "Floorplanning",
    "Placement",
    "Clock Tree Synthesis (CTS)",
    "Routing",
    "Power Analysis",
    "Timing Closure",
  ],
  DV: [
    "SystemVerilog",
    "UVM",
    "Scoreboarding",
    "Functional Coverage",
    "Assertions (SVA)",
    "Randomization",
  ],
  PDK: [
    "Device Modeling",
    "DRC/LVS Handling",
    "Technology File Understanding",
    "Process Corners",
  ],
  "Analog Mixed Signaling": [
    "SPICE Simulation",
    "ADC/DAC",
    "Clocking/Jitter",
    "Noise Analysis",
    "Signal Integrity",
  ],
  "Analog Layout Design": [
    "Matching Layout",
    "Guard Ringing",
    "Routing Analog Rules",
    "PEX",
  ],
  "Design Engineer": [
    "RTL Design",
    "SystemVerilog",
    "FSM Design",
    "Linting",
    "CDC/RDC",
  ],
  Synthesis: [
    "Logic Synthesis",
    "SDC Constraints",
    "UPF Low Power",
    "Clock Gating",
  ],
  "Physical Verification": ["DRC", "LVS", "ERC", "Antenna Checks"],
  Embedded: ["C Programming", "RTOS", "UART/I2C/SPI", "Debugging"],
  FPGA: ["Vivado/Quartus", "Timing Closure", "HW Bring-up", "Bitstream"],
  Design: ["RTL", "Microarchitecture", "Timing Awareness"],
  "Analog Design": ["Op-Amps", "PLL", "Biasing", "Noise/PSRR"],
  "Formal Verification": [
    "Properties",
    "Equivalence Checking",
    "Model Checking",
  ],
  Software: ["DSA", "API Dev", "React", "Node.js", "Python"],
  STA: ["Timing Analysis", "CDC", "Setup/Hold Debug", "PVT Corner Analysis"],
};

// ---------------------------
// MAIN COMPONENT
// ---------------------------
const DynamicFeedbackForm = () => {
  // State
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [domainSkills, setDomainSkills] = useState({});
  const [ratings, setRatings] = useState({});
  const [globalComment, setGlobalComment] = useState("");
  const [selectedMisc, setSelectedMisc] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // HANDLE DOMAIN CHANGE
  // ---------------------------
  const handleDomainChange = (domains) => {
    const newDomainSkills = { ...domainSkills };
    const newRatings = { ...ratings };
    const selectedValues = (domains || []).map((d) => d.value);

    // Remove unselected domains
    Object.keys(newDomainSkills).forEach((d) => {
      if (!selectedValues.includes(d)) {
        delete newDomainSkills[d];
        Object.keys(newRatings).forEach((key) => {
          if (key.startsWith(d + "_")) delete newRatings[key];
        });
      }
    });

    // Add new domains if they don't exist yet
    (domains || []).forEach((d) => {
      if (!newDomainSkills[d.value]) {
        newDomainSkills[d.value] = []; // <-- start empty
      }
    });

    setSelectedDomains(domains || []);
    setDomainSkills(newDomainSkills);
    setRatings(newRatings);
  };

  // ---------------------------
  // HANDLE SKILL CHANGE
  // ---------------------------
  const handleSkillChange = (domain, skills) => {
    setDomainSkills((prev) => ({ ...prev, [domain]: skills || [] }));

    // Initialize ratings for newly added skills
    const updatedRatings = { ...ratings };
    skills?.forEach((s) => {
      const key = domain + "_" + s.value;
      if (!updatedRatings[key]) updatedRatings[key] = 0;
    });
    setRatings(updatedRatings);
  };

  // ---------------------------
  // HANDLE RATING CHANGE
  // ---------------------------
  const handleRate = (field, value) => {
    setRatings((prev) => ({ ...prev, [field]: value }));
  };

  // ---------------------------
  // HANDLE SUBMIT
  // ---------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Show submitting state

    const payload = {
      ratings,
      globalComment,
      domains: selectedDomains,
      misc: selectedMisc,
    };

    console.log("Feedback Submitted:", payload);

    // Simulate async operation
    setTimeout(() => {
      toast.success("Feedback submitted!");
      setLoading(false); // Re-enable button
    }, 1000);
  };

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
      <div className="w-full max-w-5xl bg-white p-10 rounded-3xl shadow-xl space-y-4">
        {/* Header */}
        <div className="pb-6 border-b border-slate-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Technical & Behavioral Evaluation
          </h2>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Assess the candidate’s proficiency, strengths, and development areas
            based on observable skills and interview performance.
          </p>
        </div>

        {/* Domain Select */}
        <div>
          <label className="text-base font-semibold text-slate-600 uppercase">
            Select Domain
          </label>
          <CreatableSelect
            isMulti
            options={domainOptions}
            placeholder="Choose or create domains..."
            onChange={handleDomainChange}
          />
        </div>

        {/* Skills & Ratings */}
        {selectedDomains.map((domain) => (
          <div key={domain.value} className="space-y-4">
            <p className="font-medium text-base">{domain.label}</p>

            {/* Skills Dropdown */}
            <CreatableSelect
              isMulti
              placeholder={`Select skills for ${domain.label}`}
              value={domainSkills[domain.value] || []}
              options={(skillSuggestions[domain.value] || []).map((s) => ({
                value: s,
                label: s,
              }))}
              onChange={(skills) => handleSkillChange(domain.value, skills)}
            />

            {/* Show Ratings only for selected skills */}
            <div className="grid sm:grid-cols-2 gap-6 mt-2">
              {(domainSkills[domain.value] || []).map((skill) => {
                const key = domain.value + "_" + skill.value;
                return (
                  <div
                    key={key}
                    className="p-4 border rounded-xl bg-slate-50 shadow-sm"
                  >
                    <p className="font-medium text-slate-700 mb-2">
                      {skill.label}
                    </p>
                    <StarRating
                      field={key}
                      rating={ratings[key] || 0}
                      onRate={(field, value) =>
                        setRatings((prev) => ({ ...prev, [field]: value }))
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/*  Behavioral & Miscellaneous Skills */}
        <div className="mt-6">
          <label className="text-base font-semibold text-slate-600 uppercase">
            Behavioral & Miscellaneous Skills
          </label>
          <CreatableSelect
            isMulti
            options={miscOptions}
            placeholder="Select or create traits..."
            value={selectedMisc}
            onChange={(traits) => {
              setSelectedMisc(traits || []);

              // Initialize ratings for newly added traits
              const updatedRatings = { ...ratings };
              (traits || []).forEach((t) => {
                const key = "MISC_" + t.value;
                if (!updatedRatings[key]) updatedRatings[key] = 0;
              });
              setRatings(updatedRatings);
            }}
          />

          {/* Show Star Ratings for selected misc traits */}
          <div className="grid sm:grid-cols-2 gap-6 mt-2">
            {selectedMisc.map((trait) => {
              const key = "MISC_" + trait.value;
              return (
                <div
                  key={key}
                  className="p-4 border rounded-xl bg-slate-50 shadow-sm"
                >
                  <p className="font-medium text-slate-700 mb-2">
                    {trait.label}
                  </p>
                  <StarRating
                    field={key}
                    rating={ratings[key] || 0}
                    onRate={(field, value) =>
                      setRatings((prev) => ({ ...prev, [field]: value }))
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Comment */}
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase">
            Additional Overall Feedback
          </label>
          <textarea
            rows={4}
            placeholder="Share strengths, improvements & actionable suggestions..."
            className="w-full border rounded-xl p-4"
            value={globalComment}
            onChange={(e) => setGlobalComment(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-blue-700 text-white rounded-2xl font-semibold hover:bg-blue-800 transition-transform hover:scale-[1.01]"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
};

export default DynamicFeedbackForm;
