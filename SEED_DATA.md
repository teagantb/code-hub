# 🌱 Seed Data for Code Hub

This document describes the seed data that will be created for your Code Hub application.

## 📊 Data Overview

### Users (3 users)

-   **John Doe** (`johndoe`) - Full-stack developer
-   **Jane Smith** (`janesmith`) - Frontend developer
-   **Mike Johnson** (`mikej`) - Backend developer

All users have the password: `password123`

### Tags (8 tags)

-   `javascript`, `python` - Programming languages
-   `algorithm`, `data-structure` - Core concepts
-   `sorting`, `search` - Algorithm types
-   `math`, `string` - Function categories

### Snippets (8 basic data structure functions)

1. **Basic Calculator Functions** - Addition, subtraction, multiplication, division
2. **Bubble Sort Algorithm** - Simple sorting implementation
3. **Palindrome Checker** - String palindrome detection
4. **Linear Search** - Array element search
5. **Stack Implementation** - LIFO data structure
6. **Queue Implementation** - FIFO data structure
7. **Factorial Function** - Mathematical calculation
8. **Fibonacci Sequence** - Number sequence generation

## 🚀 How to Run Seed Data

### Option 1: Using npm scripts

```bash
# Install dependencies first
npm install

# Run the seed script
npm run db:seed
```

### Option 2: Reset database and seed

```bash
# This will reset the database and run seed
npm run db:reset
```

### Option 3: Using Prisma directly

```bash
# Generate Prisma client
npx prisma generate

# Run the seed script
npx prisma db seed
```

## 🔐 Test User Credentials

You can log in with any of these accounts:

| Email            | Password    | Username  |
| ---------------- | ----------- | --------- |
| john@example.com | password123 | johndoe   |
| jane@example.com | password123 | janesmith |
| mike@example.com | password123 | mikej     |

## 📝 Sample Data Features

-   **Basic Data Structures**: Stack, Queue implementations
-   **Fundamental Algorithms**: Sorting, searching, mathematical functions
-   **Simple Functions**: All functions are 20 lines or less
-   **Clear Examples**: Each snippet includes usage examples
-   **Time Complexity**: Each function includes complexity analysis
-   **Educational Focus**: Perfect for learning data structures and algorithms

## 🎯 What You Can Test

1. **User Authentication**: Login with any test user
2. **Snippet Browsing**: View all public snippets
3. **Search Functionality**: Search by title, description, or tags
4. **User Profiles**: Visit user profile pages
5. **Tag Filtering**: Filter snippets by programming language
6. **Complexity Analysis**: View complexity analysis for each snippet
7. **Internationalization**: Switch between English and Vietnamese

## 🔧 Customization

To modify the seed data:

1. Edit `prisma/seed.ts`
2. Add more users, snippets, or tags
3. Run `npm run db:seed` to apply changes

## 🗑️ Clearing Seed Data

To remove all seed data:

```bash
# Reset the database (this will delete all data)
npx prisma migrate reset --force
```

## 📈 Next Steps

After running the seed data:

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Login with any test user
4. Explore the application with real data!
