import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";
import FilterDateMonth from "../components/FilterDateMonth";
import { Search } from "lucide-react";
import { baseUrl } from "../api";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";

const CompanyInvoiceList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logo, organization, industry } = location.state || {};
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setsearch] = useState("");
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

      // Filter invoices by selected organization (company)
      const filteredInvoices = data.filter(
        (invoice) => invoice.seller?.name === organization
      );

      setInvoices(filteredInvoices || []);
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
  }, [filters, pagination.page, organization]);

  useEffect(() => {
    fetchInvoices();
  }, [filters, pagination.page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Update the search if it's the input field
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset pagination to the first page whenever filter changes
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

  return (
  <div className="container mx-auto p-4">
  <div className="flex-shrink-0">
    <div className="p-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Company Header */}
      <div className="flex justify-between gap-5 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-5">
          {/* Company Logo */}
          {logo ? (
            <img
              src={logo}
              alt={organization}
              className="w-16 h-16 object-contain rounded-full border border-gray-300"
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold text-lg">
              {organization?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Company Info */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer">
              {organization || "Andgate Informatics Pvt Ltd"}
            </h2>
            <p className="text-base text-gray-600 font-medium mt-0.5">
              {industry || "Semiconductor"}
            </p>
          </div>
        </div>
      </div>
   

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
        {/* Search and Filters */}
        {/* <div className="relative flex-1 w-full sm:w-32">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200 hover:border-blue-500"
            placeholder="Search by invoice no"
            value={filters.invoiceNo}
            name="invoiceNo"
            onChange={handleFilterChange}
          />
        </div> */}
        <div className="relative flex-1 w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200 hover:border-blue-500"
            placeholder="Search by seller and buyer name"
            value={filters.search}
            name="search"
            onChange={handleFilterChange}
          />
        </div>
        <div className="w-full sm:w-auto">
          <FilterDateMonth
            startDate={filters.startDate}
            endDate={filters.endDate}
            setStartDate={(date) => handleDateFilter(date, filters.endDate)}
            setEndDate={(date) => handleDateFilter(filters.startDate, date)}
            getAllData={fetchInvoices}
          />
        </div>
        <div className="w-full sm:w-32">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ease-in-out duration-200 hover:border-indigo-500"
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
  </div>

  {/* Pagination */}
  <div className="mb-4">
    <Pagination
      currentPage={pagination.page}
      totalPages={pagination.pages}
      onPrevious={() => handlePageChange(Math.max(pagination.page - 1, 1))}
      onNext={() =>
        handlePageChange(Math.min(pagination.page + 1, pagination.pages))
      }
    />
  </div>

  <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-6">
    {loading ? (
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
                <th className="px-6 py-4 text-left font-semibold">Invoice No.</th>
                <th className="px-6 py-4 text-left font-semibold">Date</th>
                <th className="px-6 py-4 text-left font-semibold">Seller</th>
                <th className="px-6 py-4 text-left font-semibold">Buyer</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No invoices available.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.invoiceNo} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-700">{invoice.invoiceNo}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {invoice.createdAt
                        ? moment(invoice.createdAt).format("LLLL")
                        : "Date not available"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{invoice.seller?.name || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-700">{invoice.buyer?.name || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full font-semibold ${
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
                    <td className="px-6 py-4 text-center">
                      <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none transition duration-200"
                        onClick={() => handleViewInvoice(invoice.invoiceNo)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Card Layout for Smaller Screens */}
        <div className="sm:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {invoices.length === 0 ? (
            <div className="text-center text-gray-500 py-6">No invoices available.</div>
          ) : (
            invoices.map((invoice) => (
              <div
                key={invoice.invoiceNo}
                className="bg-white rounded-lg border border-gray-200 shadow-md p-5 mb-5 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg"
              >
                {/* Invoice Header */}
                <div className="flex justify-between items-center mb-3">
                  <div className="text-xl font-semibold text-gray-800">
                    <span className="text-indigo-600">Invoice No:</span> {invoice.invoiceNo}
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
                    <strong className="text-gray-600">Seller:</strong> {invoice.seller?.name || "N/A"}
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong className="text-gray-600">Buyer:</strong> {invoice.buyer?.name || "N/A"}
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong className="text-gray-600">Status:</strong>
                    <span
                      className={`px-3  rounded-full font-semibold ${
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
                <div className="flex justify-end mt-4 border-t pt-4">
                  <button
                    className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none transition-all duration-300"
                    onClick={() => handleViewInvoice(invoice.invoiceNo)}
                  >
                    <i className="fa fa-eye mr-2"></i> View Invoice
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )}
  </div>
</div>

  );
};

export default CompanyInvoiceList;
