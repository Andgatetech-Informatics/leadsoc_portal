import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportSalesCandidatesToXlsx = (candidates) => {
  if (!candidates || !candidates.length) return;

  const rows = candidates.map((c, index) => ({
    "S.No": index + 1,
    "Candidate Name": c.name || "N/A",
    Experience: c.experienceYears ? `${c.experienceYears} yrs` : "Fresher",
    Email: c.email || "N/A",
    Mobile: c.mobile || "N/A",
    Status: c.status || "N/A",
    "Job Position": c.jobsReferred ? "DV Engineer" : "PD Engineer",
    "Candidate Type": c.candidateType || "-",
    "TA / Vendor": c.isFreelancer
      ? `${c.FreelancerId?.firstName || ""} ${
          c.FreelancerId?.lastName || ""
        }`.trim() || c.freelancerName
      : c.poc || "N/A",
    Role: c.isFreelancer ? "Vendor" : "TA",
    "Assigned TA": c.isFreelancer ? c.poc || "-" : "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Candidates");

  // Auto column width
  const colWidths = Object.keys(rows[0]).map((key) => ({
    wch: Math.max(key.length, ...rows.map((r) => String(r[key] || "").length)),
  }));
  worksheet["!cols"] = colWidths;

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `Sales_Candidates_${Date.now()}.xlsx`);
};
