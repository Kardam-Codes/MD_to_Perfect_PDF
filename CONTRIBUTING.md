# Contributing to MD → Perfect PDF

Thank you for your interest in contributing to MD → Perfect PDF! This document provides guidelines and information to help you contribute effectively.

## 🎯 Project Overview

MD → Perfect PDF is a privacy-first Chrome extension + PDF server that converts Markdown to clean, print-ready PDFs. The project consists of:

- **Chrome Extension** (`extension/`) - Frontend editor and UI
- **PDF Server** (`pdf-server/`) - Node.js backend with Puppeteer
- **Landing Page** (`website/`) - Marketing and documentation site

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- Google Chrome (for extension development)
- Git

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kardam-Codes/MD_to_Perfect_PDF.git
   cd MD_to_Perfect_PDF
   ```

2. **Install PDF server dependencies:**
   ```bash
   cd pdf-server
   npm install
   ```

3. **Start the PDF server:**
   ```bash
   npm start
   ```
   The server will run on http://localhost:3000

4. **Load the Chrome extension:**
   - Open Chrome and go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension/` folder

5. **Test the setup:**
   - Open the extension popup
   - Paste some Markdown content
   - Click "Download PDF" to test the integration

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test thoroughly

3. **Run tests:**
   ```bash
   cd pdf-server && npm test
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a pull request:**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Code Style Guidelines

### JavaScript/TypeScript

- Use modern ES6+ syntax
- Prefer `const` and `let` over `var`
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused

### Chrome Extension

- Follow Chrome Extension Manifest V3 guidelines
- Use async/await for Chrome APIs
- Handle errors gracefully
- Maintain user privacy - no unnecessary data collection

### PDF Server

- Use Express.js best practices
- Validate all input parameters
- Implement proper error handling
- Include security headers and rate limiting
- Clean up resources (Puppeteer browsers) properly

### CSS

- Use CSS custom properties for theming
- Follow mobile-first responsive design
- Ensure accessibility (contrast, keyboard navigation)
- Use semantic HTML elements

## 🧪 Testing

### Running Tests

```bash
cd pdf-server
npm test
```

### Test Coverage

We aim for comprehensive test coverage covering:
- API endpoint functionality
- Input validation and sanitization
- Security measures (CORS, rate limiting)
- Error handling
- Browser pool management

### Manual Testing

- Test Chrome extension on different Chrome versions
- Test PDF export with various Markdown content
- Test edge cases (large documents, special characters)
- Test mobile responsiveness of landing page

## 🔧 Project Structure

```
MD_to_Perfect_PDF/
├── extension/                 # Chrome Extension
│   ├── manifest.json         # Extension manifest
│   ├── editor.html           # Main editor page
│   ├── editor.css            # Editor styles
│   ├── editor.js             # Editor logic
│   └── icons/                # Extension icons
├── pdf-server/               # PDF Generation Server
│   ├── server.js             # Main Express server
│   ├── package.json          # Dependencies
│   ├── test-runner.js        # Test suite
│   └── server.test.js        # Jest tests (optional)
├── website/                  # Landing Page
│   ├── index.html            # Main landing page
│   ├── style.css             # Styles
│   ├── script.js             # Interactions
│   └── assets/               # Images and assets
├── .gitignore               # Git ignore rules
├── README.md                # Main documentation
├── CONTRIBUTING.md           # This file
└── CHANGELOG.md             # Version history
```

## 🐛 Bug Reports

When reporting bugs, please include:

- **Environment:** OS, Chrome version, Node.js version
- **Steps to reproduce:** Detailed reproduction steps
- **Expected behavior:** What should happen
- **Actual behavior:** What actually happens
- **Screenshots:** If applicable
- **Console errors:** Any error messages

### Bug Report Template

```markdown
## Bug Description
Brief description of the bug

## Environment
- OS: [e.g., Windows 11, macOS 13.0]
- Chrome: [e.g., Version 120.0.6099.130]
- Node.js: [e.g., v18.19.0]

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable, add screenshots

## Additional Context
Any other relevant information
```

## ✨ Feature Requests

When proposing features:

- **Use cases:** Describe the problem this solves
- **Proposed solution:** How you envision the feature working
- **Alternatives considered:** Other approaches you thought of
- **Breaking changes:** Will this affect existing functionality?

### Feature Request Template

```markdown
## Feature Description
Brief description of the proposed feature

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other approaches you've thought about

## Breaking Changes
Will this affect existing functionality?

## Additional Notes
Any other relevant information
```

## 📋 Pull Request Process

1. **Fork the repository** and create your feature branch
2. **Make your changes** following the style guidelines
3. **Test thoroughly** including edge cases
4. **Update documentation** if needed
5. **Ensure all tests pass**
6. **Submit a pull request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots if applicable
   - Testing instructions

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] Manual testing completed
- [ ] Edge cases tested

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🏗️ Development Guidelines

### Security

- **Input Validation:** Always validate and sanitize user input
- **CORS:** Restrict to allowed origins only
- **Rate Limiting:** Implement rate limiting on public endpoints
- **Privacy:** Never collect or transmit user data unnecessarily

### Performance

- **Browser Pooling:** Reuse Puppeteer browser instances
- **Memory Management:** Clean up resources properly
- **Caching:** Implement appropriate caching where beneficial
- **Bundle Size:** Keep extension bundle size minimal

### Accessibility

- **Keyboard Navigation:** Ensure all functionality works with keyboard
- **Screen Readers:** Add proper ARIA labels and semantic HTML
- **Color Contrast:** Meet WCAG AA standards
- **Focus States:** Visible focus indicators for interactive elements

## 📚 Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Express.js Documentation](https://expressjs.com/)
- [Puppeteer Documentation](https://pptr.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)

## 🤝 Code of Conduct

Please be respectful and inclusive:

- Use inclusive language
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different opinions and approaches
- Keep discussions professional and courteous

## 📞 Getting Help

- **GitHub Issues:** For bug reports and feature requests
- **Discussions:** For general questions and ideas
- **Email:** For security issues or private concerns

## 📜 License

By contributing to this project, you agree that your contributions will be licensed under the same [MIT License](LICENSE) as the project.

---

Thank you for contributing to MD → Perfect PDF! 🎉