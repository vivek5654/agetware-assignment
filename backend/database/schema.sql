CREATE TABLE IF NOT EXISTS customers (
    customer_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loans (
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

CREATE TABLE IF NOT EXISTS payments (
    payment_id TEXT PRIMARY KEY,
    loan_id TEXT,
    amount DECIMAL(10,2),
    payment_type TEXT,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
);

INSERT OR IGNORE INTO customers (customer_id, name) VALUES 
('CUST001', 'John Doe'),
('CUST002', 'Jane Smith'),
('CUST003', 'Alice Johnson');
