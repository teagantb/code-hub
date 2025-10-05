# 🚀 Code Hub

A modern, full-stack code snippet sharing platform built with Next.js, featuring intelligent tagging, complexity analysis, and multi-language support.

![Code Hub](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.16-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🔧 Core Functionality

-   **Code Snippet Management**: Create, edit, and organize code snippets
-   **Smart Tagging**: Automatic and manual tagging system
-   **Complexity Analysis**: Built-in time complexity estimation
-   **Search & Filter**: Advanced search with language and tag filtering
-   **User Profiles**: Personal snippet collections and statistics

### 🌍 Internationalization

-   **Multi-language Support**: English and Vietnamese
-   **Dynamic Language Switching**: Real-time language changes
-   **Localized Content**: All UI elements translated

### 📱 Responsive Design

-   **Mobile-First**: Optimized for all device sizes
-   **Touch-Friendly**: Intuitive mobile navigation
-   **Progressive Enhancement**: Works on all modern browsers

### 🔐 Authentication & Security

-   **User Registration/Login**: Secure authentication system
-   **Password Hashing**: bcrypt encryption
-   **Session Management**: Persistent user sessions
-   **Protected Routes**: Secure access control

## 🛠️ Tech Stack

### Frontend

-   **Next.js 14** - React framework with App Router
-   **TypeScript** - Type-safe development
-   **Tailwind CSS** - Utility-first styling
-   **Radix UI** - Accessible component primitives
-   **Lucide React** - Beautiful icons

### Backend

-   **Next.js API Routes** - Serverless API endpoints
-   **Prisma ORM** - Type-safe database access
-   **SQLite** - Lightweight database
-   **bcryptjs** - Password hashing

### Internationalization

-   **next-intl** - Internationalization framework
-   **Dynamic Locales** - Runtime language switching

## 📦 Installation

### Prerequisites

-   Node.js 18+
-   npm or yarn
-   Git

### Setup Instructions

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/code-hub.git
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

    Configure your environment variables:

    ```env
    DATABASE_URL="file:./dev.db"
    NEXTAUTH_SECRET="your-secret-key"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4. **Set up the database**

    ```bash
    # Generate Prisma client
    npx prisma generate

    # Run database migrations
    npx prisma migrate dev

    # Seed the database with sample data
    npm run db:seed
    ```

5. **Start the development server**

    ```bash
    npm run dev
    ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Users

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  username  String?  @unique
  image     String?
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  snippets  Snippet[]
}
```

### Snippets

```prisma
model Snippet {
  id          String   @id @default(cuid())
  title       String
  code        String
  language    String
  description String?
  topic       String?
  isPublic    Boolean  @default(true)
  complexity  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  tags        SnippetTag[]
}
```

### Tags

```prisma
model Tag {
  id       String        @id @default(cuid())
  name     String        @unique
  snippets SnippetTag[]
}
```

## 🎯 Usage

### Creating Snippets

1. **Login** to your account
2. **Click** "Create Snippet" in the navigation
3. **Fill** in the snippet details:
    - Title and description
    - Select programming language
    - Add tags for categorization
    - Paste your code
4. **Save** and share your snippet

### Searching Snippets

-   **Browse** all public snippets on the main page
-   **Search** by title, description, or code content
-   **Filter** by programming language
-   **Explore** by tags

### User Profiles

-   **View** user statistics and snippet counts
-   **Browse** user's public snippets
-   **Filter** by language or search terms

## 🌐 Internationalization

### Supported Languages

-   **English** (en) - Default
-   **Vietnamese** (vi) - Full translation

### Adding New Languages

1. Create translation files in `messages/` directory
2. Update `i18n.ts` configuration
3. Add locale to middleware configuration

### Translation Structure

```json
{
    "common": {
        "loading": "Loading...",
        "error": "Error",
        "success": "Success"
    },
    "navigation": {
        "home": "Home",
        "snippets": "Snippets"
    }
}
```

## 🧪 Testing

### Sample Data

The project includes comprehensive seed data:

-   **3 Test Users** with different roles
-   **8 Code Snippets** covering basic data structures
-   **8 Tags** for categorization
-   **Realistic Examples** for testing

### Test User Credentials

| Email            | Password    | Username  |
| ---------------- | ----------- | --------- |
| john@example.com | password123 | johndoe   |
| jane@example.com | password123 | janesmith |
| mike@example.com | password123 | mikej     |

## 📁 Project Structure

```
code-hub/
├── app/
│   ├── [locale]/           # Internationalized routes
│   │   ├── login/          # Authentication pages
│   │   ├── register/
│   │   ├── snippets/       # Snippet management
│   │   ├── tags/           # Tag browsing
│   │   └── users/          # User profiles
│   └── api/                # API routes
├── components/             # Reusable UI components
├── features/              # Feature-based modules
│   ├── snippets/          # Snippet functionality
│   ├── tags/              # Tag management
│   └── users/             # User features
├── lib/                   # Utility functions
├── messages/              # Translation files
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect** your GitHub repository to Vercel
2. **Configure** environment variables
3. **Deploy** automatically on push

### Other Platforms

-   **Netlify**: Static site generation
-   **Railway**: Full-stack deployment
-   **DigitalOcean**: VPS deployment

### Environment Variables

```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="your-domain.com"
```

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Code Style

-   **TypeScript** for type safety
-   **ESLint** for code linting
-   **Prettier** for code formatting
-   **Conventional Commits** for commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   **Next.js** team for the amazing framework
-   **Prisma** team for the excellent ORM
-   **Tailwind CSS** for the utility-first approach
-   **Radix UI** for accessible components
-   **Lucide** for beautiful icons

## 📞 Support

-   **Issues**: [GitHub Issues](https://github.com/yourusername/code-hub/issues)
-   **Discussions**: [GitHub Discussions](https://github.com/yourusername/code-hub/discussions)
-   **Email**: support@codehub.com

## 🔮 Roadmap

### Upcoming Features

-   [ ] **Real-time Collaboration** - Live editing
-   [ ] **Code Execution** - Run code snippets
-   [ ] **Version Control** - Snippet versioning
-   [ ] **Team Workspaces** - Shared collections
-   [ ] **API Integration** - External service connections
-   [ ] **Advanced Analytics** - Usage statistics
-   [ ] **Mobile App** - Native mobile experience

### Performance Improvements

-   [ ] **Caching** - Redis integration
-   [ ] **CDN** - Asset optimization
-   [ ] **Database** - Query optimization
-   [ ] **Bundle** - Code splitting

---

**Made with ❤️ by the Code Hub Team**

_Share, discover, and organize code snippets with intelligent tagging and complexity analysis._
