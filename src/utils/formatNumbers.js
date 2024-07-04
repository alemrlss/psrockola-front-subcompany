export const formatNumbers = (number) => {
    let numberStr = number.toString();
    
    let parts = numberStr.split(".");
    let integerPart = parts[0];
    let decimalPart = parts.length > 1 ? "." + parts[1] : "";
    
    let result = "";
    for (let i = integerPart.length - 1, j = 1; i >= 0; i--, j++) {
        result = integerPart.charAt(i) + result;
        if (j % 3 === 0 && i !== 0) {
            result = "," + result;
        }
    }
    
    result += decimalPart;
    
    return result;
};
