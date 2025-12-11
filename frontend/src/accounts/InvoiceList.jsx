import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";
import FilterDateMonth from "../components/FilterDateMonth";
import { Search } from "lucide-react";
import { baseUrl } from "../api";
import moment from "moment";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { toast } from "react-toastify";
import InvoiceDetails from "./InvoiceDetails";

const InvoiceList = ({ invoice }) => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({
    buyer: "",
    seller: "",
    invoiceNo: "",
    status: "",
    startDate: null,
    endDate: null,
  });

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { page } = pagination;

      const response = await axios.get(`${baseUrl}/api/invoices/all`, {
        params: { page, ...filters },
      });

      const { data, pagination: serverPagination } = response.data || {};
      setInvoices(data || []);
      setPagination((prev) => ({
        ...prev,
        total: serverPagination?.total || 0,
        pages: serverPagination?.pages || 1,
      }));
    } catch (err) {
      console.error("Error fetching invoices", err);
      setError("Failed to fetch invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page]);

  const handleShareInvoice = async (e) => {
    e.preventDefault();
    // Check if invoiceId is available
    if (!invoiceId || !invoiceId._id) {
      toast.error("Invoice ID is missing.");
      return;
    }

    // Validate the email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true); // Set loading state

    try {
      const response = await axios.post(
        `${baseUrl}/api/invoices/send-email`,
        {
          email: email,
          invoiceId: invoiceId._id, // Use the invoice ID here
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle success and failure response
      if (response.status === 200) {
        toast.success("Invoice sent successfully!");
      } else {
        toast.error("Failed to send invoice. Please try again.");
      }
    } catch (error) {
      console.error("Failed to send invoice:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false); // Reset loading state
      setShowModal(false); // Close the modal
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [filters, pagination.page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDateFilter = (startDate, endDate) => {
    setFilters((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleViewInvoice = async (id) => {
    try {
      const res = await axios.get(`${baseUrl}/api/invoices/${id}`);

      if (!res.status) {
        toast.error("Failed to fetch invoice number");
      }

      setSelectedInvoice(res.data.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="">
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-3xl font-semibold text-gray-800">Invoice List</h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out hover:border-indigo-500"
                placeholder="Search by seller and buyer name"
                value={filters.search}
                name="search"
                onChange={handleFilterChange}
              />
            </div>

            {/* Filter by Date */}
            <div className="w-full sm:w-auto">
              <FilterDateMonth
                startDate={filters.startDate}
                endDate={filters.endDate}
                setStartDate={(date) => handleDateFilter(date, filters.endDate)}
                setEndDate={(date) => handleDateFilter(filters.startDate, date)}
                getAllData={fetchInvoices}
              />
            </div>

            {/* Filter by Status */}
            <div className="w-full sm:w-32">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out hover:border-indigo-500"
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
        </div>

        {/* Pagination */}
        <div className="mb-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPrevious={() =>
              handlePageChange(Math.max(pagination.page - 1, 1))
            }
            onNext={() =>
              handlePageChange(Math.min(pagination.page + 1, pagination.pages))
            }
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-xl rounded-lg mt-6">
        {loading ? (
          // Skeleton Loader for both Table and Cards
         <div className="space-y-4">
        {/* Skeleton Loader for Larger Screens (Table format) */}
        <table className="hidden sm:table w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Invoice No.</th>
              <th className="px-6 py-4 text-left font-semibold">Date</th>
              <th className="px-6 py-4 text-left font-semibold">Seller</th>
              <th className="px-6 py-4 text-left font-semibold">Buyer</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-pulse">
                {[...Array(6)].map((_, colIndex) => (
                  <td key={colIndex} className="py-4 px-2">
                    <div className="w-full h-6 bg-gray-200 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Skeleton Loader for Smaller Screens (Card format) */}
        <div className="sm:hidden">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse space-y-4 mb-4 p-4 border-b border-gray-200"
            >
              <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
              <div className="mt-2 space-y-2">
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
        ) : (
          <div>
            {/* Table Layout for Larger Screens */}
            <div className="hidden sm:block">
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-md tracking-wide">
                      Invoice No.
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-md tracking-wide">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-md tracking-wide">
                      Seller Company
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-md tracking-wide">
                      Buyer Company
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-md tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-md tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {invoices.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No invoices available.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((invoice) => (
                      <tr
                        key={invoice._id}
                        className="border-t hover:bg-gray-50 transition-all duration-300 ease-in-out"
                      >
                        <td className="px-6 py-4 text-gray-700">
                          {invoice.invoiceNo}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {invoice.createdAt
                            ? moment(invoice.createdAt).format("LLLL")
                            : "Date not available"}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {invoice.seller?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {invoice.buyer?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full font-semibold text-sm ${
                              invoice.status === "Paid"
                                ? "bg-green-100 text-green-800"
                                : invoice.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : invoice.status === "Overdue"
                                ? "bg-red-100 text-red-800"
                                : invoice.status === "Cancelled"
                                ? "bg-gray-100 text-gray-800"
                                : invoice.status === "Draft"
                                ? "bg-blue-100 text-blue-800"
                                : ""
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center flex justify-center items-center space-x-4">
                          <button
                            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none transition-all duration-200"
                            onClick={() => handleViewInvoice(invoice._id)}
                          >
                            View
                          </button>
                          <FaRegShareFromSquare
                            className="cursor-pointer hover:text-indigo-700"
                            onClick={() => {
                              setInvoiceId(invoice); // Set the selected invoice
                              setShowModal(true); // Show modal with the selected invoice
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Card Layout for Smaller Screens */}
            <div className="sm:hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {invoices.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  No invoices available.
                </div>
              ) : (
                invoices.map((invoice) => (
                  <div
                    key={invoice.invoiceNo}
                    className="bg-white rounded-lg border border-gray-200 shadow-lg p-6 mb-6 transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-xl"
                  >
                    {/* Invoice Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xl font-semibold text-gray-800">
                        <span className="text-indigo-600">Invoice No:</span>{" "}
                        {invoice.invoiceNo}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Issued: </span>
                        {invoice.createdAt
                          ? moment(invoice.createdAt).format("LLLL")
                          : "Date not available"}
                      </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="mb-4 space-y-2">
                      <div className="text-sm text-gray-700">
                        <strong className="text-gray-600">Seller:</strong>{" "}
                        {invoice.seller?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-700">
                        <strong className="text-gray-600">Buyer:</strong>{" "}
                        {invoice.buyer?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-700">
                        <strong className="text-gray-600">Status:</strong>
                        <span
                          className={`px-3 py-1 rounded-full font-semibold text-sm ${
                            invoice.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : invoice.status === "Overdue"
                              ? "bg-red-100 text-red-800"
                              : invoice.status === "Cancelled"
                              ? "bg-gray-100 text-gray-800"
                              : invoice.status === "Draft"
                              ? "bg-blue-100 text-blue-800"
                              : ""
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </div>

                    {/* Footer Section */}
                    <div className="flex justify-between items-center mt-4 border-t pt-4">
                      {/* View Invoice Button */}
                      <button
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none transition-all duration-300"
                        onClick={() => handleViewInvoice(invoice._id)}
                      >
                        <i className="fa fa-eye mr-2"></i> View Invoice
                      </button>

                      {/* Share Icon */}
                      <FaRegShareFromSquare
                        className="cursor-pointer hover:text-indigo-700"
                        onClick={() => {
                          setInvoiceId(invoice); // Set the selected invoice
                          setShowModal(true); // Show modal with the selected invoice
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {selectedInvoice && (
        <InvoiceDetails
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* Show the input box if showModal is true */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out opacity-100">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96 relative">
            {/* Close Icon */}
            <button
              className="absolute top-4 right-4 p-2 bg-transparent border-2 border-gray-300 rounded-full text-gray-600 hover:bg-gray-200 transition duration-300 ease-in-out"
              onClick={() => setShowModal(false)}
              aria-label="Close Modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 20 20"
                className="text-gray-600 hover:text-gray-800"
              >
                <path
                  fillRule="evenodd"
                  d="M10 8.586l4.707-4.707 1.414 1.414L11.414 10l4.707 4.707-1.414 1.414L10 11.414l-4.707 4.707-1.414-1.414L8.586 10 3.879 5.293 5.293 3.88 10 8.586z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
              Share Invoice
            </h2>

            {/* Form to capture email and handle submission */}
            <form onSubmit={(e) => handleShareInvoice(e)} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Enter recipient's email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 transition-all"
                >
                  {isLoading ? (
                    <span className="flex justify-center items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="animate-spin h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 2v4m0 0v4m0 0V6m0 4l4 4-4-4zm0 0L8 6l4 4z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Invoice"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
