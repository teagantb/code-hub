/**
 * Time Complexity Analyzer
 * Analyzes code to estimate time complexity using simple pattern matching
 */

export interface ComplexityResult {
    complexity: string;
    confidence: "low" | "medium" | "high";
    patterns: string[];
    explanation: string;
}

export function estimateComplexity(code: string): ComplexityResult {
    const patterns = detectComplexityPatterns(code);
    const complexity = determineComplexity(patterns);
    const confidence = calculateConfidence(patterns);
    const explanation = generateExplanation(complexity, patterns);

    return {
        complexity,
        confidence,
        patterns: patterns.map((p) => p.type),
        explanation,
    };
}

interface Pattern {
    type: string;
    complexity: string;
    weight: number;
    description: string;
}

function detectComplexityPatterns(code: string): Pattern[] {
    const patterns: Pattern[] = [];
    const lines = code.split("\n");

    // Remove comments and empty lines for analysis
    const cleanLines = lines
        .map((line) => line.trim())
        .filter(
            (line) =>
                line &&
                !line.startsWith("//") &&
                !line.startsWith("/*") &&
                !line.startsWith("*")
        );

    // Check for nested loops (O(n²) or higher)
    const nestedLoopPattern = /for\s*\([^)]*\)\s*\{[\s\S]*for\s*\([^)]*\)/;
    if (nestedLoopPattern.test(code)) {
        patterns.push({
            type: "nested_loops",
            complexity: "O(n²)",
            weight: 3,
            description: "Nested loops detected",
        });
    }

    // Check for single loops (O(n))
    const singleLoopPattern =
        /for\s*\([^)]*\)|while\s*\([^)]*\)|do\s*\{[^}]*\}\s*while/;
    if (singleLoopPattern.test(code)) {
        patterns.push({
            type: "single_loop",
            complexity: "O(n)",
            weight: 1,
            description: "Single loop detected",
        });
    }

    // Check for recursive calls (O(2^n) or O(n))
    const recursivePattern = /function\s+\w+.*\w+\s*\(/;
    if (recursivePattern.test(code)) {
        patterns.push({
            type: "recursion",
            complexity: "O(2^n)",
            weight: 4,
            description: "Recursive function detected",
        });
    }

    // Check for binary search patterns (O(log n))
    const binarySearchPattern =
        /(mid|middle|binary|search).*\/\s*2|Math\.floor.*\/\s*2/;
    if (binarySearchPattern.test(code)) {
        patterns.push({
            type: "binary_search",
            complexity: "O(log n)",
            weight: 2,
            description: "Binary search pattern detected",
        });
    }

    // Check for sorting algorithms
    const sortingPattern = /sort|bubble|quick|merge|heap|insertion|selection/;
    if (sortingPattern.test(code)) {
        patterns.push({
            type: "sorting",
            complexity: "O(n log n)",
            weight: 2,
            description: "Sorting algorithm detected",
        });
    }

    // Check for hash table operations (O(1) average)
    const hashPattern = /Map|Set|HashMap|HashSet|Object\.keys|Object\.values/;
    if (hashPattern.test(code)) {
        patterns.push({
            type: "hash_operations",
            complexity: "O(1)",
            weight: 1,
            description: "Hash table operations detected",
        });
    }

    // Check for array operations that might be O(n)
    const arrayOpsPattern =
        /\.indexOf|\.find|\.filter|\.map|\.reduce|\.some|\.every/;
    if (arrayOpsPattern.test(code)) {
        patterns.push({
            type: "array_operations",
            complexity: "O(n)",
            weight: 1,
            description: "Array operations detected",
        });
    }

    // Check for constant time operations
    if (patterns.length === 0 && cleanLines.length < 10) {
        patterns.push({
            type: "constant",
            complexity: "O(1)",
            weight: 1,
            description: "Simple operations, likely constant time",
        });
    }

    return patterns;
}

function determineComplexity(patterns: Pattern[]): string {
    if (patterns.length === 0) {
        return "O(1)";
    }

    // Sort patterns by weight (higher weight = more significant)
    const sortedPatterns = patterns.sort((a, b) => b.weight - a.weight);

    // Return the highest complexity found
    const complexities = {
        "O(1)": 1,
        "O(log n)": 2,
        "O(n)": 3,
        "O(n log n)": 4,
        "O(n²)": 5,
        "O(2^n)": 6,
    };

    let maxComplexity = "O(1)";
    let maxWeight = 0;

    for (const pattern of sortedPatterns) {
        const weight =
            complexities[pattern.complexity as keyof typeof complexities] || 1;
        if (weight > maxWeight) {
            maxWeight = weight;
            maxComplexity = pattern.complexity;
        }
    }

    return maxComplexity;
}

function calculateConfidence(patterns: Pattern[]): "low" | "medium" | "high" {
    if (patterns.length === 0) {
        return "low";
    }

    const totalWeight = patterns.reduce(
        (sum, pattern) => sum + pattern.weight,
        0
    );

    if (totalWeight >= 5) {
        return "high";
    } else if (totalWeight >= 3) {
        return "medium";
    } else {
        return "low";
    }
}

function generateExplanation(complexity: string, patterns: Pattern[]): string {
    const explanations: Record<string, string> = {
        "O(1)": "Constant time - executes in fixed time regardless of input size",
        "O(log n)":
            "Logarithmic time - time increases logarithmically with input size",
        "O(n)": "Linear time - time increases linearly with input size",
        "O(n log n)": "Linearithmic time - time increases as n times log n",
        "O(n²)":
            "Quadratic time - time increases quadratically with input size",
        "O(2^n)": "Exponential time - time doubles with each additional input",
    };

    const baseExplanation = explanations[complexity] || "Unknown complexity";
    const detectedPatterns = patterns.map((p) => p.description).join(", ");

    return `${baseExplanation}. Detected patterns: ${detectedPatterns}`;
}
