document.addEventListener("DOMContentLoaded", function () {
  // Mock data representing customers. In a real app, this comes from an API.
  const mockCustomerData = [
    {
      customerId: 1,
      customerName: "Alice Johnson",
      phoneNumber: "555-0201",
    },
    {
      customerId: 2,
      customerName: "Bob Williams",
      phoneNumber: "555-0202",
    },
    {
      customerId: 3,
      customerName: "Charlie Brown",
      phoneNumber: "555-0203",
    },
    {
      customerId: 4,
      customerName: "Diana Prince",
      phoneNumber: "555-0204",
    },
    {
      customerId: 5,
      customerName: "Priya Sharma",
      phoneNumber: "987-654-3210",
    },
    {
      customerId: 6,
      customerName: "Rohan Kumar",
      phoneNumber: "876-543-2109",
    },
  ];

  // DOM Elements
  const tableBody = document.getElementById("customer-table-body");
  const searchInput = document.getElementById("searchCustomerInput");
  const addCustomerBtn = document.getElementById("add-customer-btn");
  const modal = document.getElementById("customer-modal");
  const closeModalBtn = modal.querySelector(".close-button");
  const customerForm = document.getElementById("customer-form");
  const modalTitle = document.getElementById("modal-title");
  const customerIdInput = document.getElementById("customerId");

  let currentCustomerData = [...mockCustomerData];

  function populateTable(data) {
    tableBody.innerHTML = "";
    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No customers found.</td></tr>`;
      return;
    }

    data.forEach((customer) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>#${customer.customerId}</td>
        <td>${customer.customerName}</td>
        <td>${customer.phoneNumber}</td>
        <td class="actions">
          <button class="action-btn message-btn" data-phone="${customer.phoneNumber}" title="Message Customer">
            <span class="material-symbols-outlined">message</span>
          </button>
          <button class="action-btn edit-btn" data-id="${customer.customerId}" title="Edit Customer">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="action-btn delete-btn" data-id="${customer.customerId}" title="Delete Customer">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = currentCustomerData.filter(
      (c) =>
        c.customerName.toLowerCase().includes(searchTerm) ||
        c.phoneNumber.includes(searchTerm)
    );
    populateTable(filteredData);
  }

  function openModal(customerId = null) {
    customerForm.reset();
    if (customerId) {
      modalTitle.textContent = "Edit Customer";
      const customer = currentCustomerData.find(
        (c) => c.customerId === customerId
      );
      if (customer) {
        customerIdInput.value = customer.customerId;
        document.getElementById("customerName").value = customer.customerName;
        document.getElementById("phoneNumber").value = customer.phoneNumber;
      }
    } else {
      modalTitle.textContent = "Add New Customer";
      customerIdInput.value = "";
    }
    modal.style.display = "flex";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const customerId = parseInt(customerIdInput.value, 10);
    const formData = {
      customerName: document.getElementById("customerName").value,
      phoneNumber: document.getElementById("phoneNumber").value,
    };

    if (customerId) {
      const index = currentCustomerData.findIndex(
        (c) => c.customerId === customerId
      );
      if (index !== -1) {
        currentCustomerData[index] = {
          ...currentCustomerData[index],
          ...formData,
        };
      }
    } else {
      const newId =
        Math.max(...currentCustomerData.map((c) => c.customerId)) + 1;
      currentCustomerData.push({ customerId: newId, ...formData });
    }
    populateTable(currentCustomerData);
    closeModal();
  }

  function handleTableClick(event) {
    const target = event.target.closest("button");
    if (!target) return;

    const customerId = parseInt(target.dataset.id, 10);

    if (target.classList.contains("edit-btn")) {
      openModal(customerId);
    } else if (target.classList.contains("delete-btn")) {
      if (confirm("Are you sure you want to delete this customer?")) {
        currentCustomerData = currentCustomerData.filter(
          (c) => c.customerId !== customerId
        );
        populateTable(currentCustomerData);
      }
    } else if (target.classList.contains("message-btn")) {
      const phone = target.dataset.phone;
      // This simulates opening a messaging app. 'sms:' is a standard URI scheme.
      window.open(`sms:${phone}`, "_blank");
      alert(`Simulating sending a message to ${phone}`);
    }
  }

  // Initial Load
  populateTable(currentCustomerData);

  // Event Listeners
  searchInput.addEventListener("input", handleSearch);
  addCustomerBtn.addEventListener("click", () => openModal());
  closeModalBtn.addEventListener("click", closeModal);
  customerForm.addEventListener("submit", handleFormSubmit);
  tableBody.addEventListener("click", handleTableClick);
  window.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
});
