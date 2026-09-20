document.addEventListener("DOMContentLoaded", function () {
  // Mock data representing sales records. In a real app, this would come from an API.
  const mockSalesData = [
    {
      saleId: 1,
      customerName: "Alice Johnson",
      saleDate: "2024-05-20T10:30:00",
      totalAmount: 3.75,
    },
    {
      saleId: 2,
      customerName: "Bob Williams",
      saleDate: "2024-05-21T14:00:00",
      totalAmount: 5.0,
    },
    {
      saleId: 3,
      customerName: "Walk-in Customer", // Handled from NULL CustomerID
      saleDate: "2024-05-22T09:15:00",
      totalAmount: 4.7,
    },
    // --- New Indian Customer Data ---
    {
      saleId: 4,
      customerName: "Priya Sharma",
      saleDate: "2024-05-23T11:00:00",
      totalAmount: 150.5,
    },
    {
      saleId: 5,
      customerName: "Rohan Kumar",
      saleDate: "2024-05-24T16:45:00",
      totalAmount: 320.0,
    },
    {
      saleId: 6,
      customerName: "Walk-in Customer",
      saleDate: "2024-05-25T12:00:00",
      totalAmount: 85.0,
    },
  ];

  const salesTableBody = document.getElementById("sales-table-body");
  const searchInput = document.getElementById("searchSalesInput");
  const newSaleButton = document.getElementById("new-sale-btn");
  const modal = document.getElementById("new-sale-modal");
  const closeModalButton = document.querySelector(".close-button");
  const newSaleForm = document.getElementById("new-sale-form");
  const customerNameInput = document.getElementById("customerName");
  const totalAmountInput = document.getElementById("totalAmount");

  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    // Use 'en-IN' for Indian-style date formatting, or 'en-US' for US-style
    return new Date(dateString).toLocaleDateString("en-IN", options);
  }

  function formatCurrency(amount) {
    // Simple check to decide currency symbol based on typical amounts
    // In a real app, this would be handled more robustly (e.g., based on sale location)
    const currencySymbol = amount > 50 ? "₹" : "$";
    return `${currencySymbol}${amount.toFixed(2)}`;
  }

  function populateSalesTable(data) {
    salesTableBody.innerHTML = ""; // Clear existing rows

    if (data.length === 0) {
      salesTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No sales records found.</td></tr>`;
      return;
    }

    data.forEach((sale) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>#${sale.saleId}</td>
        <td>${sale.customerName}</td>
        <td>${formatDate(sale.saleDate)}</td>
        <td>${formatCurrency(sale.totalAmount)}</td>
      `;
      // You could add a click event listener to the row to show sale details
      // row.addEventListener('click', () => showSaleDetails(sale.saleId));
      salesTableBody.appendChild(row);
    });
  }

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = mockSalesData.filter(
      (sale) =>
        sale.customerName.toLowerCase().includes(searchTerm) ||
        String(sale.saleId).includes(searchTerm)
    );
    populateSalesTable(filteredData);
  }

  // --- Modal Logic ---
  function openModal() {
    modal.style.display = "flex";
  }

  function closeModal() {
    modal.style.display = "none";
    newSaleForm.reset(); // Clear the form fields
  }

  function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const customerName = customerNameInput.value.trim() || "Walk-in Customer";
    const totalAmount = parseFloat(totalAmountInput.value);

    if (isNaN(totalAmount) || totalAmount <= 0) {
      alert("Please enter a valid total amount.");
      return;
    }

    const newSale = {
      saleId: Math.max(...mockSalesData.map((s) => s.saleId)) + 1,
      customerName: customerName,
      saleDate: new Date().toISOString(),
      totalAmount: totalAmount,
    };

    mockSalesData.push(newSale);
    populateSalesTable(mockSalesData);
    closeModal();
  }

  // --- Initial Load ---
  // In a real app, you'd fetch this data.
  populateSalesTable(mockSalesData);

  // --- Event Listeners ---
  searchInput.addEventListener("input", handleSearch);
  newSaleButton.addEventListener("click", openModal);
  closeModalButton.addEventListener("click", closeModal);
  newSaleForm.addEventListener("submit", handleFormSubmit);

  // Close modal if user clicks outside of it
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      closeModal();
    }
  });
});
