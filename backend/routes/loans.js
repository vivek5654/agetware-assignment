const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/database');
const { calculateLoanDetails } = require('../utils/calculations');

router.post('/', (req, res) => {
    const { customer_id, loan_amount, loan_period_years, interest_rate_yearly, customer_name } = req.body;
    
    if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    // First check if customer exists
    db.get('SELECT customer_id FROM customers WHERE customer_id = ?', [customer_id], (err, customer) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        const createLoan = () => {
            const loanDetails = calculateLoanDetails(loan_amount, loan_period_years, interest_rate_yearly);
            const loanId = uuidv4();
            
            const query = `
                INSERT INTO loans (loan_id, customer_id, principal_amount, total_amount, 
                                 interest_rate, loan_period_years, monthly_emi)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            
            db.run(query, [
                loanId, customer_id, loan_amount, loanDetails.totalAmount,
                interest_rate_yearly, loan_period_years, loanDetails.monthlyEMI
            ], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create loan' });
                }
                
                res.status(201).json({
                    loan_id: loanId,
                    customer_id: customer_id,
                    total_amount_payable: loanDetails.totalAmount,
                    monthly_emi: loanDetails.monthlyEMI
                });
            });
        };
        
        if (!customer) {
            // Customer doesn't exist, create them first
            if (!customer_name) {
                return res.status(400).json({ error: 'Customer name is required for new customers' });
            }
            
            db.run('INSERT INTO customers (customer_id, name) VALUES (?, ?)', 
                   [customer_id, customer_name], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create customer' });
                }
                
                console.log(`New customer created: ${customer_id} - ${customer_name}`);
                createLoan(); // Now create the loan
            });
        } else {
            // Customer exists, proceed with loan creation
            createLoan();
        }
    });
});

router.post('/:loan_id/payments', (req, res) => {
    const { loan_id } = req.params;
    const { amount, payment_type } = req.body;
    
    if (!amount || !payment_type) {
        return res.status(400).json({ error: 'Amount and payment_type are required' });
    }
    
    if (!['EMI', 'LUMP_SUM'].includes(payment_type)) {
        return res.status(400).json({ error: 'payment_type must be EMI or LUMP_SUM' });
    }
    

    db.get('SELECT * FROM loans WHERE loan_id = ?', [loan_id], (err, loan) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!loan) {
            return res.status(404).json({ error: 'Loan not found' });
        }
        
       
        db.get('SELECT COALESCE(SUM(amount), 0) as total_paid FROM payments WHERE loan_id = ?', 
               [loan_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            const currentPaid = result.total_paid;
            const newTotalPaid = currentPaid + amount;
            const remainingBalance = loan.total_amount - newTotalPaid;
            
            if (remainingBalance < 0) {
                return res.status(400).json({ 
                    error: 'Payment amount exceeds remaining balance',
                    remaining_balance: loan.total_amount - currentPaid
                });
            }
            
            
            const paymentId = require('uuid').v4();
            
            db.run('INSERT INTO payments (payment_id, loan_id, amount, payment_type) VALUES (?, ?, ?, ?)',
                   [paymentId, loan_id, amount, payment_type], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to record payment' });
                }
                
             
                const emisLeft = remainingBalance > 0 ? Math.ceil(remainingBalance / loan.monthly_emi) : 0;
                
      
                if (remainingBalance === 0) {
                    db.run('UPDATE loans SET status = ? WHERE loan_id = ?', ['PAID_OFF', loan_id]);
                }
                
                res.json({
                    payment_id: paymentId,
                    loan_id: loan_id,
                    message: 'Payment recorded successfully.',
                    remaining_balance: remainingBalance,
                    emis_left: emisLeft
                });
            });
        });
    });
});

router.get('/:loan_id/ledger', (req, res) => {
    const { loan_id } = req.params;
    
    db.get('SELECT * FROM loans WHERE loan_id = ?', [loan_id], (err, loan) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!loan) {
            return res.status(404).json({ error: 'Loan not found' });
        }
        
        db.all('SELECT * FROM payments WHERE loan_id = ? ORDER BY payment_date', 
               [loan_id], (err, payments) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
            const remainingBalance = loan.total_amount - totalPaid;
            const emisLeft = remainingBalance > 0 ? Math.ceil(remainingBalance / loan.monthly_emi) : 0;
            
            const transactions = payments.map(payment => ({
                transaction_id: payment.payment_id,
                date: payment.payment_date,
                amount: payment.amount,
                type: payment.payment_type
            }));
            
            res.json({
                loan_id: loan.loan_id,
                customer_id: loan.customer_id,
                principal: loan.principal_amount,
                total_amount: loan.total_amount,
                monthly_emi: loan.monthly_emi,
                amount_paid: totalPaid,
                balance_amount: remainingBalance,
                emis_left: emisLeft,
                transactions: transactions
            });
        });
    });
});



module.exports = router;
