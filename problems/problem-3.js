function minimizeLoss(prices) {
    let minLoss = Infinity;
    let buyYear = -1;
    let sellYear = -1;
    
    for (let buy = 0; buy < prices.length - 1; buy++) {
        for (let sell = buy + 1; sell < prices.length; sell++) {
            if (prices[buy] > prices[sell]) {
                const loss = prices[buy] - prices[sell];
                if (loss < minLoss) {
                    minLoss = loss;
                    buyYear = buy + 1;
                    sellYear = sell + 1;
                }
            }
        }
    }
    
    return minLoss === Infinity 
        ? { message: "No profitable loss scenario found" }
        : { buyYear, sellYear, loss: minLoss };
}

const prices1 = [20, 15, 7, 2, 13];
console.log("Prices:", prices1);
console.log("Result:", minimizeLoss(prices1));

const prices2 = [5, 10, 15, 20];
console.log("Prices:", prices2);
console.log("Result:", minimizeLoss(prices2));
