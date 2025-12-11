import { useState } from "react";
import { baseUrl } from "../api";

const InvoicePreview = ({ handleClosePreview }) => {
  const [loading, setLoading] = useState(false);
  const handleGenerateInvoice = async () => {
    // Call generate invoice logic
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/invoices/create`,
        invoiceData
      );
      // Handle the response for invoice generation
      const element = generatePDF(response.data);
      await html2pdf().from(element).save();
      toast.success("Invoice generated successfully!");
    } catch (error) {
      toast.error("Error generating invoice.");
    } finally {
      setLoading(false);
      handleClosePreview();
    }
  };

  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
      <div id="invoice-preview" className="font-sans bg-gray-100 py-4 px-4">
        {/* Invoice Header Section */}
        <div className="border-b border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <div className="flex justify-between items-center border-b border-gray-300 bg-gray-50 px-6 py-4">
            <h1 className="text-xl font-semibold tracking-wide text-gray-800">
              TAX INVOICE
            </h1>
            <span className="text-gray-600 text-sm">
              Invoice Date: {invoiceData.invoiceDate}
            </span>
          </div>

          {/* Seller Details */}
          <div className="flex p-6 gap-12 border-b border-gray-300">
            <div className="flex-shrink-0">
              <img
                src={invoiceData.logo}
                alt="Logo"
                className="w-32 h-auto object-contain border border-gray-200 rounded-md p-2"
              />
            </div>
            <div className="text-sm text-gray-800 leading-relaxed">
              <p className="font-semibold text-lg mb-2">
                {invoiceData.seller.name}
              </p>
              <p>{invoiceData.seller.address}</p>
              <p>
                <span className="font-medium">GSTIN:</span>{" "}
                {invoiceData.seller.gstin}
              </p>
              <p>
                <span className="font-medium">CIN:</span>{" "}
                {invoiceData.seller.cin}
              </p>
              <p>
                <span className="font-medium">PAN:</span>{" "}
                {invoiceData.seller.pan}
              </p>
              <p>
                <span className="font-medium">Contact:</span>{" "}
                {invoiceData.seller.contact}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {invoiceData.seller.email}
              </p>
            </div>
            <div className="border-l border-gray-300 pl-6 space-y-3 text-sm text-gray-700">
              <p>
                <strong>Invoice No:</strong> {invoiceData.invoiceNo}
              </p>
              <p>
                <strong>Purchase / Work Order No:</strong>{" "}
                {invoiceData.purchaseOrderNo}
              </p>
              <p>
                <strong>Billing Month:</strong> {invoiceData.billingMonth}
              </p>
            </div>
          </div>

          {/* Buyer Details */}
          <div className="p-6 border-b border-gray-300 bg-gray-50">
            <p className="font-semibold text-lg text-gray-800">
              Bill To / Ship To
            </p>
            <p className="font-semibold text-gray-700">
              {invoiceData.buyer.name}
            </p>
            <p className="text-gray-600">{invoiceData.buyer.address}</p>
            <p>
              <span className="font-medium">PAN:</span> {invoiceData.buyer.pan}
            </p>
            <p>
              <span className="font-medium">GSTIN:</span>{" "}
              {invoiceData.buyer.gstin}
            </p>
            <p>
              <span className="font-medium">Contact:</span>{" "}
              {invoiceData.buyer.contact}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {invoiceData.buyer.email}
            </p>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse border-t border-gray-300 text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b border-gray-300 px-4 py-3">Sl No.</th>
                <th className="border-b border-gray-300 px-4 py-3">
                  Particulars
                </th>
                <th className="border-b border-gray-300 px-4 py-3">
                  Billing Days
                </th>
                <th className="border-b border-gray-300 px-4 py-3">
                  Working Days
                </th>
                <th className="border-b border-gray-300 px-4 py-3">Rate</th>
                <th className="border-b border-gray-300 px-4 py-3">
                  HSN / SAC
                </th>
                <th className="border-b border-gray-300 px-4 py-3">GST Rate</th>
                <th className="border-b border-gray-300 px-4 py-3">
                  Amount (INR)
                </th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index} className="bg-white hover:bg-gray-50">
                  <td className="border-b border-gray-300 px-4 py-3">
                    {index + 1}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3">
                    {item.description}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3">
                    {item.billingDays}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3">
                    {item.workingDays}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3">
                    {item.rate}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3">
                    {item.hsn_sac}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3">
                    {item.gstRate}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3">
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Section */}
          <div className="p-6 border-t border-gray-300 bg-gray-50">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-left text-gray-800">
                <p>
                  <strong>Sub-Total:</strong> {invoiceData.totals.subTotal}
                </p>
                <p>
                  <strong>SGST:</strong> {invoiceData.totals.sgst}
                </p>
                <p>
                  <strong>CGST:</strong> {invoiceData.totals.cgst}
                </p>
                <p>
                  <strong>IGST:</strong> {invoiceData.totals.igst}
                </p>
                <p>
                  <strong>Discount:</strong> {invoiceData.totals.discount}
                </p>
              </div>
              <div className="text-right text-gray-800">
                <p className="text-lg font-semibold">
                  <strong>Total (INR):</strong> {invoiceData.totals.total}
                </p>
                <p>
                  <strong>Total in Words:</strong>{" "}
                  {invoiceData.totals.totalInWords}
                </p>
              </div>
            </div>
          </div>

          {/* Bank Details Section */}
          <div className="p-6 border-t border-gray-300 bg-gray-50">
            <p className="font-semibold text-lg text-gray-800 mb-4">
              Bank Details for Payment
            </p>
            <p>
              <strong>Bank Name:</strong> {invoiceData.bankDetails.bankName}
            </p>
            <p>
              <strong>Account Name:</strong>{" "}
              {invoiceData.bankDetails.accountName}
            </p>
            <p>
              <strong>Account No.:</strong>{" "}
              {invoiceData.bankDetails.accountNumber}
            </p>
            <p>
              <strong>IFSC:</strong> {invoiceData.bankDetails.ifsc}
            </p>
            <p>
              <strong>Branch:</strong> {invoiceData.bankDetails.branch}
            </p>
          </div>

          {/* Signature Section */}
          <div className="p-6 border-t border-gray-300 flex flex-col items-end bg-gray-50">
            <p className="mb-2 text-gray-800">
              For <strong>{invoiceData.seller.name}</strong>
            </p>
            <img
              src={invoiceData.signature}
              alt="Signature"
              className="w-32 mt-4"
            />
            <p className="mt-2 text-gray-700">(Authorised Signatory)</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <button
          onClick={() => setShowPreview(false)}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg"
        >
          Close
        </button>
        <button
          onClick={handleGenerateInvoice}
          className="px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          Confirm & Generate Invoice
        </button>
      </div>
    </div>
  </div>;
};
export default InvoicePreview;
