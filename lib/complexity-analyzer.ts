export interface ComplexityResult {
    complexity: string;
    patterns: string[];
    explanation: string;
}

interface Pattern {
    type: string;
    complexity: string;
    weight: number;
    description: string;
}

type Language = "python" | "javascript";

type PatternRule = Pattern & {
    regex: RegExp;
};

export function estimateComplexity(code: string): ComplexityResult {
    const language = detectLanguage(code);
    const patterns = detectComplexityPatterns(code, language);
    const complexity = determineComplexity(patterns);
    const explanation = generateExplanation(complexity, patterns);

    return {
        complexity,
        patterns: patterns.map((p) => p.type),
        explanation,
    };
}

function detectLanguage(code: string): Language {
    if (/\bdef\s.*:/.test(code) || /\bimport\b/.test(code)) {
        return "python";
    }
    return "javascript";
}

const JAVASCRIPT_PATTERNS: ReadonlyArray<PatternRule> = [
    {
        regex: /function\s+(\w+)\s*\([^)]*\)\s*\{[\s\S]*?\b\1\b\s*\(.*\)[\s\S]*?\b\1\b\s*\(/,
        type: "exponential_recursion",
        complexity: "O(2^n)",
        weight: 5,
        description: "Exponential recursion detected",
    },
    {
        regex: /\bfor\b\s*\(.*?\)\s*\{[\s\S]*?\bfor\b\s*\(.*?\)/,
        type: "nested_loops",
        complexity: "O(n²)",
        weight: 4,
        description: "Nested loops detected",
    },
    {
        regex: /\.sort\s*\(/,
        type: "sorting",
        complexity: "O(n log n)",
        weight: 3,
        description: "Sorting operation (.sort) detected",
    },
    {
        regex: /\b(for|while|forEach)\b\s*\(/,
        type: "single_loop",
        complexity: "O(n)",
        weight: 2,
        description: "Single loop detected",
    },
    {
        regex: /\.(find|filter|map|reduce|keys|values)\s*\(/,
        type: "array_operations",
        complexity: "O(n)",
        weight: 2,
        description: "Array/Object iteration detected",
    },
    {
        regex: /while\s*\(.*\)[\s\S]*?\b(mid|middle)\b\s*=/,
        type: "binary_search",
        complexity: "O(log n)",
        weight: 2,
        description: "Binary search pattern detected",
    },
    {
        regex: /\b(new Map|new Set)\b/,
        type: "hash_operations",
        complexity: "O(1)",
        weight: 1,
        description: "Hash table usage detected (Map, Set)",
    },
];

const PYTHON_PATTERNS: ReadonlyArray<PatternRule> = [
    {
        regex: /\bdef\s+(\w+)\([^)]*\):\s*.*?return.*?\b\1\b.*?\+.*?\b\1\b/,
        type: "exponential_recursion",
        complexity: "O(2^n)",
        weight: 5,
        description: "Exponential recursion detected",
    },
    {
        regex: /\b(for|while)\b.*:.*\n\s+.*\b(for|while)\b.*:/,
        type: "nested_loops",
        complexity: "O(n²)",
        weight: 4,
        description: "Nested loops detected",
    },
    {
        regex: /\.sort\(\)|sorted\(/,
        type: "sorting",
        complexity: "O(n log n)",
        weight: 3,
        description: "Sorting operation detected",
    },
    {
        regex: /\b(for|while)\b.*:/,
        type: "single_loop",
        complexity: "O(n)",
        weight: 2,
        description: "Single loop detected",
    },
    {
        regex: /\bwhile\b.*:[\s\S]*?\b(mid|middle)\b\s*=/,
        type: "binary_search",
        complexity: "O(log n)",
        weight: 2,
        description: "Binary search pattern detected",
    },
    {
        regex: /(\bset\s*\(|\bdict\s*\(|\{\})/,
        type: "hash_operations",
        complexity: "O(1)",
        weight: 1,
        description: "Hash table usage detected (set, dict)",
    },
];

function getPatternRules(language: Language): ReadonlyArray<PatternRule> {
    if (language === "python") {
        return PYTHON_PATTERNS;
    }
    return JAVASCRIPT_PATTERNS;
}

function detectComplexityPatterns(code: string, language: Language): Pattern[] {
    const patterns: Pattern[] = [];
    const rules = getPatternRules(language);

    for (const rule of rules) {
        if (rule.regex.test(code)) {
            // Destructure to exclude the 'regex' property from the final pattern object
            const { regex, ...patternInfo } = rule;
            patterns.push(patternInfo);
        }
    }

    // Fallback to O(1) if no other patterns are detected.
    if (patterns.length === 0) {
        patterns.push({
            type: "constant",
            complexity: "O(1)",
            weight: 1,
            description: "No complex patterns found, likely constant time",
        });
    }

    return patterns;
}

function determineComplexity(patterns: Pattern[]): string {
    if (patterns.length === 0) {
        return "O(1)";
    }
    const complexities: Record<string, number> = {
        "O(1)": 1,
        "O(log n)": 2,
        "O(n)": 3,
        "O(n log n)": 4,
        "O(n²)": 5,
        "O(2^n)": 6,
    };
    let maxComplexity = "O(1)";
    let maxWeight = 0;
    for (const pattern of patterns) {
        const weight =
            complexities[pattern.complexity as keyof typeof complexities] || 0;
        if (weight > maxWeight) {
            maxWeight = weight;
            maxComplexity = pattern.complexity;
        }
    }
    return maxComplexity;
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
    const detectedPatterns = [
        ...new Set(patterns.map((p) => p.description)),
    ].join(", ");
    return `${baseExplanation}. Detected patterns: ${detectedPatterns}`;
}
