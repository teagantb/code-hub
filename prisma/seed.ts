import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // 1. Clear existing data
    console.log("🧹 Clearing existing data...");
    await prisma.snippetTag.deleteMany();
    await prisma.snippet.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();
    console.log("✅ Database cleared");

    // 2. Create users
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
                bio: "Full-stack developer passionate about clean code.",
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
                bio: "Backend developer with expertise in Node.js and Python.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            },
        }),
    ]);
    console.log(`✅ ${users.length} users created`);

    // 3. Create tags
    const tags = await Promise.all([
        prisma.tag.upsert({
            where: { name: "array" },
            update: {},
            create: { name: "array" },
        }),
        prisma.tag.upsert({
            where: { name: "string" },
            update: {},
            create: { name: "string" },
        }),
        prisma.tag.upsert({
            where: { name: "math" },
            update: {},
            create: { name: "math" },
        }),
        prisma.tag.upsert({
            where: { name: "hash-table" },
            update: {},
            create: { name: "hash-table" },
        }),
        prisma.tag.upsert({
            where: { name: "two-pointers" },
            update: {},
            create: { name: "two-pointers" },
        }),
        prisma.tag.upsert({
            where: { name: "sorting" },
            update: {},
            create: { name: "sorting" },
        }),
        prisma.tag.upsert({
            where: { name: "greedy" },
            update: {},
            create: { name: "greedy" },
        }),
        prisma.tag.upsert({
            where: { name: "binary-search" },
            update: {},
            create: { name: "binary-search" },
        }),
    ]);
    console.log(`✅ ${tags.length} tags created`);

    // 4. Create snippets with basic and easy LeetCode problems
    const snippets = await Promise.all([
        // Snippet 1: Hello World (Python)
        prisma.snippet.create({
            data: {
                id: "snippet_1",
                title: "Hello, World!",
                code: `print("Hello, World!")`,
                language: "python",
                description: "The classic first program in any language.",
                topic: "Fundamentals",
                complexity: "O(1)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
        // Snippet 2: Check Even or Odd (JavaScript)
        prisma.snippet.create({
            data: {
                id: "snippet_2",
                title: "Check Even or Odd",
                code: `function isEvenOrOdd(number) {
    return number % 2 === 0 ? 'Even' : 'Odd';
}

// Example: isEvenOrOdd(4) returns 'Even'`,
                language: "javascript",
                description:
                    "Checks if a number is even or odd using the modulo operator.",
                topic: "Math",
                complexity: "O(1)",
                isPublic: true,
                authorId: users[1].id,
            },
        }),
        // Snippet 3: Find Maximum in Array (TypeScript)
        prisma.snippet.create({
            data: {
                id: "snippet_3",
                title: "Find Maximum in Array",
                code: `function findMax(numbers: number[]): number {
    if (numbers.length === 0) {
        throw new Error("Array cannot be empty");
    }
    return Math.max(...numbers);
}

// Example: findMax([1, 5, 2, 9, 3]) returns 9`,
                language: "typescript",
                description: "Finds the largest number in an array of numbers.",
                topic: "Array",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[2].id,
            },
        }),
        // Snippet 4: Two Sum (Python)
        prisma.snippet.create({
            data: {
                id: "snippet_4",
                title: "Two Sum",
                code: `def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []

# Example: two_sum([2, 7, 11, 15], 9) returns [0, 1]`,
                language: "python",
                description:
                    "Find two numbers in an array that add up to a specific target.",
                topic: "Array, Hash Table",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
        // Snippet 5: Reverse a String (JavaScript)
        prisma.snippet.create({
            data: {
                id: "snippet_5",
                title: "Reverse a String",
                code: `function reverseString(str) {
    return str.split('').reverse().join('');
}

// Example: reverseString("hello") returns "olleh"`,
                language: "javascript",
                description: "Reverses a given string.",
                topic: "String",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[1].id,
            },
        }),
        // Snippet 6: Factorial (TypeScript)
        prisma.snippet.create({
            data: {
                id: "snippet_6",
                title: "Factorial (Iterative)",
                code: `function factorial(n: number): number {
    if (n < 0) return -1; // Or throw an error
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Example: factorial(5) returns 120`,
                language: "typescript",
                description:
                    "Calculates the factorial of a non-negative integer.",
                topic: "Math",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[2].id,
            },
        }),
        // Snippet 7: FizzBuzz (Python)
        prisma.snippet.create({
            data: {
                id: "snippet_7",
                title: "FizzBuzz",
                code: `def fizz_buzz(n):
    result = []
    for i in range(1, n + 1):
        if i % 3 == 0 and i % 5 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result

# Example: fizz_buzz(5) returns ['1', '2', 'Fizz', '4', 'Buzz']`,
                language: "python",
                description:
                    "A classic interview problem to test basic loop and conditional logic.",
                topic: "Fundamentals, Math",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
        // Snippet 8: Contains Duplicate (JavaScript)
        prisma.snippet.create({
            data: {
                id: "snippet_8",
                title: "Contains Duplicate",
                code: `function containsDuplicate(nums) {
    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) {
            return true;
        }
        seen.add(num);
    }
    return false;
}

// Example: containsDuplicate([1, 2, 3, 1]) returns true`,
                language: "javascript",
                description:
                    "Checks if an array contains any duplicate elements.",
                topic: "Array, Hash Table",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[1].id,
            },
        }),
        // Snippet 9: Valid Anagram (TypeScript)
        prisma.snippet.create({
            data: {
                id: "snippet_9",
                title: "Valid Anagram",
                code: `function isAnagram(s: string, t: string): boolean {
    if (s.length !== t.length) return false;
    const sortedS = s.split('').sort().join('');
    const sortedT = t.split('').sort().join('');
    return sortedS === sortedT;
}

// Example: isAnagram("anagram", "nagaram") returns true`,
                language: "typescript",
                description:
                    "Checks if two strings are anagrams of each other.",
                topic: "String, Sorting",
                complexity: "O(n log n)",
                isPublic: true,
                authorId: users[2].id,
            },
        }),
        // Snippet 10: Sum of Array (Python)
        prisma.snippet.create({
            data: {
                id: "snippet_10",
                title: "Sum of Array",
                code: `def sum_array(numbers):
    return sum(numbers)

# Example: sum_array([1, 2, 3, 4]) returns 10`,
                language: "python",
                description: "Calculates the sum of all numbers in a list.",
                topic: "Array, Math",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
        // Snippet 11: Valid Palindrome (JavaScript)
        prisma.snippet.create({
            data: {
                id: "snippet_11",
                title: "Valid Palindrome",
                code: `function isPalindrome(s) {
    const cleaned = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    let left = 0;
    let right = cleaned.length - 1;
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

// Example: isPalindrome("A man, a plan, a canal: Panama") returns true`,
                language: "javascript",
                description:
                    "Checks if a string is a palindrome, ignoring non-alphanumeric characters.",
                topic: "String, Two Pointers",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[1].id,
            },
        }),
        // Snippet 12: Binary Search (TypeScript)
        prisma.snippet.create({
            data: {
                id: "snippet_12",
                title: "Binary Search",
                code: `function binarySearch(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1; // Target not found
}

// Example: binarySearch([-1,0,3,5,9,12], 9) returns 4`,
                language: "typescript",
                description:
                    "Finds the index of a target value in a sorted array.",
                topic: "Array, Binary Search",
                complexity: "O(log n)",
                isPublic: true,
                authorId: users[2].id,
            },
        }),
        // Snippet 13: Maximum Subarray (Python)
        prisma.snippet.create({
            data: {
                id: "snippet_13",
                title: "Maximum Subarray",
                code: `def max_sub_array(nums):
    max_so_far = nums[0]
    max_ending_here = nums[0]
    for x in nums[1:]:
        max_ending_here = max(x, max_ending_here + x)
        max_so_far = max(max_so_far, max_ending_here)
    return max_so_far

# Example: max_sub_array([-2,1,-3,4,-1,2,1,-5,4]) returns 6`,
                language: "python",
                description:
                    "Finds the contiguous subarray with the largest sum (Kadane's Algorithm).",
                topic: "Array, Greedy",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
        // Snippet 14: Valid Parentheses (JavaScript)
        prisma.snippet.create({
            data: {
                id: "snippet_14",
                title: "Valid Parentheses",
                code: `function isValid(s) {
    const stack = [];
    const map = { "(": ")", "[": "]", "{": "}" };
    for (let char of s) {
        if (map[char]) {
            stack.push(map[char]);
        } else if (stack.length > 0 && stack[stack.length - 1] === char) {
            stack.pop();
        } else {
            return false;
        }
    }
    return stack.length === 0;
}

// Example: isValid("()[]{}") returns true`,
                language: "javascript",
                description:
                    "Determines if the input string of brackets is valid.",
                topic: "String, Hash Table",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[1].id,
            },
        }),
        // Snippet 15: Move Zeroes (TypeScript)
        prisma.snippet.create({
            data: {
                id: "snippet_15",
                title: "Move Zeroes",
                code: `function moveZeroes(nums: number[]): void {
    let lastNonZeroFoundAt = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            [nums[lastNonZeroFoundAt], nums[i]] = [nums[i], nums[lastNonZeroFoundAt]];
            lastNonZeroFoundAt++;
        }
    }
}

// Example: moveZeroes([0,1,0,3,12]) modifies array to [1,3,12,0,0]`,
                language: "typescript",
                description:
                    "Moves all zeroes to the end of an array in-place.",
                topic: "Array, Two Pointers",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[2].id,
            },
        }),
    ]);
    console.log(`✅ ${snippets.length} snippets created`);

    // 5. Create snippet-tag relationships
    const snippetTagsData = [
        // Snippet 3: Find Max -> array
        { snippetIndex: 2, tagName: "array" },
        // Snippet 4: Two Sum -> array, hash-table
        { snippetIndex: 3, tagName: "array" },
        { snippetIndex: 3, tagName: "hash-table" },
        // Snippet 5: Reverse String -> string
        { snippetIndex: 4, tagName: "string" },
        // Snippet 6: Factorial -> math
        { snippetIndex: 5, tagName: "math" },
        // Snippet 7: FizzBuzz -> math
        { snippetIndex: 6, tagName: "math" },
        // Snippet 8: Contains Duplicate -> array, hash-table
        { snippetIndex: 7, tagName: "array" },
        { snippetIndex: 7, tagName: "hash-table" },
        // Snippet 9: Valid Anagram -> string, sorting
        { snippetIndex: 8, tagName: "string" },
        { snippetIndex: 8, tagName: "sorting" },
        // Snippet 10: Sum of Array -> array, math
        { snippetIndex: 9, tagName: "array" },
        { snippetIndex: 9, tagName: "math" },
        // Snippet 11: Valid Palindrome -> string, two-pointers
        { snippetIndex: 10, tagName: "string" },
        { snippetIndex: 10, tagName: "two-pointers" },
        // Snippet 12: Binary Search -> array, binary-search
        { snippetIndex: 11, tagName: "array" },
        { snippetIndex: 11, tagName: "binary-search" },
        // Snippet 13: Maximum Subarray -> array, greedy
        { snippetIndex: 12, tagName: "array" },
        { snippetIndex: 12, tagName: "greedy" },
        // Snippet 14: Valid Parentheses -> string, hash-table
        { snippetIndex: 13, tagName: "string" },
        { snippetIndex: 13, tagName: "hash-table" },
        // Snippet 15: Move Zeroes -> array, two-pointers
        { snippetIndex: 14, tagName: "array" },
        { snippetIndex: 14, tagName: "two-pointers" },
    ];

    await Promise.all(
        snippetTagsData.map((data) => {
            return prisma.snippetTag.create({
                data: {
                    snippetId: snippets[data.snippetIndex].id,
                    tagId: tags.find((t) => t.name === data.tagName)!.id,
                },
            });
        })
    );
    console.log(
        `✅ ${snippetTagsData.length} snippet-tag relationships created`
    );

    console.log("🎉 Seed completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
