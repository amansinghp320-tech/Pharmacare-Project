document.addEventListener("DOMContentLoaded", function () {
  // Mock data for suppliers. In a real app, this would come from an API.
  const mockSupplierData = [
    {
      supplierId: 1,
      supplierName: "Global Pharma Inc.",
      contactPerson: "John Doe",
      phoneNumber: "111-222-3333",
      email: "john.doe@globalpharma.com",
    },
    {
      supplierId: 2,
      supplierName: "MedSupply Co.",
      contactPerson: "Jane Smith",
      phoneNumber: "444-555-6666",
      email: "jane.s@medsupply.co",
    },
    {
      supplierId: 3,
      supplierName: "Wellness Distributors",
      contactPerson: "Peter Jones",
      phoneNumber: "777-888-9999",
      email: "p.jones@wellnessdist.net",
    },
  ];

  // DOM Elements
  const tableBody = document.getElementById("supplier-table-body");
  const searchInput = document.getElementById("searchSupplierInput");
  const addSupplierBtn = document.getElementById("add-supplier-btn");
  const modal = document.getElementById("supplier-modal");
  const closeModalBtn = modal.querySelector(".close-button");
  const supplierForm = document.getElementById("supplier-form");
  const modalTitle = document.getElementById("modal-title");
  const supplierIdInput = document.getElementById("supplierId");

  let currentSupplierData = [...mockSupplierData];

  function populateTable(data) {
    tableBody.innerHTML = "";
    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No suppliers found.</td></tr>`;
      return;
    }

    data.forEach((supplier) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>#${supplier.supplierId}</td>
        <td>${supplier.supplierName}</td>
        <td>${supplier.contactPerson || "N/A"}</td>
        <td>${supplier.phoneNumber}</td>
        <td>${supplier.email || "N/A"}</td>
        <td class="actions">
          <button class="action-btn edit-btn" data-id="${
            supplier.supplierId
          }" title="Edit Supplier">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="action-btn delete-btn" data-id="${
            supplier.supplierId
          }" title="Delete Supplier">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = currentSupplierData.filter(
      (s) =>
        s.supplierName.toLowerCase().includes(searchTerm) ||
        (s.contactPerson &&
          s.contactPerson.toLowerCase().includes(searchTerm)) ||
        s.phoneNumber.includes(searchTerm)
    );
    populateTable(filteredData);
  }

  function openModal(supplierId = null) {
    supplierForm.reset();
    if (supplierId) {
      modalTitle.textContent = "Edit Supplier";
      const supplier = currentSupplierData.find(
        (s) => s.supplierId === supplierId
      );
      if (supplier) {
        supplierIdInput.value = supplier.supplierId;
        document.getElementById("supplierName").value = supplier.supplierName;
        document.getElementById("contactPerson").value = supplier.contactPerson;
        document.getElementById("phoneNumber").value = supplier.phoneNumber;
        document.getElementById("email").value = supplier.email;
      }
    } else {
      modalTitle.textContent = "Add New Supplier";
      supplierIdInput.value = "";
    }
    modal.style.display = "flex";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const supplierId = parseInt(supplierIdInput.value, 10);
    const formData = {
      supplierName: document.getElementById("supplierName").value,
      contactPerson: document.getElementById("contactPerson").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      email: document.getElementById("email").value,
    };

    if (supplierId) {
      const index = currentSupplierData.findIndex(
        (s) => s.supplierId === supplierId
      );
      if (index !== -1) {
        currentSupplierData[index] = {
          ...currentSupplierData[index],
          ...formData,
        };
      }
    } else {
      const newId =
        Math.max(...currentSupplierData.map((s) => s.supplierId), 0) + 1;
      currentSupplierData.push({ supplierId: newId, ...formData });
    }
    populateTable(currentSupplierData);
    closeModal();
  }

  function handleTableClick(event) {
    const target = event.target.closest("button");
    if (!target) return;

    const supplierId = parseInt(target.dataset.id, 10);

    if (target.classList.contains("edit-btn")) {
      openModal(supplierId);
    } else if (target.classList.contains("delete-btn")) {
      if (confirm("Are you sure you want to delete this supplier?")) {
        currentSupplierData = currentSupplierData.filter(
          (s) => s.supplierId !== supplierId
        );
        populateTable(currentSupplierData);
      }
    }
  }

  // Initial Load & Event Listeners
  populateTable(currentSupplierData);
  searchInput.addEventListener("input", handleSearch);
  addSupplierBtn.addEventListener("click", () => openModal());
  closeModalBtn.addEventListener("click", closeModal);
  supplierForm.addEventListener("submit", handleFormSubmit);
  tableBody.addEventListener("click", handleTableClick);
  window.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
});
