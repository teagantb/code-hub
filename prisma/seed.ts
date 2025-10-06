import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await prisma.snippetTag.deleteMany();
    await prisma.snippet.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();
    console.log("✅ Database cleared");

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

    console.log("✅ Tags created");

    // Create snippets - 10 Simple LeetCode Problems
    const snippets = await Promise.all([
        prisma.snippet.create({
            data: {
                id: "snippet_1",
                title: "Two Sum",
                code: `function twoSum(nums: number[], target: number): [number, number] | [] {
    const map: Map<number, number> = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

// Example: twoSum([2,7,11,15], 9) returns [0,1]`,
                language: "typescript",
                description: "Find two numbers in array that add up to target",
                topic: "Array, Hash Table",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_2",
                title: "Valid Parentheses",
                code: `function isValid(s) {
    const stack = [];
    const pairs = {
        '(': ')',
        '[': ']',
        '{': '}'
    };
    
    for (let char of s) {
        if (pairs[char]) {
            stack.push(char);
        } else {
            if (stack.length === 0 || pairs[stack.pop()] !== char) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}

// Example: isValid("()[]{}") returns true`,
                language: "javascript",
                description: "Check if parentheses are valid using stack",
                topic: "String, Stack",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[1].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_3",
                title: "Maximum Subarray (Kadane's Algorithm)",
                code: `def maxSubArray(nums: list[int]) -> int:
    max_so_far = nums[0]
    max_ending_here = nums[0]
    for x in nums[1:]:
        max_ending_here = max(x, max_ending_here + x)
        max_so_far = max(max_so_far, max_ending_here)
    return max_so_far

# Example: maxSubArray([-2,1,-3,4,-1,2,1,-5,4]) returns 6`,
                language: "python",
                description: "Find maximum sum of contiguous subarray",
                topic: "Array, Dynamic Programming",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[2].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_4",
                title: "Remove Duplicates from Sorted Array",
                code: `function removeDuplicates(nums: number[]): number {
    if (nums.length === 0) return 0;
    
    let i = 0;
    for (let j = 1; j < nums.length; j++) {
        if (nums[j] !== nums[i]) {
            i++;
            nums[i] = nums[j];
        }
    }
    
    return i + 1;
}

// Example: removeDuplicates([1,1,2]) returns 2, array becomes [1,2]`,
                language: "typescript",
                description: "Remove duplicates in-place from sorted array",
                topic: "Array, Two Pointers",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_5",
                title: "Reverse String",
                code: `function reverseString(s) {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
}

// Example: reverseString(["h","e","l","l","o"]) becomes ["o","l","l","e","h"]`,
                language: "javascript",
                description: "Reverse string in-place using two pointers",
                topic: "String, Two Pointers",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[1].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_6",
                title: "Binary Search",
                code: `def search(nums, target):
    left = 0
    right = len(nums) - 1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1

# Example: search([-1,0,3,5,9,12], 9) returns 4`,
                language: "python",
                description: "Binary search in sorted array",
                topic: "Array, Binary Search",
                complexity: "O(log n)",
                isPublic: true,
                authorId: users[2].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_7",
                title: "Climbing Stairs",
                code: `function climbStairs(n) {
    if (n <= 2) return n;
    
    let prev2 = 1;
    let prev1 = 2;
    
    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

// Example: climbStairs(3) returns 3`,
                language: "javascript",
                description: "Count ways to climb stairs (Fibonacci pattern)",
                topic: "Math, Dynamic Programming",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_8",
                title: "Best Time to Buy and Sell Stock",
                code: `def maxProfit(prices: list[int]) -> int:
    min_price = prices[0]
    max_profit = 0

    for price in prices[1:]:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price

    return max_profit

# Example: maxProfit([7,1,5,3,6,4]) returns 5`,
                language: "python",
                description:
                    "Find maximum profit from buying and selling stock",
                topic: "Array, Greedy",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[1].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_9",
                title: "Valid Anagram",
                code: `function isAnagram(s: string, t: string): boolean {
    if (s.length !== t.length) return false;
    const count: Record<string, number> = {};
    for (const ch of s) count[ch] = (count[ch] || 0) + 1;
    for (const ch of t) {
        if (!count[ch]) return false;
        count[ch]--;
    }
    return true;
}

// Example: isAnagram("anagram", "nagaram") returns true`,
                language: "typescript",
                description: "Check if two strings are anagrams",
                topic: "String, Hash Table",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[2].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_10",
                title: "Contains Duplicate",
                code: `def containsDuplicate(nums: list[int]) -> bool:
    seen = set()
    for n in nums:
        if n in seen:
            return True
        seen.add(n)
    return False

# Example: containsDuplicate([1,2,3,1]) returns True`,
                language: "python",
                description: "Check if array contains any duplicates",
                topic: "Array, Hash Table",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_11",
                title: "Merge Two Sorted Lists",
                code: `function mergeTwoLists(l1, l2) {
    const dummy = { val: 0, next: null };
    let current = dummy;

    while (l1 && l2) {
        if (l1.val < l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }

    current.next = l1 || l2;
    return dummy.next;
}

// Iterative merge in O(n)`,
                language: "javascript",
                description: "Merge two sorted linked lists",
                topic: "Linked List",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_12",
                title: "Valid Palindrome",
                code: `function isPalindrome(s: string): boolean {
    let i = 0, j = s.length - 1;
    while (i < j) {
        while (i < j && !/[a-z0-9]/i.test(s[i])) i++;
        while (i < j && !/[a-z0-9]/i.test(s[j])) j--;
        if (s[i].toLowerCase() !== s[j].toLowerCase()) return false;
        i++; j--;
    }
    return true;
}`,
                language: "typescript",
                description:
                    "Check if string is palindrome ignoring non-alphanumerics",
                topic: "String, Two Pointers",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[1].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_13",
                title: "Move Zeroes",
                code: `def moveZeroes(nums: list[int]) -> list[int]:
    last_non_zero = 0
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[last_non_zero], nums[i] = nums[i], nums[last_non_zero]
            last_non_zero += 1
    return nums
`,
                language: "python",
                description: "Move all zeroes to end while maintaining order",
                topic: "Array, Two Pointers",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[2].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_14",
                title: "Plus One",
                code: `function plusOne(digits) {
    for (let i = digits.length - 1; i >= 0; i--) {
        if (digits[i] < 9) {
            digits[i]++;
            return digits;
        }
        digits[i] = 0;
    }
    digits.unshift(1);
    return digits;
}`,
                language: "javascript",
                description: "Add one to array-form integer",
                topic: "Array",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_15",
                title: "Min Stack",
                code: `class MinStack {
    private stack: number[];
    private minStack: number[];
    constructor() {
        this.stack = [];
        this.minStack = [];
    }
    push(x: number): void {
        this.stack.push(x);
        const min = this.minStack.length === 0 ? x : Math.min(x, this.minStack[this.minStack.length - 1]);
        this.minStack.push(min);
    }
    pop(): void { this.stack.pop(); this.minStack.pop(); }
    top(): number | undefined { return this.stack[this.stack.length - 1]; }
    getMin(): number | undefined { return this.minStack[this.minStack.length - 1]; }
}`,
                language: "typescript",
                description: "Stack supporting getMin in O(1)",
                topic: "Stack, Design",
                complexity: "O(1)",
                isPublic: true,
                authorId: users[1].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_16",
                title: "Fibonacci (DP)",
                code: `def fib(n: int) -> int:
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
`,
                language: "python",
                description: "Compute nth Fibonacci using iteration",
                topic: "Dynamic Programming, Math",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[2].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_17",
                title: "Count Bits",
                code: `function countBits(n) {
    const res = new Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) {
        res[i] = res[i >> 1] + (i & 1);
    }
    return res;
}`,
                language: "javascript",
                description: "DP with i>>1 relation",
                topic: "Dynamic Programming, Bit Manipulation",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_18",
                title: "Group Anagrams",
                code: `function groupAnagrams(strs: string[]): string[][] {
    const map = new Map<string, string[]>();
    for (const s of strs) {
        const key = s.split("").sort().join("");
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(s);
    }
    return Array.from(map.values());
}`,
                language: "typescript",
                description: "Group anagrams using sorted key",
                topic: "Hash Table, String",
                complexity: "O(n k log k)",
                isPublic: true,
                authorId: users[1].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_19",
                title: "Top K Frequent Elements",
                code: `def topKFrequent(nums: list[int], k: int) -> list[int]:
    from collections import Counter
    count = Counter(nums)
    buckets: list[list[int]] = [[] for _ in range(len(nums) + 1)]
    for n, c in count.items():
        buckets[c].append(n)
    res: list[int] = []
    for i in range(len(buckets) - 1, -1, -1):
        for n in buckets[i]:
            res.append(n)
            if len(res) == k:
                return res
    return res
`,
                language: "python",
                description: "Bucket sort by frequency",
                topic: "Hash Table, Bucket Sort",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[2].id,
            },
        }),
        prisma.snippet.create({
            data: {
                id: "snippet_20",
                title: "Product of Array Except Self",
                code: `function productExceptSelf(nums) {
    const n = nums.length;
    const res = new Array(n).fill(1);
    let prefix = 1;
    for (let i = 0; i < n; i++) {
        res[i] = prefix;
        prefix *= nums[i];
    }
    let suffix = 1;
    for (let i = n - 1; i >= 0; i--) {
        res[i] *= suffix;
        suffix *= nums[i];
    }
    return res;
}`,
                language: "javascript",
                description: "Compute product except self without division",
                topic: "Array, Prefix Suffix",
                complexity: "O(n)",
                isPublic: true,
                authorId: users[0].id,
            },
        }),
    ]);

    console.log("✅ Snippets created");

    // Create snippet-tag relationships
    const snippetTags = await Promise.all([
        // Two Sum - array, hash-table
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[0].id,
                tagId: tags.find((t) => t.name === "array")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[0].id,
                tagId: tags.find((t) => t.name === "hash-table")!.id,
            },
        }),
        // Valid Parentheses - string
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[1].id,
                tagId: tags.find((t) => t.name === "string")!.id,
            },
        }),
        // Maximum Subarray - array
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[2].id,
                tagId: tags.find((t) => t.name === "array")!.id,
            },
        }),
        // Remove Duplicates - array, two-pointers
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[3].id,
                tagId: tags.find((t) => t.name === "array")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[3].id,
                tagId: tags.find((t) => t.name === "two-pointers")!.id,
            },
        }),
        // Reverse String - string, two-pointers
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[4].id,
                tagId: tags.find((t) => t.name === "string")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[4].id,
                tagId: tags.find((t) => t.name === "two-pointers")!.id,
            },
        }),
        // Binary Search - array, binary-search
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[5].id,
                tagId: tags.find((t) => t.name === "array")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[5].id,
                tagId: tags.find((t) => t.name === "binary-search")!.id,
            },
        }),
        // Climbing Stairs - math
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[6].id,
                tagId: tags.find((t) => t.name === "math")!.id,
            },
        }),
        // Best Time to Buy and Sell Stock - array, greedy
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[7].id,
                tagId: tags.find((t) => t.name === "array")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[7].id,
                tagId: tags.find((t) => t.name === "greedy")!.id,
            },
        }),
        // Valid Anagram - string, hash-table
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[8].id,
                tagId: tags.find((t) => t.name === "string")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[8].id,
                tagId: tags.find((t) => t.name === "hash-table")!.id,
            },
        }),
        // Contains Duplicate - array, hash-table
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[9].id,
                tagId: tags.find((t) => t.name === "array")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[9].id,
                tagId: tags.find((t) => t.name === "hash-table")!.id,
            },
        }),
        // Merge Two Sorted Lists - linked list
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[10].id,
                tagId: tags.find((t) => t.name === "array")!.id,
            },
        }),
        // Valid Palindrome - string, two-pointers
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[11].id,
                tagId: tags.find((t) => t.name === "string")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[11].id,
                tagId: tags.find((t) => t.name === "two-pointers")!.id,
            },
        }),
        // Move Zeroes - array, two-pointers
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[12].id,
                tagId: tags.find((t) => t.name === "array")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[12].id,
                tagId: tags.find((t) => t.name === "two-pointers")!.id,
            },
        }),
        // Plus One - array
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[13].id,
                tagId: tags.find((t) => t.name === "array")!.id,
            },
        }),
        // Min Stack - greedy (approx) / stack
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[14].id,
                tagId: tags.find((t) => t.name === "greedy")!.id,
            },
        }),
        // Fibonacci - math
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[15].id,
                tagId: tags.find((t) => t.name === "math")!.id,
            },
        }),
        // Count Bits - math
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[16].id,
                tagId: tags.find((t) => t.name === "math")!.id,
            },
        }),
        // Group Anagrams - string, sorting
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[17].id,
                tagId: tags.find((t) => t.name === "string")!.id,
            },
        }),
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[17].id,
                tagId: tags.find((t) => t.name === "sorting")!.id,
            },
        }),
        // Top K Frequent - hash-table
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[18].id,
                tagId: tags.find((t) => t.name === "hash-table")!.id,
            },
        }),
        // Product Except Self - array
        prisma.snippetTag.create({
            data: {
                snippetId: snippets[19].id,
                tagId: tags.find((t) => t.name === "array")!.id,
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
