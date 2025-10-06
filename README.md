# Code Hub

A modern, full-stack web application for sharing, discovering, and organizing code snippets with intelligent tagging and complexity analysis.

## 🚀 Features

### Core Functionality

-   **Code Snippet Management**: Create, edit, and organize code snippets
-   **Smart Tagging**: Automatic tagging system for easy discovery
-   **Complexity Analysis**: Built-in time complexity analyzer for code snippets
-   **User Profiles**: User management with public profiles and snippet collections
-   **Search & Discovery**: Advanced search and filtering capabilities

### Technical Features

-   **Multi-language Support**: Internationalization (i18n) with English and Vietnamese
-   **Authentication**: JWT-based authentication with secure cookie management
-   **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components
-   **Code Syntax Highlighting**: Syntax highlighting for multiple programming languages
-   **Real-time Analysis**: Automatic complexity analysis for uploaded code

## 🏗️ Technical Architecture

### Frontend Stack

-   **Next.js 15.5.4** - React framework with App Router
-   **React 19.1.0** - UI library
-   **TypeScript 5.9.3** - Type safety
-   **Tailwind CSS 4** - Utility-first CSS framework
-   **shadcn/ui** - Accessible component primitives
-   **next-intl** - Internationalization
-   **PrismJS** - Syntax highlighting

### Backend Stack

-   **Next.js API Routes** - Server-side API endpoints
-   **Prisma** - Database ORM
-   **SQLite** - Database (development)
-   **JWT** - Authentication tokens
-   **bcryptjs** - Password hashing

### Database Schema

```prisma
User {
  id, name, email, password, image, bio, username
  snippets: Snippet[]
}

Snippet {
  id, title, code, language, topic, description, isPublic, complexity
  author: User
  tags: SnippetTag[]
}

Tag {
  id, name
  snippets: SnippetTag[]
}

SnippetTag {
  id, snippetId, tagId
  snippet: Snippet
  tag: Tag
}
```

## 📁 Project Structure

```
code-hub/
├── app/                          # Next.js App Router
│   ├── [locale]/                # Internationalized routes
│   │   ├── login/               # Authentication pages
│   │   ├── register/
│   │   ├── snippets/            # Snippet management
│   │   │   ├── [id]/           # Individual snippet pages
│   │   │   └── new/            # Create snippet
│   │   ├── tags/               # Tag browsing
│   │   └── users/              # User profiles
│   └── api/                     # API routes
│       ├── auth/               # Authentication endpoints
│       ├── snippets/           # Snippet CRUD operations
│       ├── tags/               # Tag management
│       └── users/              # User operations
├── components/                   # Reusable UI components
│   ├── ui/                     # Base UI components
│   ├── CodeViewer.tsx          # Code display component
│   ├── complexity-analysis.tsx # Complexity analysis UI
│   └── navbar.tsx             # Navigation component
├── contexts/                    # React contexts
│   └── AuthContext.tsx         # Authentication state
├── features/                    # Feature-based organization
│   ├── snippets/               # Snippet feature modules
│   ├── tags/                   # Tag feature modules
│   └── users/                  # User feature modules
├── lib/                         # Utility libraries
│   ├── auth.ts                 # Authentication utilities
│   ├── complexity-analyzer.ts  # Code complexity analysis
│   ├── prisma.ts              # Database client
│   └── utils.ts                # General utilities
├── messages/                    # Internationalization files
│   ├── en.json                 # English translations
│   └── vi.json                 # Vietnamese translations
└── prisma/                      # Database schema and migrations
    ├── schema.prisma           # Database schema
    └── migrations/             # Database migrations
```

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd code-hub
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env.local
    ```

    Configure the following variables:

    ```env
    JWT_SECRET=your-jwt-secret-key
    DATABASE_URL="file:./dev.db"
    ```

4. **Set up the database**

    ```bash
    npx prisma migrate dev
    npm run db:seed
    ```

5. **Start the development server**

    ```bash
    npm run dev
    ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Available Scripts

-   `npm run dev` - Start development server with Turbopack
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run db:seed` - Seed database with sample data
-   `npm run db:reset` - Reset and reseed database

## 🔧 Key Features Implementation

### Authentication System

-   JWT-based authentication with secure HTTP-only cookies
-   Password hashing using bcryptjs
-   Protected routes and API endpoints
-   User session management

### Complexity Analysis

The built-in complexity analyzer uses pattern matching to estimate time complexity:

-   **O(1)** - Constant time operations
-   **O(log n)** - Binary search patterns
-   **O(n)** - Single loops and array operations
-   **O(n log n)** - Sorting algorithms
-   **O(n²)** - Nested loops
-   **O(2^n)** - Recursive functions

### Internationalization

-   Support for English and Vietnamese
-   Automatic locale detection
-   Server-side rendering with translations
-   Dynamic language switching

### Code Management

-   Syntax highlighting for multiple languages
-   Public/private snippet visibility
-   Tag-based organization
-   Search and filtering capabilities
-   User-specific snippet collections

## 🎨 UI Components

The application uses a modern design system with:

-   **Tailwind CSS** for styling
-   **shadcn/ui** for accessible components
-   **Lucide React** for icons
-   **Sonner** for toast notifications
-   **next-themes** for theme management

## 🔒 Security Features

-   JWT token authentication
-   Password hashing with bcrypt
-   HTTP-only cookies for token storage
-   Input validation and sanitization
-   Protected API routes
-   CORS configuration

## 🌐 Internationalization

The application supports multiple languages:

-   **English (en)** - Default language
-   **Vietnamese (vi)** - Secondary language

Language files are located in the `messages/` directory and can be easily extended.

## 📊 Database

The application uses SQLite for development with Prisma ORM:

-   **Users**: User accounts and profiles
-   **Snippets**: Code snippets with metadata
-   **Tags**: Categorization system
-   **SnippetTags**: Many-to-many relationship between snippets and tags

## 🚀 Deployment

The application is ready for deployment on platforms like:

-   **Vercel** (recommended for Next.js)
-   **Netlify**
-   **Railway**
-   **DigitalOcean App Platform**

For production deployment:

1. Set up a production database (PostgreSQL recommended)
2. Configure environment variables
3. Run database migrations
4. Deploy the application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

-   Create an issue in the repository
-   Check the documentation
-   Review the code examples

---

**Code Hub** - Share, discover, and organize code snippets with intelligent analysis and modern web technologies.
