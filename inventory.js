document.addEventListener("DOMContentLoaded", function () {
  // In a real application, this data would be fetched from your backend API.
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

  const inventoryTableBody = document.getElementById("inventory-table-body");
  const searchInput = document.getElementById("searchInput");
  const addStockButton = document.getElementById("add-stock-btn");
  const modal = document.getElementById("stock-modal");
  const closeModalButton = document.querySelector(".close-button");
  const stockForm = document.getElementById("stock-form");
  const modalTitle = document.getElementById("modal-title");
  const stockIdInput = document.getElementById("stockId");
  const statusGroup = document.getElementById("status-group");

  // --- Data Management with localStorage ---
  const INVENTORY_STORAGE_KEY = "pharmaCareInventory";

  function getInventoryData() {
    const storedData = localStorage.getItem(INVENTORY_STORAGE_KEY);
    // If there's data in localStorage, use it. Otherwise, use mock data and save it.
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      localStorage.setItem(
        INVENTORY_STORAGE_KEY,
        JSON.stringify(mockInventoryData)
      );
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
      inventoryTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No medicines found.</td></tr>`;
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
        <td class="actions">
            <button class="action-btn edit-btn" data-id="${
              item.stockId
            }"><span class="material-symbols-outlined">edit</span></button>
            <button class="action-btn delete-btn" data-id="${
              item.stockId
            }"><span class="material-symbols-outlined">delete</span></button>
        </td>
      `;
      inventoryTableBody.appendChild(row);
    });
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

  // --- Modal and Form Logic ---
  function openModal(stockId = null) {
    stockForm.reset();
    if (stockId) {
      // Edit mode
      modalTitle.textContent = "Edit Stock";
      const item = currentInventoryData.find((i) => i.stockId === stockId);
      if (item) {
        stockIdInput.value = item.stockId;
        document.getElementById("medicineName").value = item.medicineName;
        document.getElementById("batchNumber").value = item.batchNumber;
        document.getElementById("quantity").value = item.quantity;
        document.getElementById("sellingPrice").value = item.sellingPrice;
        document.getElementById("expiryDate").value = item.expiryDate;
        statusGroup.style.display = "block"; // Show status for editing
      }
    } else {
      // Add mode
      modalTitle.textContent = "Add New Stock";
      stockIdInput.value = "";
      statusGroup.style.display = "none"; // Hide status for new items
    }
    modal.style.display = "flex";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const stockId = parseInt(stockIdInput.value, 10);
    const formData = {
      medicineName: document.getElementById("medicineName").value,
      batchNumber: document.getElementById("batchNumber").value,
      quantity: parseInt(document.getElementById("quantity").value, 10),
      sellingPrice: parseFloat(document.getElementById("sellingPrice").value),
      expiryDate: document.getElementById("expiryDate").value,
    };

    if (stockId) {
      // Update existing item
      const index = currentInventoryData.findIndex(
        (i) => i.stockId === stockId
      );
      if (index !== -1) {
        currentInventoryData[index] = {
          ...currentInventoryData[index],
          ...formData,
        };
      }
    } else {
      // Add new item
      const newStockId = currentInventoryData.length
        ? Math.max(...currentInventoryData.map((i) => i.stockId)) + 1
        : 1;
      const newItem = { stockId: newStockId, ...formData };
      currentInventoryData.push(newItem);
    }

    populateTable(currentInventoryData);
    closeModal();
  }

  function handleTableClick(event) {
    const target = event.target.closest("button");
    if (!target) return;

    const stockId = parseInt(target.dataset.id, 10);

    if (target.classList.contains("edit-btn")) {
      openModal(stockId);
    }

    if (target.classList.contains("delete-btn")) {
      if (confirm("Are you sure you want to delete this item?")) {
        currentInventoryData = currentInventoryData.filter(
          (item) => item.stockId !== stockId
        );
        localStorage.setItem(
          INVENTORY_STORAGE_KEY,
          JSON.stringify(currentInventoryData)
        );
        populateTable(currentInventoryData);
      }
    }
  }

  // Initial Load
  populateTable(currentInventoryData);

  // Event Listeners
  searchInput.addEventListener("input", handleSearch);
  addStockButton.addEventListener("click", () => openModal());
  closeModalButton.addEventListener("click", closeModal);
  stockForm.addEventListener("submit", handleFormSubmit);
  inventoryTableBody.addEventListener("click", handleTableClick);

  // Close modal if user clicks outside of it
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      closeModal();
    }
  });
});
