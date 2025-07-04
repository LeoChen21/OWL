# Contributing to OWL

Thank you for your interest in contributing to OWL (Online Web Library)! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and professional in all interactions.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Git
- AWS Account (for testing backend changes)

### Setting Up Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/OWL.git
   cd OWL
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   # Start backend sandbox
   npx ampx sandbox
   
   # In another terminal, start frontend
   npm run dev
   ```

4. **Verify setup**
   - Open `http://localhost:5173`
   - Create a test account
   - Add a test entry to ensure everything works

## 🔄 Development Workflow

### Branch Naming Convention

```
feature/description-of-feature
bugfix/description-of-bug
hotfix/critical-issue
docs/documentation-update
refactor/code-improvement
```

### Workflow Steps

1. **Create a feature branch**
   ```bash
   git checkout -b feature/add-export-functionality
   ```

2. **Make your changes**
   - Follow code style guidelines
   - Add tests for new features
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add CSV export functionality
   
   - Add export button to table header
   - Implement CSV generation utility
   - Add export confirmation dialog
   - Update documentation"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/add-export-functionality
   ```

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat: add bulk delete functionality
fix: resolve sorting issue with creator column
docs: update API documentation
refactor: extract validation logic to custom hook
```

## 🔍 Pull Request Process

### Before Submitting

1. **Ensure your branch is up to date**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run all checks**
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

3. **Test thoroughly**
   - Test your changes manually
   - Ensure existing functionality still works
   - Test on different screen sizes

### PR Requirements

- [ ] **Clear description** of changes and motivation
- [ ] **Screenshots** for UI changes
- [ ] **Tests** for new functionality
- [ ] **Documentation** updates if needed
- [ ] **No breaking changes** without discussion
- [ ] **Lint and type checks** pass
- [ ] **Build succeeds** without errors

### PR Template

```markdown
## Description
Brief description of changes and why they're needed.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that breaks existing functionality)
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] Existing functionality verified
- [ ] Edge cases considered

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🎨 Code Style Guidelines

### TypeScript/React

```typescript
// Use functional components with TypeScript
interface ComponentProps {
  /** Clear prop descriptions */
  data: TodoItem[];
  /** Callback descriptions */
  onUpdate: (id: string) => void;
}

export const Component: React.FC<ComponentProps> = ({ data, onUpdate }) => {
  // Component logic
};
```

### Custom Hooks

```typescript
/**
 * Custom hook with clear JSDoc documentation
 * @returns Hook utilities and state
 */
export const useCustomHook = () => {
  // Hook logic
  return { data, actions };
};
```

### CSS

```css
/* Use BEM-like naming convention */
.component-name {
  /* Styles */
}

.component-name__element {
  /* Element styles */
}

.component-name--modifier {
  /* Modifier styles */
}
```

### File Organization

```
src/
├── components/           # Reusable components
│   ├── ComponentName.tsx
│   └── index.ts         # Barrel exports
├── hooks/               # Custom hooks
├── styles/              # CSS files
├── utils/               # Utility functions
└── types/               # Type definitions
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Authentication flow** works correctly
- [ ] **CRUD operations** function properly
- [ ] **Sorting** works for all columns
- [ ] **Inline editing** validates input
- [ ] **Real-time updates** sync across tabs
- [ ] **Responsive design** works on mobile
- [ ] **Error handling** displays appropriate messages

### Future Testing Framework

We plan to add automated testing with:
- **Unit tests**: Jest + React Testing Library
- **Integration tests**: API testing
- **E2E tests**: Cypress or Playwright

## 📚 Documentation

### When to Update Documentation

- Adding new features
- Changing existing APIs
- Adding configuration options
- Fixing bugs that affect documented behavior

### Documentation Types

1. **Code Documentation**
   - JSDoc comments for all public functions
   - Type annotations for TypeScript
   - Inline comments for complex logic

2. **API Documentation**
   - Update `docs/API.md` for schema changes
   - Include request/response examples
   - Document error conditions

3. **User Documentation**
   - Update `README.md` for new features
   - Add usage examples
   - Update installation instructions

## 🐛 Reporting Issues

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Check documentation** for solutions
3. **Test with latest version**

### Issue Template

```markdown
## Bug Description
Clear description of the bug and expected behavior.

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error...

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Node.js version: [e.g., 18.17.0]

## Screenshots
Add screenshots if applicable.

## Additional Context
Any other relevant information.
```

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature request
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `priority: high/medium/low`: Issue priority

## 🚀 Release Process

### Semantic Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] Update version numbers
- [ ] Update CHANGELOG.md
- [ ] Test deployment pipeline
- [ ] Create release notes
- [ ] Tag release in Git

## 🏆 Recognition

Contributors will be recognized in:
- `CONTRIBUTORS.md` file
- Release notes
- GitHub contributor graphs

## 💬 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: contact@owl-project.com (for sensitive issues)

### Response Times

- **Issues**: We aim to respond within 2-3 business days
- **Pull Requests**: Initial review within 3-5 business days
- **Security Issues**: Response within 24 hours

## 📝 License

By contributing to OWL, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to OWL! 🦉✨