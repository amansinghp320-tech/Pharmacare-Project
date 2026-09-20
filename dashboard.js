document.addEventListener("DOMContentLoaded", function () {
  // In a real application, this data would be fetched from your C++ backend API.
  // For now, we'll use mock data based on your SQL schema.
  const mockInventoryData = [
    {
      stockId: 1,
      medicineName: "Paracetamol 500mg",
      batchNumber: "P-A101",
      quantity: 998,
      sellingPrice: 1.0,
      expiryDate: "2025-12-31",
    },
    {
      stockId: 2,
      medicineName: "Amoxicillin 250mg",
      batchNumber: "A-B202",
      quantity: 500,
      sellingPrice: 2.5,
      expiryDate: "2024-10-31",
    },
    {
      stockId: 3,
      medicineName: "Loratadine 10mg",
      batchNumber: "L-C303",
      quantity: 800,
      sellingPrice: 1.75,
      expiryDate: "2026-05-31",
    },
    {
      stockId: 4,
      medicineName: "Ibuprofen 200mg",
      batchNumber: "I-D404",
      quantity: 45,
      sellingPrice: 1.5,
      expiryDate: "2025-08-31",
    },
    {
      stockId: 5,
      medicineName: "Aspirin 81mg",
      batchNumber: "AS-E505",
      quantity: 1200,
      sellingPrice: 0.8,
      expiryDate: "2023-12-01",
    },
    {
      stockId: 6,
      medicineName: "Metformin 500mg",
      batchNumber: "M-F606",
      quantity: 250,
      sellingPrice: 3.2,
      expiryDate: "2026-01-15",
    },
  ];

  const totalMedicinesEl = document.getElementById("total-medicines");
  const lowStockItemsEl = document.getElementById("low-stock-items");
  const expiredItemsEl = document.getElementById("expired-items");
  const inventoryTableBody = document.getElementById("inventory-table-body");
  const searchInput = document.getElementById("searchInput");
  const addMedicineBtn = document.getElementById("add-medicine-btn");
  const modal = document.getElementById("stock-modal");
  const closeModalButton = modal.querySelector(".close-button");
  const stockForm = document.getElementById("stock-form");

  // --- Data Management with localStorage ---
  const INVENTORY_STORAGE_KEY = "pharmaCareInventory";

  function getInventoryData() {
    const storedData = localStorage.getItem(INVENTORY_STORAGE_KEY);
    // If there's data in localStorage, use it. Otherwise, use mock data.
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      // Fallback to mock data if nothing is in storage
      return mockInventoryData;
    }
  }

  let currentInventoryData = getInventoryData();
  const LOW_STOCK_THRESHOLD = 50;

  function getStatus(item) {
    const expiry = new Date(item.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    if (expiry < today) {
      return { text: "Expired", className: "expired" };
    }
    if (item.quantity < LOW_STOCK_THRESHOLD) {
      return { text: "Low Stock", className: "low-stock" };
    }
    return { text: "In Stock", className: "in-stock" };
  }

  function populateTable(data) {
    inventoryTableBody.innerHTML = ""; // Clear existing rows

    if (data.length === 0) {
      inventoryTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No medicines found.</td></tr>`;
      return;
    }

    data.forEach((item) => {
      const status = getStatus(item);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.stockId}</td>
        <td>${item.medicineName}</td>
        <td>${item.batchNumber}</td>
        <td>${item.quantity}</td>
        <td>$${item.sellingPrice.toFixed(2)}</td>
        <td>${item.expiryDate}</td>
        <td><span class="status ${status.className}">${status.text}</span></td>
      `;
      inventoryTableBody.appendChild(row);
    });
  }

  function updateSummaryCards(data) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalMedicines = new Set(data.map((item) => item.medicineName)).size;
    const lowStockCount = data.filter(
      (item) =>
        item.quantity < LOW_STOCK_THRESHOLD &&
        new Date(item.expiryDate) >= today
    ).length;
    const expiredCount = data.filter(
      (item) => new Date(item.expiryDate) < today
    ).length;

    totalMedicinesEl.textContent = totalMedicines;
    lowStockItemsEl.textContent = lowStockCount;
    expiredItemsEl.textContent = expiredCount;
  }

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = currentInventoryData.filter(
      (item) =>
        item.medicineName.toLowerCase().includes(searchTerm) ||
        item.batchNumber.toLowerCase().includes(searchTerm)
    );
    populateTable(filteredData);
  }

  // --- Modal Logic ---
  function openModal() {
    // This button on the dashboard will always open the modal in "add" mode.
    stockForm.reset();
    document.getElementById("modal-title").textContent = "Add New Medicine";
    document.getElementById("stockId").value = "";
    document.getElementById("status-group").style.display = "none";
    modal.style.display = "flex";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    currentInventoryData = getInventoryData(); // Get latest data before adding
    const newMedicine = {
      stockId: currentInventoryData.length
        ? Math.max(...currentInventoryData.map((i) => i.stockId)) + 1
        : 1,
      medicineName: document.getElementById("medicineName").value,
      batchNumber: document.getElementById("batchNumber").value,
      quantity: parseInt(document.getElementById("quantity").value, 10),
      sellingPrice: parseFloat(document.getElementById("sellingPrice").value),
      expiryDate: document.getElementById("expiryDate").value,
    };
    currentInventoryData.push(newMedicine);
    localStorage.setItem(
      INVENTORY_STORAGE_KEY,
      JSON.stringify(currentInventoryData)
    );
    initializeDashboard(); // Re-initialize to update table and cards
    closeModal();
  }

  // Initial Load
  function initializeDashboard() {
    currentInventoryData = getInventoryData();
    populateTable(currentInventoryData);
    updateSummaryCards(currentInventoryData);
  }

  // Event Listeners
  searchInput.addEventListener("input", handleSearch);
  addMedicineBtn.addEventListener("click", openModal);
  closeModalButton.addEventListener("click", closeModal);
  stockForm.addEventListener("submit", handleFormSubmit);
  window.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  // --- API Simulation ---
  // For demonstration, we'll just initialize with the mock data.
  initializeDashboard();
});
