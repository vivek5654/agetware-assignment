function formatIndianCurrency(number) {
    const [integer, decimal] = number.toString().split('.');
    
    if (integer.length <= 3) {
        return decimal ? `${integer}.${decimal}` : integer;
    }
    
    const reversed = integer.split('').reverse();
    const formatted = [];
    
    for (let i = 0; i < 3; i++) {
        formatted.push(reversed[i]);
    }
    
    formatted.push(',');
    
    for (let i = 3; i < reversed.length; i += 2) {
        formatted.push(reversed[i]);
        if (i + 1 < reversed.length) {
            formatted.push(reversed[i + 1]);
        }
        if (i + 2 < reversed.length) {
            formatted.push(',');
        }
    }
    
    let result = formatted.reverse().join('');
    return decimal ? `${result}.${decimal}` : result;
}

console.log("123456.7891 ->", formatIndianCurrency(123456.7891));
console.log("1234567 ->", formatIndianCurrency(1234567));
console.log("123 ->", formatIndianCurrency(123));
