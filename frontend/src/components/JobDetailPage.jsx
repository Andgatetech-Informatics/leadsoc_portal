import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const JobDetailPage = () => {
  const { id } = useParams(); // Access the job ID from the URL

  // Mock data (replace with real API call)
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      const response = {
        id,
        jobTitle: "Group Technical  C#, .Net",
        location: "Noida",
        companyName: "AndGate Informatics Pvt Ltd",
        clientName: "AndGate Informatics Pvt Ltd",
        skills: ".Net, C#",
        experience: ["AX / D365 Data Architect", "C++", "C#"],
        priority: "Low",
        jobDescription:
          "AndGate Informatics Pvt. Ltd. is a dynamic technology firm specializing in semiconductor design, database engineering, embedded systems, AI/ML solutions, and IoT services. We provide cutting-edge services and innovative solutions to industries including semiconductor, IT, software, and staffing. With a strong focus on innovation, we work with global clients to design, develop, and deploy advanced technological solutions that address real-world challenges. Our team is at the forefront of transforming the digital landscape, and we are committed to fostering a culture of continuous learning and professional growth.",

        companyInfo:
          "AndGate Informatics Pvt. Ltd. is a technology solutions provider that delivers industry-leading capabilities in semiconductor design, embedded systems, AI/ML, and IoT. Headquartered in Noida, India, we cater to the evolving technological demands of diverse sectors. Our highly skilled team combines deep technical expertise with a commitment to excellence, enabling us to deliver state-of-the-art solutions. We prioritize customer satisfaction and strive to maintain long-term relationships built on trust and innovative outcomes.",

        dateOfCreation: "2025-08-15",
        endDate: "2025-12-15",
      };

      setJobDetails(response);
    };

    fetchJobDetails();
  }, [id]);

  if (!jobDetails) {
    return <div className="text-center text-gray-600 py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8 space-y-8">
        {/* Job Header */}
        <div className=" mb-8">
          <h1 className="text-xl font-bold text-gray-900">
            {jobDetails.jobTitle}
          </h1>
          <p className="text-xl text-gray-700 mt-2">{jobDetails.location}</p>
        </div>

        {/* Job Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Job Summary
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Client:</strong> {jobDetails.clientName}
              </li>
              <li>
                <strong>Required Skills:</strong> {jobDetails.skills}
              </li>
              <li>
                <strong>Experience:</strong> {jobDetails.experience.join(", ")}
              </li>
              <li>
                <strong>Priority:</strong> {jobDetails.priority}
              </li>
              <li>
                <strong>Positions Available:</strong> 1
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Date Range
            </h2>
            <div className="space-y-2 text-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Post Date
                </label>
                <p>{jobDetails.dateOfCreation}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <p>{jobDetails.endDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Job Description
          </h2>
          <p className="text-gray-700">{jobDetails.jobDescription}</p>
        </div>

        {/* Company Info */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            About Company
          </h2>
          <p className="text-gray-700">{jobDetails.companyInfo}</p>
        </div>

        {/* Apply Button */}
        {/* <div className="flex justify-center mb-8">
          <button className="px-8 py-4 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-all text-xl focus:outline-none">
            Apply Now
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default JobDetailPage;
