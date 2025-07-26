README.md
text
# Agetware Internship Assignment - Bank Lending System

**Submitted by:** Vivek Vardhan  
**Date:** January 26, 2025  
**Assignment:** Full-stack Bank Lending System + Algorithmic Problems

## 🎯 Assignment Completion Summary

### ✅ Algorithmic Problems (4/4 Complete)
1. **Caesar Cipher** - Encoding/decoding with alphabet shifting
2. **Indian Currency Formatting** - Proper comma placement for Indian numbering system
3. **Minimizing Loss** - Finding optimal buy/sell years to minimize financial loss
4. **List Combining** - Merging lists based on positional overlap criteria

### ✅ Bank Lending System (Complete Full-Stack Application)
- **Frontend:** Modern React application with Vite + Tailwind CSS
- **Backend:** Node.js + Express.js REST API
- **Database:** SQLite with proper relational schema
- **Features:** All 4 required banking functionalities implemented

## 🏗️ System Architecture

**Three-Tier Architecture Implementation:**
- **Presentation Layer:** React.js Single Page Application (SPA)
- **Application Layer:** Node.js + Express.js REST API server
- **Data Layer:** SQLite relational database

## 🔧 Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3
- **Utilities:** UUID for unique IDs, CORS for cross-origin requests

### Frontend
- **Build Tool:** Vite (for faster development)
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios

### Development Tools
- **Hot Reload:** Nodemon for backend, Vite HMR for frontend
- **Package Manager:** npm

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)

### Backend Setup
cd bank-system/backend
npm install
npm run dev

Server runs on http://localhost:3001
text

### Frontend Setup
cd bank-system/frontend
npm install
npm run dev

Application runs on http://localhost:5173
text

### Database Initialization
The SQLite database is automatically created and initialized with sample customers on first run.

## 📋 API Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/v1/health` | Health check | None |
| POST | `/api/v1/loans` | Create new loan | `{customer_id, customer_name?, loan_amount, loan_period_years, interest_rate_yearly}` |
| POST | `/api/v1/loans/:id/payments` | Record payment | `{amount, payment_type}` |
| GET | `/api/v1/loans/:id/ledger` | Get transaction history | None |
| GET | `/api/v1/customers/:id/overview` | Customer loan summary | None |

## 🧮 Banking Calculations Implemented

### Simple Interest Formula
Interest (I) = Principal (P) × Years (N) × Rate (R) / 100
Total Amount (A) = Principal + Interest
Monthly EMI = Total Amount / (Years × 12)

text

### Payment Processing Logic
- **EMI Payments:** Deducted from outstanding balance
- **Lump Sum Payments:** Reduces total outstanding, recalculates remaining EMIs
- **Remaining EMIs:** `Math.ceil(remaining_balance / monthly_emi)`

## 🎨 Features Delivered

### Core Banking Functionalities (As per requirements)
1. **LEND** - Create loans with automatic calculations
2. **PAYMENT** - Process EMI and lump sum payments
3. **LEDGER** - Complete transaction history with balance tracking
4. **ACCOUNT OVERVIEW** - Customer portfolio with all loan details

### Enhanced Features
- ✅ New customer registration (auto-generated IDs)
- ✅ Existing customer selection from dropdown
- ✅ Real-time balance and EMI calculations
- ✅ Visual progress bars for loan completion
- ✅ Responsive design for mobile and desktop
- ✅ Professional banking UI with Tailwind CSS
- ✅ Error handling and validation
- ✅ Loading states and user feedback

## 🗄️ Database Schema

### Tables Created
-- Customers table
CREATE TABLE customers (
customer_id TEXT PRIMARY KEY,
name TEXT NOT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Loans table
CREATE TABLE loans (
loan_id TEXT PRIMARY KEY,
customer_id TEXT,
principal_amount DECIMAL(10,2),
total_amount DECIMAL(10,2),
interest_rate DECIMAL(5,2),
loan_period_years INTEGER,
monthly_emi DECIMAL(10,2),
status TEXT DEFAULT 'ACTIVE',
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Payments table
CREATE TABLE payments (
payment_id TEXT PRIMARY KEY,
loan_id TEXT,
amount DECIMAL(10,2),
payment_type TEXT,
payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
);

text

## 🧪 Testing & Validation

### Algorithmic Problems Testing
- All functions tested with provided examples
- Edge cases handled (empty strings, zero values, etc.)
- Output format matches requirements

### API Testing
- All endpoints tested with PowerShell/Postman
- Error scenarios validated (invalid IDs, missing data)
- Database persistence verified

### Frontend Testing
- Cross-browser compatibility checked
- Responsive design tested on multiple screen sizes
- User workflows tested end-to-end

## 📁 Project Structure

agetware-assignment/
├── algorithms/ # Coding problems solutions
│ ├── caesar-cipher.js # Caesar cipher implementation
│ ├── currency-format.js # Indian currency formatting
│ ├── minimize-loss.js # Loss minimization algorithm
│ └── combine-lists.js # List combining with overlap
├── bank-system/ # Main banking application
│ ├── backend/ # Node.js API server
│ │ ├── package.json
│ │ ├── server.js # Main server file
│ │ ├── database/
│ │ │ ├── database.js # Database connection
│ │ │ ├── schema.sql # Database schema
│ │ │ └── bank.db # SQLite database file
│ │ ├── routes/
│ │ │ ├── loans.js # Loan-related endpoints
│ │ │ └── customers.js # Customer-related endpoints
│ │ └── utils/
│ │ └── calculations.js # Loan calculation utilities
│ └── frontend/ # React application
│ ├── package.json
│ ├── vite.config.js # Vite configuration
│ ├── src/
│ │ ├── App.jsx # Main application component
│ │ ├── services/
│ │ │ └── api.js # API service layer
│ │ └── components/
│ │ ├── LoanForm.jsx # Loan creation form
│ │ ├── PaymentForm.jsx # Payment processing
│ │ ├── LedgerView.jsx # Transaction history
│ │ └── CustomerOverview.jsx # Customer dashboard
│ └── src/index.css # Tailwind CSS imports
├── README.md # This documentation
├── PROBLEMS.md # Algorithmic problems documentation
└── .gitignore # Git ignore rules

text

## 🎥 Demo Instructions

### Quick Start Demo
1. **Start Backend:** `cd backend && npm run dev`
2. **Start Frontend:** `cd frontend && npm run dev`
3. **Open Browser:** Navigate to `http://localhost:5173`

### Demo Workflow
1. **Create Loan:** Try both existing and new customer options
2. **Make Payments:** Test EMI and lump sum payments
3. **View Ledger:** Check transaction history and balance
4. **Customer Overview:** See complete portfolio summary

### Sample Test Data
- **Existing Customers:** CUST001 (John Doe), CUST002 (Jane Smith), CUST003 (Alice Johnson)
- **Test Loan:** ₹100,000 for 2 years at 10% interest
- **Expected EMI:** ₹5,000 per month

## 💡 Design Decisions & Assumptions

### Technical Choices
1. **SQLite over PostgreSQL:** Simpler setup for assignment demonstration
2. **Vite over Create React App:** Faster development and build times
3. **Tailwind CSS:** Utility-first approach for rapid UI development
4. **Auto-generated UUIDs:** Ensures unique identification for all records

### Business Logic Assumptions
1. **Simple Interest:** Used as specified in requirements
2. **Customer Pre-existence:** System allows both existing and new customers
3. **Payment Flexibility:** Both EMI and lump sum payments supported
4. **No Loan Restrictions:** No limits on loan amounts or customer loan count

### UI/UX Decisions
1. **Single Page Application:** Tabbed interface for easy navigation
2. **Responsive Design:** Mobile-first approach with Tailwind utilities
3. **Real-time Feedback:** Loading states and success/error notifications
4. **Professional Styling:** Banking-appropriate color scheme and typography

## ⭐ Assignment Requirements Compliance

- [x] **RESTful API Design:** All endpoints follow REST principles
- [x] **Three-tier Architecture:** Clear separation of presentation, logic, and data layers
- [x] **Database Integration:** Proper relational schema with foreign keys
- [x] **Frontend Interface:** Modern React application with professional UI
- [x] **LEND Functionality:** Complete loan creation with calculations
- [x] **PAYMENT Processing:** EMI and lump sum payment handling
- [x] **LEDGER Display:** Transaction history with current balance
- [x] **ACCOUNT OVERVIEW:** Customer portfolio summary
- [x] **Simple Interest Calculation:** I = P × N × R formula implemented
- [x] **EMI Recalculation:** Proper handling of lump sum payments
- [x] **Data Persistence:** SQLite database with proper schema
- [x] **Error Handling:** Comprehensive validation and error responses
- [x] **All Algorithmic Problems:** Caesar cipher, currency format, loss minimization, list combining

## 🏆 Key Achievements

- **Complete Full-Stack Application:** End-to-end banking system
- **Modern Technology Stack:** Latest React, Vite, and Node.js practices
- **Professional UI/UX:** Banking-grade interface design
- **Robust Error Handling:** Comprehensive validation and user feedback
- **Scalable Architecture:** Clean separation of concerns
- **Comprehensive Documentation:** Detailed setup and usage instructions

---

**Total Development Time:** ~2-3 days  
**Lines of Code:** ~1,500+ lines  
**Git Commits:** Multiple commits with clear messages  

This project demonstrates full-stack development capabilities with modern technologies and follows industry best practices for scalable web applications.

## 📞 Contact

**Developer:** Vivek Vaedhan      
**Email:** anapalavivekvardhan5654@gmail.com 
**GitHub:** vivek5654  
**LinkedIn:** vivek vardhan

For any questions about the implementation or technical decisions, please feel free to reach out.#   a g e t w a r e - a s s i g n m e n t  
 