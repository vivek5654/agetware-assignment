const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.get('/:customer_id/overview', (req, res) => {
    const { customer_id } = req.params;
    
    const query = `
        SELECT 
            l.loan_id,
            l.principal_amount as principal,
            l.total_amount,
            (l.total_amount - l.principal_amount) as total_interest,
            l.monthly_emi as emi_amount,
            COALESCE(SUM(p.amount), 0) as amount_paid
        FROM loans l
        LEFT JOIN payments p ON l.loan_id = p.loan_id
        WHERE l.customer_id = ?
        GROUP BY l.loan_id
    `;
    
    db.all(query, [customer_id], (err, loans) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (loans.length === 0) {
            return res.status(404).json({ error: 'Customer not found or has no loans' });
        }
        
        const loansWithDetails = loans.map(loan => {
            const remainingBalance = loan.total_amount - loan.amount_paid;
            const emisLeft = Math.ceil(remainingBalance / loan.emi_amount);
            
            return {
                loan_id: loan.loan_id,
                principal: loan.principal,
                total_amount: loan.total_amount,
                total_interest: loan.total_interest,
                emi_amount: loan.emi_amount,
                amount_paid: loan.amount_paid,
                emis_left: emisLeft
            };
        });
        
        res.json({
            customer_id: customer_id,
            total_loans: loans.length,
            loans: loansWithDetails
        });
    });
});

module.exports = router;
