import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { FaDownload, FaPlus, FaUpload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { baseUrl } from "../api";
import { generatePDF, numberToWords } from "../utils/invoiceTemplate";
import html2pdf from "html2pdf.js";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Invoice = () => {
  const token = localStorage.getItem("token");
  const [showSender, setShowSender] = useState(true);
  const [showReceiver, setShowReceiver] = useState(true);
  const [showItemDetails, setShowItemDetails] = useState(true);
  const [showBankDetails, setShowBankDetails] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [organizationName, setOrganizationName] = useState("");
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const [invoiceData, setInvoiceData] = useState({
    logo: "",
    invoiceDate: "",
    purchaseOrderNumber: "",
    billingMonth: "",
    fromCompanyName: "",
    fromAddress: "",
    fromPAN: "",
    fromGSTIN: "",
    fromCIN: "",
    fromContact: "",
    fromEmail: "",
    toCompanyName: "",
    toAddress: "",
    toPAN: "",
    toGSTIN: "",
    toContact: "",
    toEmail: "",
    items: [
      {
        description: "",
        billingDays: "",
        workingDays: "",
        rate: "",
        hsnSac: "",
        gstRate: "",
        amount: "",
      },
    ],
    subTotal: 0,
    sgst: 0,
    cgst: 0,
    igst: 0,
    discount: 0,
    total: 0,
    amountInWords: "",
    reverseCharges: "",
    bankDetails: {
      bankName: "",
      accountName: "",
      accountNumber: "",
      ifscCode: "",
      branch: "",
    },
    signature: "",
    invoiceStatus: "Draft",
    notes: "",
  });

  const isInvoiceValid = () => {
    // Regex patterns for validation
    const mobilePattern = /^[0-9]{10}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const ifscPattern = /^[A-Za-z]{4}[0-9]{7}$/;
    const accountNumberPattern = /^[0-9]{9,18}$/;

    // Check required fields
    if (
      !invoiceData.fromAddress.trim() ||
      !invoiceData.fromPAN.trim() ||
      !invoiceData.fromGSTIN.trim() ||
      !invoiceData.fromCIN.trim() ||
      !invoiceData.fromContact.trim() ||
      !invoiceData.fromEmail.trim() ||
      !invoiceData.toCompanyName.trim() ||
      !invoiceData.toAddress.trim() ||
      !invoiceData.toPAN.trim() ||
      !invoiceData.toGSTIN.trim() ||
      !invoiceData.toContact.trim() ||
      !invoiceData.toEmail.trim() ||
      !invoiceData.invoiceDate ||
      !invoiceData.purchaseOrderNumber.trim() ||
      !invoiceData.billingMonth.trim() ||
      !invoiceData.items.length ||
      !invoiceData.signature
    ) {
      // toast.error("Please fill in all required fields.");
      return false; // Invalid
    }

    // Validate phone numbers (should be 10 digits)
    if (!mobilePattern.test(invoiceData.fromContact)) {
      toast.error("Invalid 'From' contact number. It should be 10 digits.");
      return false;
    }

    if (!mobilePattern.test(invoiceData.toContact)) {
      toast.error("Invalid 'To' contact number. It should be 10 digits.");
      return false;
    }

    // Validate email addresses
    if (!emailPattern.test(invoiceData.fromEmail)) {
      toast.error("Invalid 'From' email address.");
      return false;
    }

    if (!emailPattern.test(invoiceData.toEmail)) {
      toast.error("Invalid 'To' email address.");
      return false;
    }

    // Validate each item
    for (let item of invoiceData.items) {
      if (
        !item.description.trim() ||
        !item.billingDays ||
        !item.workingDays ||
        !item.rate ||
        !item.amount
      ) {
        toast.error("Please fill in all fields for each item.");
        return false;
      }
    }

    // Validate bank details
    const bank = invoiceData.bankDetails;

    // Check for missing or invalid bank details
    if (!bank.bankName.trim()) {
      toast.error("Please provide the bank name.");
      return false;
    }

    if (!bank.accountName.trim()) {
      toast.error("Please provide the account holder name.");
      return false;
    }

    // Validate account number pattern (9 to 18 digits)
    if (!accountNumberPattern.test(bank.accountNumber)) {
      toast.error(
        "Invalid account number. It should be between 9 and 18 digits."
      );
      return false;
    }

    // Validate IFSC code pattern
    if (!ifscPattern.test(bank.ifscCode)) {
      toast.error("Invalid IFSC code. Please enter a valid IFSC.");
      return false;
    }

    if (!bank.branch.trim()) {
      toast.error("Please provide the branch name.");
      return false;
    }

    return true; // All good
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("bankDetails.")) {
      const field = name.split(".")[1];
      setInvoiceData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [field]: value,
        },
      }));
    } else {
      setInvoiceData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (date) => {
    setInvoiceData((prev) => ({
      ...prev,
      invoiceDate: date || null,
    }));
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...invoiceData.items];
    updatedItems[index][name] = value;
    setInvoiceData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const calculateTotal = () => {
    let subTotal = 0;
    invoiceData.items.forEach((item) => {
      subTotal += parseFloat(item.amount) || 0;
    });

    const sgst = (subTotal * 9) / 100;
    const cgst = (subTotal * 9) / 100;
    const igst = (subTotal * 18) / 100;

    const total = subTotal + sgst + cgst + igst;
    const roundedTotal = total.toFixed(2);
    const convertToWords = numberToWords(total);

    setInvoiceData((prev) => ({
      ...prev,
      subTotal,
      sgst,
      cgst,
      igst,
      total: roundedTotal,
      amountInWords: convertToWords,
    }));
  };

  const addItem = () => {
    const newItem = {
      description: "",
      billingDays: "",
      workingDays: "",
      rate: "",
      hsnSac: "",
      gstRate: "",
      amount: "",
    };
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validate the form (optional check)
    if (!isInvoiceValid()) {
      toast.error("Please fill in all the required fields correctly.");
      setLoading(false);
      return;
    }

    const invoiceDataToSend = prepareInvoiceData(invoiceData);

    try {
      const invoiceNumber = await getlatestInvoice();
      invoiceDataToSend.invoiceNo = invoiceNumber;
    } catch (error) {
      console.error("Error fetching latest invoice number:", error);
      toast.error("Failed to fetch invoice number");

      return;
    }

    // Generate PDF and get base64 string
    let pdfBase64;
    try {
      pdfBase64 = await generatePDFBase64(invoiceDataToSend);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");

      return;
    }

    invoiceDataToSend.pdfBase64 = pdfBase64;

    // Upload invoice to server and generate PDF on success
    try {
      const response = await uploadInvoice(invoiceDataToSend);

      if (response.status !== 201) {
        throw new Error("Failed to save invoice.");
      }

      // Save the PDF using html2pdf
      const element = generatePDF(response.data.data); // Generate the DOM element from the response data
      await generateInvoicePDF(element);

      toast.success("Invoice uploaded and PDF generated successfully!");
    } catch (error) {
      console.error("Error uploading invoice:", error);
      toast.error("Failed to upload invoice");
    } finally {
      setLoading(false);
    }
  };

  const prepareInvoiceData = (invoiceData) => {
    return {
      logo: invoiceData.logo,
      invoiceDate: invoiceData.invoiceDate,
      purchaseOrderNo: invoiceData.purchaseOrderNumber,
      billingMonth: invoiceData.billingMonth,
      seller: {
        name: organizationName,
        address: invoiceData.fromAddress,
        gstin: invoiceData.fromGSTIN,
        cin: invoiceData.fromCIN,
        pan: invoiceData.fromPAN,
        contact: invoiceData.fromContact,
        email: invoiceData.fromEmail,
      },
      buyer: {
        name: invoiceData.toCompanyName,
        address: invoiceData.toAddress,
        pan: invoiceData.toPAN,
        gstin: invoiceData.toGSTIN,
        contact: invoiceData.toContact,
        email: invoiceData.toEmail,
      },
      items: invoiceData.items.map((item) => ({
        slNo: Math.floor(100000 + Math.random() * 900000),
        description: item.description,
        billingDays: item.billingDays,
        workingDays: item.workingDays,
        rate: item.rate,
        hsn_sac: item.hsnSac,
        gstRate: item.gstRate,
        amount: item.amount,
      })),
      totals: {
        subTotal: invoiceData.subTotal,
        sgst: invoiceData.sgst,
        cgst: invoiceData.cgst,
        igst: invoiceData.igst,
        discount: invoiceData.discount,
        total: invoiceData.total,
        totalInWords: invoiceData.amountInWords,
        reverseCharges: invoiceData.reverseCharges,
      },
      bankDetails: {
        bankName: invoiceData.bankDetails.bankName,
        accountName: invoiceData.bankDetails.accountName,
        accountNumber: invoiceData.bankDetails.accountNumber,
        ifsc: invoiceData.bankDetails.ifscCode,
        branch: invoiceData.bankDetails.branch,
      },
      notes: invoiceData.notes,
      status: invoiceData.invoiceStatus,
      signature: invoiceData.signature,
      source: "Manual",
    };
  };

  const uploadInvoice = async (data) => {
    return axios.post(`${baseUrl}/api/invoices/create`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const generateInvoicePDF = async (element) => {
    await html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: `invoice_${Date.now()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  const generatePDFBase64 = (data) => {
    return new Promise((resolve, reject) => {
      const element = generatePDF(data);

      if (!(element instanceof HTMLElement)) {
        reject(new Error("Invalid element type generated for PDF"));
        return;
      }

      html2pdf()
        .from(element)
        .set({
          margin: 10,
          filename: `invoice_${Date.now()}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, logging: false },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .output("datauristring")
        .then((dataUrl) => {
          // Rename to dataUrl for clarity
          // Find the index of the comma (',') which separates the prefix from the Base64 data
          const base64Index = dataUrl.indexOf(",");

          if (base64Index !== -1) {
            // Extract the string *after* the comma
            const base64Pdf = dataUrl.substring(base64Index + 1);
            resolve(base64Pdf);
          } else {
            // Handle case where comma might be missing (unlikely for a data uri)
            reject(new Error("Data URL format is unexpected."));
          }
        })
        .catch((err) => reject(err));
    });
  };

  const getlatestInvoice = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/invoices/getNewInvoiceNumber`
      );

      return res.data.data;
    } catch (error) {
      console.log("error:", error);
    }
  };

  // Fetch company list
  const handleCompanySelect = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/getAllOrganizations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.data?.data?.length > 0) {
        setCompanyList(response.data.data);
      } else {
        console.log("No company data found");
      }
    } catch (error) {
      console.error("Error fetching company details:", error.message);
      toast.error("Failed to fetch company data.");
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceData({
          ...invoiceData,
          logo: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceData({
          ...invoiceData,
          signature: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle invoice upload
  const handleUploadInvoice = async () => {
    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }
    setUploading(true);

    const getLatestInvoice = await getlatestInvoice();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("source", "PDF");
    formData.append("invoiceNo", getLatestInvoice);

    try {
      let res = await axios.post(`${baseUrl}/api/invoices/create`, formData);

      if (!res.status) {
        setError("Failed to upload invoice. Please try again.");
      }

      toast.success("Invoice uploaded successfully!");
    } catch (error) {
      console.log("Upload Error", error);
      setError("Failed to upload invoice. Please try again.");
    } finally {
      setUploading(false);
      closeModal();
      setFile(null);
      setError(null);
    }
  };

  useEffect(() => {
    handleCompanySelect();
  }, []);

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="text-center text-2xl font-bold mb-6">
        Invoice Generator
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-start space-x-6">
          {/* Logo Upload */}
          <div className="w-full max-w-xs">
            <label className="block text-lg font-medium mb-2 text-gray-700">
              Upload Logo
            </label>
            <input
              type="file"
              onChange={handleLogoUpload}
              className="border border-gray-300 rounded-md p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            {invoiceData.logo && (
              <img
                src={invoiceData.logo}
                alt="Logo"
                className="mt-4 h-20 w-auto"
              />
            )}
          </div>
          {/* Generate and uplaod Buttons */}
          <div className="flex items-end gap-3">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <FaDownload className="text-white" />
              {loading ? "Generating..." : "Generate Invoice"}
            </button>

            {/* Button to open modal */}
            <button
              type="button"
              onClick={openModal}
              className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 w-full sm:w-auto flex items-center justify-center gap-2"
              disabled={loading}
            >
              <FaUpload className="text-white" />
              Upload Invoice
            </button>

            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-auto">
                  <h2 className="text-xl font-semibold mb-4">Upload Invoice</h2>

                  {/* <div className="grid grid-cols-2 gap-4">
                    
                    <div className="mb-4">
                      <label
                        htmlFor="organizationName"
                        className="block text-gray-700"
                      >
                        Sender Name
                      </label>
                      <select
                        id="organizationName"
                        name="organizationName"
                        value={invoiceData.organizationName}
                        onChange={handleChange}
                        className="border p-2 rounded-md w-full"
                        required
                      >
                        <option value="">Select a Company</option>
                        {companyList.length > 0 ? (
                          companyList.map((company) => (
                            <option
                              key={company._id}
                              value={company.organization}
                            >
                              {company.organization}
                            </option>
                          ))
                        ) : (
                          <option disabled>No companies available</option>
                        )}
                      </select>
                    </div>

                    
                    <div className="mb-4">
                      <label
                        htmlFor="toCompanyName"
                        className="block text-gray-700"
                      >
                        Receiver Name
                      </label>
                      <input
                        type="text"
                        name="toCompanyName"
                        placeholder="Company Name"
                        value={invoiceData.toCompanyName}
                        onChange={handleChange}
                        className="border p-2 rounded-md w-full"
                        required
                      />
                    </div>
                  </div> */}

                  {/* File Input */}
                  <div className="mb-4">
                    <label
                      htmlFor="invoice-file"
                      className="block text-gray-700"
                    >
                      Invoice PDF
                    </label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                  </div>

                  {/* Error or loading state */}
                  {error && <p className="text-red-500 mt-2">{error}</p>}

                  {/* Buttons */}
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleUploadInvoice}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                      disabled={uploading}
                    >
                      {uploading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Information */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4 mt-4">
            <DatePicker
              selected={invoiceData.invoiceDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy" // Custom date format
              placeholderText=" Invoice Date DD/MM/YYYY" // Placeholder text
              className="border p-2 rounded-md w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="purchaseOrderNumber"
              placeholder="Purchase/Work Order Number"
              value={invoiceData.purchaseOrderNumber}
              onChange={handleChange}
              className="border p-2 rounded-md"
              required
            />
            <input
              type="text"
              name="billingMonth"
              placeholder="Billing Month"
              value={invoiceData.billingMonth}
              onChange={handleChange}
              className="border p-2 rounded-md"
              required
            />
          </div>
        </div>

        {/* Line Above */}
        <hr className="border-t-2 border-gray-300 mb-4" />

        {/* Sender Details */}
        <div className="space-y-4 mb-6">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowSender(!showSender)}
          >
            <div className="text-lg font-semibold">
              Sender Details (Bill From)
            </div>
            <span className="text-gray-500">{showSender ? "▲" : "▼"}</span>
          </div>

          {showSender && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  id="companyName"
                  name="organizationName"
                  value={invoiceData.organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="border p-2 rounded-md w-full"
                  required
                >
                  <option value="">Select a Company</option>
                  {companyList.length > 0 ? (
                    companyList.map((company) => (
                      <option key={company._id} value={company.organization}>
                        {company.organization}
                      </option>
                    ))
                  ) : (
                    <option disabled>No companies available</option>
                  )}
                </select>
                <input
                  type="text"
                  name="fromAddress"
                  placeholder="Address"
                  value={invoiceData.fromAddress}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  name="fromPAN"
                  placeholder="PAN"
                  value={invoiceData.fromPAN}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                  required
                />
                <input
                  type="text"
                  name="fromGSTIN"
                  placeholder="GSTIN"
                  value={invoiceData.fromGSTIN}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                  required
                />
                <input
                  type="text"
                  name="fromCIN"
                  placeholder="CIN"
                  value={invoiceData.fromCIN}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fromContact"
                  placeholder="Contact Number"
                  value={invoiceData.fromContact}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                  required
                />
                <input
                  type="email"
                  name="fromEmail"
                  placeholder="Email"
                  value={invoiceData.fromEmail}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Line Above Bank Details */}
        <hr className="border-t-2 border-gray-300 mb-4" />

        {/* Receiver Details */}
        <div className="space-y-4 mb-6">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowReceiver(!showReceiver)}
          >
            <div className="text-lg font-semibold">
              Receiver Details (Bill To)
            </div>
            <span className="text-gray-500">{showReceiver ? "▲" : "▼"}</span>
          </div>

          {showReceiver && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="toCompanyName"
                  placeholder="Company Name"
                  value={invoiceData.toCompanyName}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                  required
                />
                <input
                  type="text"
                  name="toAddress"
                  placeholder="Address"
                  value={invoiceData.toAddress}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="toPAN"
                  placeholder="PAN"
                  value={invoiceData.toPAN}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                  required
                />
                <input
                  type="text"
                  name="toGSTIN"
                  placeholder="GSTIN"
                  value={invoiceData.toGSTIN}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="toContact"
                  placeholder="Contact Number"
                  value={invoiceData.toContact}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                  required
                />
                <input
                  type="email"
                  name="toEmail"
                  placeholder="Email"
                  value={invoiceData.toEmail}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Line Above Bank Details */}
        <hr className="border-t-2 border-gray-300 mb-2" />

        {/* Item Details */}
        <div className="space-y-4 mb-6">
          {/* Toggle Header */}
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowItemDetails(!showItemDetails)}
          >
            <div className="text-lg font-semibold mt-4">Item Details</div>
            <div className="flex justify-end gap-4">
              <button
                onClick={addItem}
                className="px-4 py-2 bg-gray-200 rounded-md flex items-center gap-2"
              >
                <FaPlus />
              </button>
              <span className="text-gray-500">
                {showItemDetails ? "▲" : "▼"}
              </span>
            </div>
          </div>

          {/* Item Details Section */}
          {showItemDetails && (
            <div className="space-y-4">
              {/* Item Fields */}
              {invoiceData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-7 gap-4 mb-4">
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(e, index)}
                    className="border p-2 rounded-md"
                    required
                  />
                  <input
                    type="number"
                    name="billingDays"
                    placeholder="Billing Days"
                    value={item.billingDays}
                    onChange={(e) => handleItemChange(e, index)}
                    className="border p-2 rounded-md"
                    required
                  />
                  <input
                    type="number"
                    name="workingDays"
                    placeholder="Working Days"
                    value={item.workingDays}
                    onChange={(e) => handleItemChange(e, index)}
                    className="border p-2 rounded-md"
                    required
                  />
                  <input
                    type="number"
                    name="rate"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => handleItemChange(e, index)}
                    className="border p-2 rounded-md"
                    required
                  />
                  <input
                    type="text"
                    name="hsnSac"
                    placeholder="HSN/SAC"
                    value={item.hsnSac}
                    onChange={(e) => handleItemChange(e, index)}
                    className="border p-2 rounded-md"
                    required
                  />
                  <input
                    type="number"
                    name="gstRate"
                    placeholder="GST Rate"
                    value={item.gstRate}
                    onChange={(e) => handleItemChange(e, index)}
                    className="border p-2 rounded-md"
                    required
                  />
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount (INR)"
                    value={item.amount}
                    onChange={(e) => handleItemChange(e, index)}
                    onBlur={calculateTotal}
                    className="border p-2 rounded-md"
                    required
                  />
                </div>
              ))}

              {/* Subtotal, Taxes & Total */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>SubTotal: {invoiceData.subTotal}</div>
                  <div>SGST: {invoiceData.sgst}</div>
                  <div>CGST: {invoiceData.cgst}</div>
                  <div>IGST: {invoiceData.igst}</div>
                  <div>IGST: {invoiceData.discount}</div>
                  <div className="font-semibold">
                    Total: {invoiceData.total}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Line Above Bank Details */}
        <hr className="border-t-2 border-gray-300 mt-4" />
        {/* Bank Details */}
        <div className="space-y-4 mb-6">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowBankDetails(!showBankDetails)}
          >
            <div className="text-lg font-semibold mt-4">Bank Details</div>
            <span className="text-gray-500">{showBankDetails ? "▲" : "▼"}</span>
          </div>

          {showBankDetails && (
            <div className="space-y-4">
              <input
                type="text"
                name="bankDetails.bankName" // Name should be "bankDetails.bankName"
                placeholder="Bank Name"
                value={invoiceData.bankDetails.bankName}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
                required
              />
              <input
                type="text"
                name="bankDetails.accountName" // Name should be "bankDetails.accountName"
                placeholder="Account Name"
                value={invoiceData.bankDetails.accountName}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="bankDetails.accountNumber" // Name should be "bankDetails.accountNumber"
                  placeholder="Account Number"
                  value={invoiceData.bankDetails.accountNumber}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                  required
                />
                <input
                  type="text"
                  name="bankDetails.ifscCode" // Name should be "bankDetails.ifscCode"
                  placeholder="IFSC Code"
                  value={invoiceData.bankDetails.ifscCode}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                  required
                />
              </div>
              <input
                type="text"
                name="bankDetails.branch" // Name should be "bankDetails.branch"
                placeholder="Branch"
                value={invoiceData.bankDetails.branch}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
                required
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <input
            type="text"
            name="notes" // Name should be "bankDetails.branch"
            placeholder="Note"
            value={invoiceData.notes}
            onChange={handleChange}
            className="border p-2 rounded-md w-full"
          />
        </div>

        {/* Signature  status */}
        <div className="flex justify-between mt-2">
          <div className="mb-6">
            <label className="block text-lg font-medium mt-2">
              Upload Signature
            </label>
            <input
              type="file"
              onChange={handleSignatureUpload}
              className="border p-2 rounded-md w-full"
              required
            />
            {invoiceData.signature && (
              <img
                src={invoiceData.signature}
                alt="Signature"
                className="mt-4 h-20"
              />
            )}
          </div>
          <div className="mb-6">
            <div className="block text-lg font-medium mt-2">Status</div>
            <select
              name="invoiceStatus"
              value={invoiceData.invoiceStatus}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Status</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Invoice;
