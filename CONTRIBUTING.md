# Contributing to PIVORI Studio v2.0

Thank you for your interest in contributing to PIVORI Studio! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing](#testing)
6. [Commit Messages](#commit-messages)
7. [Pull Requests](#pull-requests)
8. [Reporting Issues](#reporting-issues)

---

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our Code of Conduct:

- Be respectful and inclusive
- Welcome diverse perspectives
- Focus on constructive feedback
- Report inappropriate behavior

---

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0 or pnpm >= 8.0.0
- Git
- Docker & Docker Compose (optional)

### Setup Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/pivori-studio-v2.git
   cd pivori-studio-v2
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/pivori-app/pivori-studio-v2.git
   ```

3. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

4. **Setup environment variables**
   ```bash
   # Frontend
   cp frontend/.env.example frontend/.env.local

   # Backend
   cp backend/.env.example backend/.env
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

---

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions

### 2. Make Changes

- Write clean, maintainable code
- Follow coding standards (see below)
- Add tests for new features
- Update documentation

### 3. Test Locally

```bash
# Run tests
npm test

# Run linter
npm run lint

# Run formatter
npm run format

# Build
npm run build
```

### 4. Commit Changes

Follow commit message guidelines (see below)

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Provide clear description
- Reference related issues
- Ensure CI/CD passes

---

## Coding Standards

### JavaScript/TypeScript

- Use **ES6+** syntax
- Use **TypeScript** for type safety
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes and components
- Use **UPPER_SNAKE_CASE** for constants

### React Components

```typescript
// Good
interface ComponentProps {
  title: string
  onClose: () => void
}

export function MyComponent({ title, onClose }: ComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onClose}>Close</button>
    </div>
  )
}

// Bad
export const MyComponent = (props) => {
  return <div>{props.title}</div>
}
```

### Express Routes

```javascript
// Good
router.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.params.id)
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Bad
router.get('/api/users/:id', (req, res) => {
  getUserById(req.params.id).then(user => res.json(user))
})
```

### Formatting

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Use **trailing commas** in objects/arrays
- Use **semicolons** at end of statements

### Linting

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Formatting

```bash
# Format code
npm run format
```

---

## Testing

### Unit Tests

```typescript
// Example test
import { describe, it, expect } from 'vitest'
import { calculateTotal } from './utils'

describe('calculateTotal', () => {
  it('should sum all numbers', () => {
    expect(calculateTotal([1, 2, 3])).toBe(6)
  })

  it('should handle empty array', () => {
    expect(calculateTotal([])).toBe(0)
  })
})
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

### Coverage Requirements

- Minimum 70% line coverage
- Minimum 70% branch coverage
- Minimum 70% function coverage

---

## Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process or dependencies

### Scope

Optional, but recommended. Examples:
- `auth`
- `api`
- `ui`
- `database`

### Subject

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period (.) at the end
- Limit to 50 characters

### Body

- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line

### Footer

- Reference issues: `Closes #123`
- Breaking changes: `BREAKING CHANGE: description`

### Examples

```
feat(auth): add JWT token refresh mechanism

Implement automatic token refresh to improve user experience
when tokens expire during active sessions.

Closes #456
```

```
fix(api): handle null values in transaction amount

Previously, null transaction amounts would cause calculation errors.
Now they are treated as 0.

Closes #789
```

---

## Pull Requests

### Before Submitting

- [ ] Branch is up-to-date with `main`
- [ ] Tests pass locally
- [ ] Linter passes
- [ ] Code is formatted
- [ ] Documentation is updated
- [ ] Commit messages follow guidelines

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
Describe testing done

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Code reviewed locally
```

### Review Process

1. At least 2 approvals required
2. CI/CD must pass
3. No merge conflicts
4. Code review feedback addressed

---

## Reporting Issues

### Bug Reports

Include:
- Clear description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, browser, versions)
- Screenshots/logs if applicable

### Feature Requests

Include:
- Clear description
- Use case/motivation
- Proposed solution (if any)
- Alternatives considered

### Security Issues

**Do not open public issues for security vulnerabilities**

Email security concerns to: security@pivori.com

---

## Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

## Questions?

- Check existing issues and discussions
- Ask in GitHub Discussions
- Contact maintainers

---

Thank you for contributing! 🎉

