function combineLists(list1, list2) {
    const combined = [...list1, ...list2];
    combined.sort((a, b) => a.positions[0] - b.positions[0]);
    
    const result = [];
    
    for (const current of combined) {
        let merged = false;
        
        for (let i = 0; i < result.length; i++) {
            if (shouldCombine(result[i], current)) {
                result[i].values = [...result[i].values, ...current.values];
                merged = true;
                break;
            }
        }
        
        if (!merged) {
            result.push({ ...current });
        }
    }
    
    return result;
}

function shouldCombine(elem1, elem2) {
    const [left1, right1] = elem1.positions;
    const [left2, right2] = elem2.positions;
    
    const overlapStart = Math.max(left1, left2);
    const overlapEnd = Math.min(right1, right2);
    const overlap = Math.max(0, overlapEnd - overlapStart);
    
    const length1 = right1 - left1;
    const length2 = right2 - left2;
    
    return overlap > length1 / 2 || overlap > length2 / 2;
}

const list1 = [
    { positions: [0, 5], values: ["A", "B"] },
    { positions: [10, 15], values: ["C"] }
];

const list2 = [
    { positions: [3, 8], values: ["D"] },
    { positions: [12, 18], values: ["E", "F"] }
];

console.log("List 1:", list1);
console.log("List 2:", list2);
console.log("Combined:", combineLists(list1, list2));
