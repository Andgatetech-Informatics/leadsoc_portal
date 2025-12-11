import React from "react";
import FormFile from "./FormFile";

const EducationSection = ({ setFieldValue }) => {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
        Education Details
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <FormFile
          label="10th Class Marksheet / Certificate"
          name="tenthMarksheet"
          setFieldValue={setFieldValue}
          accept="application/pdf"
        />
        <FormFile
          label="12th Class Marksheet / Certificate"
          name="twelfthMarksheet"
          setFieldValue={setFieldValue}
          accept="application/pdf"
        />
        <FormFile
          label="Graduation Marksheet / Convocation"
          name="graduationMarksheet"
          setFieldValue={setFieldValue}
          accept="application/pdf"
        />
        <FormFile
          label="Post Graduation Marksheet / Convocation"
          name="postGraduation"
          setFieldValue={setFieldValue}
          accept="application/pdf"
          required={false}
        />
      </div>
    </section>
  );
};

export default EducationSection;
