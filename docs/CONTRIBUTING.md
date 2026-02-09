# Contributing to pastecn

Thank you for your interest in contributing to pastecn! This guide will help you get started.

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v10+
- [Vercel CLI](https://vercel.com/cli) (optional, for Blob Storage)

## Project Structure

```
pastecn/
├── apps/
│   ├── web/          # Next.js web application
│   └── vscode/       # VS Code extension
├── packages/
│   ├── sdk/          # Core SDK
│   └── ui/           # Shared UI components
└── docs/             # Documentation
```

## Local Development

```bash
# Clone the repository
git clone https://github.com/rbadillap/pastecn.git
cd pastecn

# Install dependencies
pnpm install

# Copy environment variables
cp apps/web/.env.example apps/web/.env.local

# Start development server
pnpm dev
```

## Environment Variables

Create `apps/web/.env.local` with:

```bash
# Required for Blob Storage (get from Vercel Dashboard → Storage → Blob)
BLOB_READ_WRITE_TOKEN=

# Required for password protection
UNLOCK_SESSION_SECRET=change-this-in-production

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
UNLOCK_SESSION_DURATION_HOURS=24
```

### Getting Blob Storage Token

For local development with Vercel Blob:

```bash
# Link to a Vercel project
vercel link

# Pull environment variables
vercel env pull
```

Alternatively, you can create a Blob store in the [Vercel Dashboard](https://vercel.com/dashboard) and copy the token.

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Run linting |
| `pnpm typecheck` | Run type checking |

### VS Code Extension

```bash
# Build the extension
pnpm --filter pastecn build

# Package as .vsix
pnpm --filter pastecn package
```

## Pull Request Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/amazing-feature`)
3. **Commit** your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. **Push** to the branch (`git push origin feat/amazing-feature`)
5. **Open** a Pull Request

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
chore: maintenance tasks
refactor: code refactoring
test: add or update tests
```

### Code Style

- Follow the existing code patterns
- Run `pnpm lint` before committing
- Run `pnpm typecheck` to ensure type safety

## Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/rbadillap/pastecn/issues) with:

- Clear description of the problem or feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE.md).
