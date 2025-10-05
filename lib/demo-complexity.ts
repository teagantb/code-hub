/**
 * Demo file showing how the complexity analyzer works
 * This demonstrates the analyzer with different code patterns
 */

import { estimateComplexity } from "./complexity-analyzer";

// Example code snippets to demonstrate the analyzer
const examples = {
    constantTime: `
function getFirstElement(arr) {
    return arr[0];
}
    `,

    linearTime: `
function findElement(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
    }
    return -1;
}
    `,

    quadraticTime: `
function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}
    `,

    logarithmicTime: `
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
    `,
};

export function demonstrateComplexityAnalyzer() {
    console.log("🔍 Complexity Analyzer Demonstration\n");

    Object.entries(examples).forEach(([name, code]) => {
        const analysis = estimateComplexity(code);

        console.log(`📝 ${name.replace(/([A-Z])/g, " $1").trim()}:`);
        console.log(`   Complexity: ${analysis.complexity}`);
        console.log(`   Confidence: ${analysis.confidence}`);
        console.log(`   Patterns: ${analysis.patterns.join(", ")}`);
        console.log(`   Explanation: ${analysis.explanation}`);
        console.log("");
    });
}

// Export the examples for use in other parts of the application
export { examples };
