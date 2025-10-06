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
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
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
        image:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
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
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
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
        code: `function twoSum(nums, target) {
    const map = new Map();
    
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
        language: "javascript",
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
        code: `function maxSubArray(nums) {
    let maxSoFar = nums[0];
    let maxEndingHere = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}

// Example: maxSubArray([-2,1,-3,4,-1,2,1,-5,4]) returns 6`,
        language: "javascript",
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
        code: `function removeDuplicates(nums) {
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
        language: "javascript",
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
        code: `function search(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// Example: search([-1,0,3,5,9,12], 9) returns 4`,
        language: "javascript",
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

// Example: climbStairs(3) returns 3 (ways: 1+1+1, 1+2, 2+1)`,
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
        code: `function maxProfit(prices) {
    let minPrice = prices[0];
    let maxProfit = 0;
    
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else if (prices[i] - minPrice > maxProfit) {
            maxProfit = prices[i] - minPrice;
        }
    }
    
    return maxProfit;
}

// Example: maxProfit([7,1,5,3,6,4]) returns 5 (buy at 1, sell at 6)`,
        language: "javascript",
        description: "Find maximum profit from buying and selling stock",
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
        code: `function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    
    const charCount = {};
    
    for (let char of s) {
        charCount[char] = (charCount[char] || 0) + 1;
    }
    
    for (let char of t) {
        if (!charCount[char]) return false;
        charCount[char]--;
    }
    
    return true;
}

// Example: isAnagram("anagram", "nagaram") returns true`,
        language: "javascript",
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
        code: `function containsDuplicate(nums) {
    const seen = new Set();
    
    for (let num of nums) {
        if (seen.has(num)) {
            return true;
        }
        seen.add(num);
    }
    
    return false;
}

// Example: containsDuplicate([1,2,3,1]) returns true`,
        language: "javascript",
        description: "Check if array contains any duplicates",
        topic: "Array, Hash Table",
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
