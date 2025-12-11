export const numberToWords = (num) => {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const thousands = ["", "Thousand", "Million", "Billion"];

  if (num === 0) return "Zero";

  let words = "";
  let decimalWords = "";

  // Handle the integer part (before the decimal)
  let integerPart = Math.floor(num);

  function convertHundreds(num) {
    let result = "";
    if (num >= 100) {
      result += ones[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }
    if (num >= 20) {
      result += tens[Math.floor(num / 10)] + " ";
      num %= 10;
    }
    if (num > 0) {
      result += ones[num] + " ";
    }
    return result.trim();
  }

  // Handle large numbers by splitting them into chunks
  let chunkIndex = 0;
  while (integerPart > 0) {
    if (integerPart % 1000 !== 0) {
      words =
        convertHundreds(integerPart % 1000) +
        (thousands[chunkIndex] ? " " + thousands[chunkIndex] : "") +
        " " +
        words;
    }
    integerPart = Math.floor(integerPart / 1000);
    chunkIndex++;
  }

  // Handle the decimal part (after the decimal) as paisa
  let decimalPart = num % 1;
  if (decimalPart > 0) {
    decimalPart = Math.round(decimalPart * 100); // Round to 2 decimal places
    decimalWords = `and ${convertHundreds(decimalPart)} Paisa Only`;
  }

  return words.trim() + (decimalWords ? " " + decimalWords : "");
};

export const generatePDF = (props) => {
  const {
    logo,
    seller,
    invoiceNo,
    invoiceDate,
    purchaseOrderNo,
    billingMonth,
    buyer,
    items,
    totals,
    bankDetails,
    signature,
  } = props;

  // Dynamically populate the values in the HTML content
  const htmlContent = `
    <div class="font-sans bg-gray-100 py-4 px-4">
      <div class="border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <!-- Header Section -->
        <div class="flex justify-between items-center border-b border-gray-300 bg-gray-50 px-6 py-4">
          <h1 class="text-xl font-semibold tracking-wide text-gray-800">TAX INVOICE</h1>
          <span class="text-gray-600 text-sm">Invoice Date: ${invoiceDate}</span>
        </div>
        <!-- Seller Details -->
        <div class="flex p-6 gap-12 border-b border-gray-300">
          <!-- Logo Section -->
          <div class="flex-shrink-0">
            <img src="${logo}" alt="Logo" class="w-32 h-auto object-contain border border-gray-200 rounded-md p-2" />
          </div>
          <!-- Company Info Section -->
          <div class="text-sm text-gray-800 leading-relaxed">
            <p class="font-semibold text-lg mb-2">${seller.name}</p>
            <p>${seller.address}</p>
            <p><span class="font-medium">GSTIN:</span> ${seller.gstin}</p>
            <p><span class="font-medium">CIN:</span> ${seller.cin}</p>
            <p><span class="font-medium">PAN:</span> ${seller.pan}</p>
            <p><span class="font-medium">Contact:</span> ${seller.contact}</p>
            <p><span class="font-medium">Email:</span> ${seller.email}</p>
          </div>
          <!-- Additional Invoice Info -->
          <div class="border-l border-gray-300 pl-6 space-y-3 text-sm text-gray-700">
            <p><strong>Invoice No:</strong> <span class="ml-2">${invoiceNo}</span></p>
            <p><strong>Purchase / Work Order No:</strong> <span class="ml-2">${purchaseOrderNo}</span></p>
            <p><strong>Billing Month:</strong> <span class="ml-2">${billingMonth}</span></p>
          </div>
        </div>
        <!-- Buyer Details -->
        <div class="p-6 border-b border-gray-300 bg-gray-50">
          <p class="font-semibold text-lg text-gray-800">Bill To / Ship To</p>
          <p class="font-semibold text-gray-700">${buyer.name}</p>
          <p class="text-gray-600">${buyer.address}</p>
          <p><span class="font-medium">PAN:</span> ${buyer.pan}</p>
          <p><span class="font-medium">GSTIN:</span> ${buyer.gstin}</p>
          <p><span class="font-medium">Contact:</span> ${buyer.contact}</p>
          <p><span class="font-medium">Email:</span> ${buyer.email}</p>
        </div>
        <!-- Items Table -->
        <table class="w-full border-collapse border-t border-gray-300 text-sm text-left">
          <thead class="bg-gray-100">
            <tr>
              <th class="border-b border-gray-300 px-4 py-3 text-sm text-gray-700">Sl No.</th>
              <th class="border-b border-gray-300 px-4 py-3 text-sm text-gray-700">Particulars</th>
              <th class="border-b border-gray-300 px-4 py-3 text-sm text-gray-700">Billing Days</th>
              <th class="border-b border-gray-300 px-4 py-3 text-sm text-gray-700">Working Days</th>
              <th class="border-b border-gray-300 px-4 py-3 text-sm text-gray-700">Rate</th>
              <th class="border-b border-gray-300 px-4 py-3 text-sm text-gray-700">HSN / SAC</th>
              <th class="border-b border-gray-300 px-4 py-3 text-sm text-gray-700">GST Rate</th>
              <th class="border-b border-gray-300 px-4 py-3 text-sm text-gray-700">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item, index) => `
              <tr class="bg-white hover:bg-gray-50">
                <td class="border-b border-gray-300 px-4 py-3">${index + 1}</td>
                <td class="border-b border-gray-300 px-4 py-3">${
                  item.description
                }</td>
                <td class="border-b border-gray-300 px-4 py-3">${
                  item.billingDays
                }</td>
                <td class="border-b border-gray-300 px-4 py-3">${
                  item.workingDays
                }</td>
                <td class="border-b border-gray-300 px-4 py-3">${item.rate}</td>
                <td class="border-b border-gray-300 px-4 py-3">${
                  item.hsn_sac
                }</td>
                <td class="border-b border-gray-300 px-4 py-3">${
                  item.gstRate
                }</td>
                <td class="border-b border-gray-300 px-4 py-3">${
                  item.amount
                }</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
        <!-- Totals Section -->
        <div class="p-6 border-t border-gray-300 bg-gray-50">
          <div class="grid grid-cols-2 gap-6">
            <div class="text-left text-gray-800">
              <p><strong>Sub-Total:</strong> ${totals.subTotal}</p>
              <p><strong>SGST:</strong> ${totals.sgst}</p>
              <p><strong>CGST:</strong> ${totals.cgst}</p>
              <p><strong>IGST:</strong> ${totals.igst}</p>
              <p><strong>Discount:</strong> ${totals.discount}</p>
            </div>
            <div class="text-right text-gray-800">
              <p class="text-lg font-semibold"><strong>Total (INR):</strong> ${
                totals.total
              }</p>
              <p><strong>Total in Words:</strong> ${totals.totalInWords}</p>
            </div>
          </div>
        </div>
        <!-- Bank Details Section -->
        <div class="p-6 border-t border-gray-300 bg-gray-50">
          <p class="font-semibold text-lg text-gray-800 mb-4">Bank Details for Payment</p>
          <p><strong>Bank Name:</strong> ${bankDetails.bankName}</p>
          <p><strong>Account Name:</strong> ${bankDetails.accountName}</p>
          <p><strong>Account No.:</strong> ${bankDetails.accountNumber}</p>
          <p><strong>IFSC:</strong> ${bankDetails.ifsc}</p>
          <p><strong>Branch:</strong> ${bankDetails.branch}</p>
        </div>
        <!-- Signature Section -->
        <div class="p-6 border-t border-gray-300 flex flex-col items-end bg-gray-50">
          <p class="mb-2 text-gray-800">For <strong>${seller.name}</strong></p>
          <img src="${signature}" alt="Signature" class="w-32 mt-4" />
          <p class="mt-2 text-gray-700">(Authorised Signatory)</p>
        </div>
      </div>
    </div>
  `;

  // Create a temporary DOM element to hold the HTML content
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;

  return tempDiv; // Return the created DOM element
};
