function caesarCipher(message, shift, encode = true) {
    const shiftAmount = encode ? shift : -shift;
    
    return message.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const isUpperCase = char === char.toUpperCase();
            const baseCharCode = char.toLowerCase().charCodeAt(0);
            const newCharCode = ((baseCharCode - 97 + shiftAmount + 26) % 26) + 97;
            const newChar = String.fromCharCode(newCharCode);
            return isUpperCase ? newChar.toUpperCase() : newChar;
        }
      return char;
    }).join('');
}

console.log("Encode 'HELLO' with shift 3:", caesarCipher("HELLO", 3, true));
console.log("Decode 'KHOOR' with shift 3:", caesarCipher("KHOOR", 3, false));
console.log("Mixed case:", caesarCipher("Hello World!", 5, true));
