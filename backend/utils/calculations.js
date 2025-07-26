function calculateLoanDetails(principal, years, rate) {
    const interest = (principal * years * rate) / 100;
    const totalAmount = principal + interest;
    const monthlyEMI = totalAmount / (years * 12);
    
    return {
        interest,
        totalAmount,
        monthlyEMI: Math.round(monthlyEMI * 100) / 100
    };
}

function calculateRemainingEMIs(remainingBalance, monthlyEMI) {
    return Math.ceil(remainingBalance / monthlyEMI);
}

module.exports = {
    calculateLoanDetails,
    calculateRemainingEMIs
};
