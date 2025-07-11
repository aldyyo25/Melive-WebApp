# Live Stream Audience

This is a [Next.js](https://nextjs.org) project with TypeScript, built with modern development tools and best practices.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Code Quality**: ESLint, Prettier
- **Git Hooks**: Husky
- **Commit Standards**: Commitlint (Conventional Commits)

## 📦 Features

- ✅ TypeScript support
- ✅ App Router (Next.js 13+)
- ✅ Tailwind CSS for styling
- ✅ ESLint for code linting
- ✅ Prettier for code formatting
- ✅ Husky for git hooks
- ✅ Commitlint for commit message standards
- ✅ Pre-commit hooks for code quality

## 🛠️ Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Visit [http://localhost:3000](http://localhost:3000) to see the result.

## 📝 Available Scripts

| Script                 | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start development server with Turbopack |
| `npm run build`        | Build the application for production    |
| `npm run start`        | Start the production server             |
| `npm run lint`         | Run ESLint to check for issues          |
| `npm run lint:fix`     | Run ESLint and fix auto-fixable issues  |
| `npm run format`       | Format code with Prettier               |
| `npm run format:check` | Check if code is formatted correctly    |

## 🔧 Development Workflow

### Code Quality

This project enforces code quality through:

- **ESLint**: Catches potential bugs and enforces coding standards
- **Prettier**: Ensures consistent code formatting
- **Pre-commit hooks**: Automatically runs linting and formatting checks before commits

### Commit Standards

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Your commit messages should follow this format:

```
type(scope): description

[optional body]

[optional footer]
```

**Examples**:

- `feat: add user authentication`
- `fix: resolve navigation bug`
- `docs: update README`
- `style: fix code formatting`
- `refactor: optimize component structure`

### Git Hooks

- **Pre-commit**: Runs linting and formatting checks
- **Commit-msg**: Validates commit message format

## 🎨 Styling

This project uses Tailwind CSS for styling. You can start editing the page by modifying `src/app/page.tsx`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
