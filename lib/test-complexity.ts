/**
 * Test file for complexity analyzer
 * This file can be run to test different code patterns
 */

import { estimateComplexity } from "./complexity-analyzer";

// Test cases for different complexity patterns
const testCases = [
    {
        name: "Constant Time - Simple Assignment",
        code: `
function getFirst(arr) {
    return arr[0];
}
        `,
        expected: "O(1)",
    },
    {
        name: "Linear Time - Single Loop",
        code: `
function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}
        `,
        expected: "O(n)",
    },
    {
        name: "Quadratic Time - Nested Loops",
        code: `
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
        expected: "O(n²)",
    },
    {
        name: "Logarithmic Time - Binary Search",
        code: `
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
        expected: "O(log n)",
    },
    {
        name: "Exponential Time - Recursive Fibonacci",
        code: `
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
        `,
        expected: "O(2^n)",
    },
    {
        name: "Linearithmic Time - Merge Sort",
        code: `
function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}
        `,
        expected: "O(n log n)",
    },
];

export function runComplexityTests() {
    console.log("🧪 Running Complexity Analyzer Tests\n");

    testCases.forEach((testCase, index) => {
        const result = estimateComplexity(testCase.code);
        const passed = result.complexity === testCase.expected;

        console.log(`Test ${index + 1}: ${testCase.name}`);
        console.log(`Expected: ${testCase.expected}`);
        console.log(`Got: ${result.complexity}`);
        console.log(`Confidence: ${result.confidence}`);
        console.log(`Patterns: ${result.patterns.join(", ")}`);
        console.log(`Status: ${passed ? "✅ PASS" : "❌ FAIL"}`);
        console.log("---");
    });
}

// Uncomment to run tests
// runComplexityTests();
