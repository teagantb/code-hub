import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // Create users
    const users = await Promise.all([
        prisma.user.upsert({
            where: { email: "john@example.com" },
            update: {},
            create: {
                id: "user_1",
                name: "John Doe",
                email: "john@example.com",
                password: await bcrypt.hash("password123", 10),
                username: "johndoe",
                bio: "Full-stack developer passionate about clean code and modern web technologies.",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            },
        }),
        prisma.user.upsert({
            where: { email: "jane@example.com" },
            update: {},
            create: {
                id: "user_2",
                name: "Jane Smith",
                email: "jane@example.com",
                password: await bcrypt.hash("password123", 10),
                username: "janesmith",
                bio: "Frontend developer specializing in React and TypeScript.",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            },
        }),
        prisma.user.upsert({
            where: { email: "mike@example.com" },
            update: {},
            create: {
                id: "user_3",
                name: "Mike Johnson",
                email: "mike@example.com",
                password: await bcrypt.hash("password123", 10),
                username: "mikej",
                bio: "Backend developer with expertise in Node.js, Python, and database design.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            },
        }),
    ]);

    console.log("✅ Users created");

    // Create tags
    const tags = await Promise.all([
        prisma.tag.upsert({
            where: { name: "javascript" },
            update: {},
            create: { name: "javascript" },
        }),
        prisma.tag.upsert({
            where: { name: "python" },
            update: {},
            create: { name: "python" },
        }),
        prisma.tag.upsert({
            where: { name: "algorithm" },
            update: {},
            create: { name: "algorithm" },
        }),
        prisma.tag.upsert({
            where: { name: "data-structure" },
            update: {},
            create: { name: "data-structure" },
        }),
        prisma.tag.upsert({
            where: { name: "sorting" },
            update: {},
            create: { name: "sorting" },
        }),
        prisma.tag.upsert({
            where: { name: "search" },
            update: {},
            create: { name: "search" },
        }),
        prisma.tag.upsert({
            where: { name: "math" },
            update: {},
            create: { name: "math" },
        }),
        prisma.tag.upsert({
            where: { name: "string" },
            update: {},
            create: { name: "string" },
        }),
    ]);

    console.log("✅ Tags created");

    // Create snippets
    const snippets = await Promise.all([
        prisma.snippet.create({
            data: {
                id: "snippet_1",
                title: "Basic Calculator Functions",
                code: `function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
}

// Usage
console.log(add(5, 3));      // 8
console.log(subtract(10, 4)); // 6
console.log(multiply(3, 7)); // 21
console.log(divide(15, 3));  // 5`,
                language: "javascript",
                description: "Basic arithmetic operations with error handling",
                topic: "Basic Functions",
                complexity: "O(1)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_2",
                title: "Bubble Sort Algorithm",
                code: `function bubbleSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    
    return arr;
}

// Usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort(numbers)); // [11, 12, 22, 25, 34, 64, 90]`,
                language: "javascript",
                description:
                    "Simple bubble sort implementation for sorting arrays",
                topic: "Sorting",
                complexity: "O(n²)",
                isPublic: true,
                authorId: users[1].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_3",
                title: "Palindrome Checker",
                code: `function isPalindrome(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const reversed = cleaned.split('').reverse().join('');
    
    return cleaned === reversed;
}

// Usage
console.log(isPalindrome("racecar"));  // true
console.log(isPalindrome("hello"));    // false
console.log(isPalindrome("A man a plan a canal Panama")); // true`,
                language: "javascript",
                description:
                    "Check if a string is a palindrome (reads same forwards and backwards)",
                topic: "String Algorithms",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[2].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_4",
                title: "Linear Search",
                code: `function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i; // Return index if found
        }
    }
    return -1; // Return -1 if not found
}

// Usage
const numbers = [2, 4, 6, 8, 10, 12];
console.log(linearSearch(numbers, 6)); // 2
console.log(linearSearch(numbers, 5));  // -1`,
                language: "javascript",
                description:
                    "Simple linear search to find an element in an array",
                topic: "Search Algorithms",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_5",
                title: "Stack Implementation",
                code: `class Stack {
    constructor() {
        this.items = [];
    }
    
    push(element) {
        this.items.push(element);
    }
    
    pop() {
        if (this.isEmpty()) return "Stack is empty";
        return this.items.pop();
    }
    
    peek() {
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
}

// Usage
const stack = new Stack();
stack.push(1);
stack.push(2);
console.log(stack.pop()); // 2`,
                language: "javascript",
                description:
                    "Basic stack data structure with push, pop, and peek operations",
                topic: "Data Structures",
                complexity: "O(1)",
                isPublic: true,
                authorId: users[1].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_6",
                title: "Queue Implementation",
                code: `class Queue {
    constructor() {
        this.items = [];
    }
    
    enqueue(element) {
        this.items.push(element);
    }
    
    dequeue() {
        if (this.isEmpty()) return "Queue is empty";
        return this.items.shift();
    }
    
    front() {
        if (this.isEmpty()) return "Queue is empty";
        return this.items[0];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
}

// Usage
const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue()); // 1`,
                language: "javascript",
                description:
                    "Basic queue data structure with FIFO (First In, First Out) operations",
                topic: "Data Structures",
                complexity: "O(1)",
                isPublic: true,
                authorId: users[2].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_7",
                title: "Factorial Function",
                code: `function factorial(n) {
    if (n < 0) return "Invalid input";
    if (n === 0 || n === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Usage
console.log(factorial(5)); // 120
console.log(factorial(0)); // 1
console.log(factorial(3)); // 6`,
                language: "javascript",
                description:
                    "Calculate factorial of a number using iterative approach",
                topic: "Mathematical Functions",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[1].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_8",
                title: "Fibonacci Sequence",
                code: `function fibonacci(n) {
    if (n <= 0) return [];
    if (n === 1) return [0];
    if (n === 2) return [0, 1];
    
    const sequence = [0, 1];
    for (let i = 2; i < n; i++) {
        sequence.push(sequence[i-1] + sequence[i-2]);
    }
    return sequence;
}

// Usage
console.log(fibonacci(8)); // [0, 1, 1, 2, 3, 5, 8, 13]
console.log(fibonacci(5)); // [0, 1, 1, 2, 3]`,
                language: "javascript",
                description: "Generate Fibonacci sequence up to n terms",
                topic: "Mathematical Functions",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
    ]);

    console.log("✅ Snippets created");

    // Create snippet-tag relationships
    const snippetTags = await Promise.all([
        // Basic Calculator - math, javascript
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[0].id,
                tagId: tags.find((t) => t.name === "math")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[0].id,
                tagId: tags.find((t) => t.name === "javascript")!.id,
            },
        }),
        // Bubble Sort - sorting, algorithm, javascript
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[1].id,
                tagId: tags.find((t) => t.name === "sorting")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[1].id,
                tagId: tags.find((t) => t.name === "algorithm")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[1].id,
                tagId: tags.find((t) => t.name === "javascript")!.id,
            },
        }),
        // Palindrome - string, algorithm, javascript
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[2].id,
                tagId: tags.find((t) => t.name === "string")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[2].id,
                tagId: tags.find((t) => t.name === "algorithm")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[2].id,
                tagId: tags.find((t) => t.name === "javascript")!.id,
            },
        }),
        // Linear Search - search, algorithm, javascript
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[3].id,
                tagId: tags.find((t) => t.name === "search")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[3].id,
                tagId: tags.find((t) => t.name === "algorithm")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[3].id,
                tagId: tags.find((t) => t.name === "javascript")!.id,
            },
        }),
        // Stack - data-structure, javascript
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[4].id,
                tagId: tags.find((t) => t.name === "data-structure")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[4].id,
                tagId: tags.find((t) => t.name === "javascript")!.id,
            },
        }),
        // Queue - data-structure, javascript
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[5].id,
                tagId: tags.find((t) => t.name === "data-structure")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[5].id,
                tagId: tags.find((t) => t.name === "javascript")!.id,
            },
        }),
        // Factorial - math, algorithm, javascript
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[6].id,
                tagId: tags.find((t) => t.name === "math")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[6].id,
                tagId: tags.find((t) => t.name === "algorithm")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[6].id,
                tagId: tags.find((t) => t.name === "javascript")!.id,
            },
        }),
        // Fibonacci - math, algorithm, javascript
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[7].id,
                tagId: tags.find((t) => t.name === "math")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[7].id,
                tagId: tags.find((t) => t.name === "algorithm")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[7].id,
                tagId: tags.find((t) => t.name === "javascript")!.id,
            },
        }),
    ]);

    console.log("✅ Snippet-tag relationships created");

    console.log("🎉 Seed completed successfully!");
    console.log(`Created ${users.length} users`);
    console.log(`Created ${tags.length} tags`);
    console.log(`Created ${snippets.length} snippets`);
    console.log(`Created ${snippetTags.length} snippet-tag relationships`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
