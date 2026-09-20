-- SQL Server Schema for Medical Store Management System

-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS SalesItems;
DROP TABLE IF EXISTS Sales;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Medicines;
DROP TABLE IF EXISTS Suppliers;
DROP TABLE IF EXISTS Customers;
GO

-- Table for Suppliers
CREATE TABLE Suppliers (
    SupplierID INT PRIMARY KEY IDENTITY(1,1),
    SupplierName NVARCHAR(255) NOT NULL,
    ContactPerson NVARCHAR(255),
    PhoneNumber NVARCHAR(20),
    Email NVARCHAR(255)
);
GO

-- Table for Medicines
CREATE TABLE Medicines (
    MedicineID INT PRIMARY KEY IDENTITY(1,1),
    MedicineName NVARCHAR(255) NOT NULL UNIQUE,
    Description NVARCHAR(MAX),
    Category NVARCHAR(100)
);
GO

-- Table for Inventory (Stock)
CREATE TABLE Inventory (
    StockID INT PRIMARY KEY IDENTITY(1,1),
    MedicineID INT NOT NULL,
    SupplierID INT NOT NULL,
    BatchNumber NVARCHAR(100) NOT NULL,
    PurchasePrice DECIMAL(10, 2) NOT NULL,
    SellingPrice DECIMAL(10, 2) NOT NULL,
    Quantity INT NOT NULL,
    ExpiryDate DATE NOT NULL,
    FOREIGN KEY (MedicineID) REFERENCES Medicines(MedicineID),
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
);
GO

-- Table for Customers
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    CustomerName NVARCHAR(255) NOT NULL,
    PhoneNumber NVARCHAR(20)
);
GO

-- Table for Sales
CREATE TABLE Sales (
    SaleID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT,
    SaleDate DATETIME NOT NULL DEFAULT GETDATE(),
    TotalAmount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);
GO

-- Table for items in a sale (linking Sales and Inventory)
CREATE TABLE SalesItems (
    SaleItemID INT PRIMARY KEY IDENTITY(1,1),
    SaleID INT NOT NULL,
    StockID INT NOT NULL, -- Links to the specific batch from inventory
    QuantitySold INT NOT NULL,
    PricePerUnit DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (SaleID) REFERENCES Sales(SaleID),
    FOREIGN KEY (StockID) REFERENCES Inventory(StockID)
);
GO


-- --- Insert Sample Raw Data ---

-- Suppliers
INSERT INTO Suppliers (SupplierName, ContactPerson, PhoneNumber, Email) VALUES
('Pharma Distribution Inc.', 'John Smith', '555-0101', 'contact@pharmadist.com'),
('Global Meds', 'Jane Doe', '555-0102', 'sales@globalmeds.com'),
('HealthFirst Supplies', 'Peter Jones', '555-0103', 'support@healthfirst.com');

-- Medicines
INSERT INTO Medicines (MedicineName, Description, Category) VALUES
('Paracetamol 500mg', 'Pain and fever relief', 'Painkiller'),
('Amoxicillin 250mg', 'Antibiotic for bacterial infections', 'Antibiotic'),
('Loratadine 10mg', 'Antihistamine for allergies', 'Antihistamine'),
('Ibuprofen 200mg', 'Pain relief and anti-inflammatory', 'Painkiller'),
('Aspirin 81mg', 'Blood thinner and pain relief', 'Cardiovascular'),
('Metformin 500mg', 'For type 2 diabetes', 'Antidiabetic');

-- Inventory
INSERT INTO Inventory (MedicineID, SupplierID, BatchNumber, PurchasePrice, SellingPrice, Quantity, ExpiryDate) VALUES
-- Existing
(1, 1, 'P-A101', 0.50, 1.00, 1000, '2025-12-31'), -- Paracetamol
(2, 1, 'A-B202', 1.20, 2.50, 500, '2024-10-31'), -- Amoxicillin
(3, 2, 'L-C303', 0.80, 1.75, 800, '2026-05-31'), -- Loratadine
-- New
(4, 2, 'I-D404', 0.75, 1.50, 45, '2025-08-31'),   -- Ibuprofen (Low Stock)
(5, 3, 'AS-E505', 0.40, 0.80, 1200, '2023-12-01'), -- Aspirin (Expired)
(6, 3, 'M-F606', 1.80, 3.20, 250, '2026-01-15');   -- Metformin

-- Customers
INSERT INTO Customers (CustomerName, PhoneNumber) VALUES
('Alice Johnson', '555-0201'),
('Bob Williams', '555-0202'),
('Charlie Brown', '555-0203'),
('Diana Prince', '555-0204');

-- Sample Sale (this would typically be done via the application)
-- Let's imagine Alice buys 2 Paracetamol and 1 Loratadine
-- Sale 1: Alice Johnson
INSERT INTO Sales (CustomerID, TotalAmount, SaleDate) VALUES (1, 3.75, '2024-05-20T10:30:00');
INSERT INTO SalesItems (SaleID, StockID, QuantitySold, PricePerUnit) VALUES
(1, 1, 2, 1.00), -- 2 Paracetamol
(1, 3, 1, 1.75); -- 1 Loratadine
-- Sale 2: Bob Williams
INSERT INTO Sales (CustomerID, TotalAmount, SaleDate) VALUES (2, 5.00, '2024-05-21T14:00:00');
INSERT INTO SalesItems (SaleID, StockID, QuantitySold, PricePerUnit) VALUES
(2, 2, 2, 2.50); -- 2 Amoxicillin
-- Sale 3: Walk-in Customer (NULL CustomerID)
INSERT INTO Sales (CustomerID, TotalAmount, SaleDate) VALUES (NULL, 4.70, '2024-05-22T09:15:00');
INSERT INTO SalesItems (SaleID, StockID, QuantitySold, PricePerUnit) VALUES
(3, 6, 1, 3.20), -- 1 Metformin
(3, 4, 1, 1.50); -- 1 Ibuprofen

-- Update inventory (this would also be handled by the application logic)
UPDATE Inventory SET Quantity = Quantity - 2 WHERE StockID = 1;
UPDATE Inventory SET Quantity = Quantity - 1 WHERE StockID = 3;
GO