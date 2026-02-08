# Chrome Web Store Pre-Launch Checklist

## 🔧 Technical Testing
- [ ] Extension loads without errors
- [ ] PDF export works with production server
- [ ] Local development mode works (localhost:3000)
- [ ] Production mode works (Render server)
- [ ] Theme switching works correctly
- [ ] All export options function
- [ ] Large documents (50KB+) process correctly
- [ ] Edge cases (empty content, malformed Markdown) handled
- [ ] Permissions are minimal and justified

## 🎨 UI/UX Testing
- [ ] Extension popup displays correctly
- [ ] Responsive design on different screen sizes
- [ ] Icons display properly in Chrome toolbar
- [ ] Loading states show during PDF generation
- [ ] Error messages are helpful and actionable

## 🔒 Security Testing
- [ ] No console errors in Chrome DevTools
- [ ] No content security policy violations
- [ ] CORS restrictions work correctly
- [ ] Input sanitization prevents XSS
- [ ] Rate limiting works under load

## 📱 Cross-Platform Testing
- [ ] Chrome (latest stable)
- [ ] Chrome (latest beta)
- [ ] Windows 10/11 compatibility
- [ ] macOS compatibility
- [ ] Linux compatibility

## 📋 Documentation Testing
- [ ] Privacy policy page loads and is accessible
- [ ] README instructions are accurate
- [ ] Setup steps work for new users
- [ ] Troubleshooting guide covers common issues

## 🛒 Store Listing Preparation
- [ ] Screenshots are high quality and current
- [ ] Description is compelling and accurate
- [ ] Category selection is appropriate
- [ ] Privacy policy URL is accessible
- [ ] Support contact information provided
- [ ] Version number follows semantic versioning
- [ ] Developer name is correct

## 🚀 Ready to Publish Checklist
- [ ] All technical tests pass
- [ ] Documentation is complete
- [ ] Store assets are prepared
- [ ] Developer account is verified
- [ ] $5 developer fee paid (if not already)
- [ ] ZIP file contains only extension folder
- [ ] No debugging console.log statements
- [ ] No hardcoded localhost URLs for production
- [ ] All features work as described in listing

## 📤 Upload Process
1. [ ] Create ZIP file: `cd extension && zip -r ../md-to-perfect-pdf.zip .`
2. [ ] Go to Chrome Web Store Developer Dashboard
3. [ ] Click "Add new item"
4. [ ] Upload ZIP file
5. [ ] Fill in all required fields
6. [ ] Upload screenshots and icons
7. [ ] Set pricing (Free)
8. [ ] Set distribution (Public, all regions)
9. [ ] Review and submit

## ⏱️ Review Timeline
- Initial review: 3-5 business days
- Possible rejection: Usually within 1-2 days
- Approval: Goes live immediately after approval

## 🆘 Common Rejection Reasons
- **Permissions**: Requesting unnecessary permissions
- **Security**: Vulnerable JavaScript libraries
- **Content**: Misleading descriptions or screenshots
- **Functionality**: Extension doesn't work as described
- **Policy**: Violation of Chrome Web Store policies

## ✅ You're Ready!
If all checkboxes are checked, your extension is ready for Chrome Web Store submission.