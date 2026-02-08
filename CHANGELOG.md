# Changelog

All notable changes to MD → Perfect PDF will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Standalone web app version (no extension required)
- Advanced PDF features (Table of Contents, watermarks)
- PWA support for mobile installability
- Visual regression testing
- CI/CD pipeline with automated deployments

---

## [1.1.0] - 2025-02-08

### Added
- 🔒 **Security Hardening**
  - Restricted CORS to known origins (Chrome extensions, production domains)
  - Rate limiting (20 requests per 15 minutes)
  - Security headers with Helmet.js
  - Input validation and HTML sanitization
  - File name sanitization to prevent path traversal

- ⚡ **Performance Improvements**
  - Browser pooling to reduce Puppeteer cold starts
  - Configurable browser pool size (MAX_BROWSERS env var)
  - Improved memory management and cleanup
  - Graceful shutdown handling

- 📊 **Monitoring & Health Checks**
  - Enhanced health check endpoint (`/health`) with detailed metrics
  - Memory usage tracking
  - Browser pool utilization monitoring
  - Request timing and performance metrics

- 🧪 **Testing Infrastructure**
  - Comprehensive test suite (`test-runner.js`)
  - API endpoint testing
  - Security validation tests
  - Input sanitization verification
  - CORS and rate limiting tests

- 📚 **Documentation**
  - Contributing guidelines (CONTRIBUTING.md)
  - Detailed development setup instructions
  - Bug report and feature request templates
  - Code style guidelines
  - Security and performance guidelines

- 🌐 **Landing Page**
  - Production-ready marketing website
  - Responsive design (mobile/tablet/desktop)
  - SEO optimization with meta tags
  - Privacy policy page
  - Interactive elements and animations

### Changed
- Enhanced PDF server error handling with better cleanup
- Improved input validation and sanitization
- Updated browser launch arguments for better stability
- Refactored server code for better maintainability
- Enhanced CORS configuration for security

### Fixed
- Memory leaks in browser instance management
- Security vulnerabilities in input handling
- Rate limiting bypass in development mode
- File system path traversal attempts
- CORS misconfiguration

### Security
- Added comprehensive input sanitization
- Implemented CSP headers
- Restricted CORS origins
- Added rate limiting protection
- Enhanced file name validation

---

## [1.0.0] - 2025-02-07

### Added
- 🎉 **Initial Release**
  - Chrome Extension for Markdown to PDF conversion
  - Node.js PDF server with Puppeteer
  - Live Markdown editor with syntax highlighting
  - Dark/light theme support
  - Multiple page sizes (A4, Letter, Legal)
  - Portrait/landscape orientations
  - Customizable margins (compact/normal/spacious)
  - Font selection (Inter, Roboto, Serif)
  - Headers and footers with page numbers
  - Date/time stamping option
  - Manual page break support (`--- ---`)
  - Privacy-first local processing
  - Basic health check endpoint

### Features
- **Extension Features**
  - Resizable editor/preview panels
  - Real-time preview updates
  - Syntax highlighting for code blocks
  - Theme switching
  - Empty state guidance
  - Local storage for content persistence

- **PDF Features**
  - High-quality PDF export
  - Print-optimized typography
  - Consistent styling with preview
  - Table rendering with borders
  - Heading hierarchy preservation
  - Code block formatting in PDF

- **Server Features**
  - Express.js REST API
  - CORS support
  - Error handling
  - Health check endpoint
  - JSON request/response format

---

## [0.9.0] - 2025-02-06 (Beta)

### Added
- Initial prototype development
- Basic Markdown to PDF conversion
- Chrome extension skeleton
- Simple Express server

---

## Version History Legend

- 🎉 **Major Release** - Significant new features or breaking changes
- ✨ **Minor Release** - New features, improvements
- 🐛 **Patch Release** - Bug fixes, security updates
- 🔒 **Security** - Security improvements
- ⚡ **Performance** - Performance enhancements
- 📚 **Documentation** - Documentation updates
- 🧪 **Testing** - Test improvements
- 🌐 **Website** - Landing page updates

---

## Future Roadmap

### Version 1.2.0 (Planned)
- PWA support
- Standalone web app
- Advanced PDF features

### Version 1.3.0 (Planned)
- CI/CD pipeline
- Visual regression tests
- Performance monitoring

### Version 2.0.0 (Future)
- Multi-document export
- Cloud synchronization (optional)
- Advanced collaboration features

---

**Release Notes:**
- All versions maintain backward compatibility unless explicitly noted
- Security updates are released as patch versions
- Features are added in minor versions
- Breaking changes are reserved for major versions