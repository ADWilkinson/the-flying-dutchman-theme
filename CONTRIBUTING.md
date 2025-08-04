# Contributing to The Flying Dutchman Theme 🚢

Welcome aboard, fellow sailor! We're excited that you want to help improve The Flying Dutchman theme collection. This guide will help you navigate the contribution process smoothly.

## 🌊 Code of Conduct

By participating in this project, you agree to abide by our nautical code of honor:
- **Respectful Communication**: Treat all contributors with respect and professionalism
- **Constructive Feedback**: Provide helpful, actionable feedback in reviews
- **Collaborative Spirit**: Work together to improve the theme for all users
- **Quality First**: Maintain high standards for accessibility and design

## 🗺️ Ways to Contribute

### 🐛 Bug Reports
Help us improve by reporting issues you encounter:

**Before Reporting:**
- Check existing [issues](https://github.com/ADWilkinson/the-flying-dutchman-theme/issues) to avoid duplicates
- Test with a clean VS Code installation to rule out extension conflicts
- Try the latest version of the theme

**When Reporting:**
- Use the bug report template
- Include screenshots showing the problem
- Provide system information:
  - VS Code version
  - Operating system
  - Theme version
  - Relevant extensions installed
- Include steps to reproduce the issue
- Specify expected vs. actual behavior

### 🎨 Color Improvements
Suggest enhancements to our color palette:

**Guidelines:**
- Maintain the nautical theme and atmosphere
- Ensure accessibility (WCAG AA compliance)
- Test changes across multiple programming languages
- Include before/after screenshots
- Explain the reasoning behind proposed changes

**Testing Your Changes:**
1. Fork the repository
2. Modify `themes/flying-dutchman-color-theme.json`
3. Test with various file types (JS, TS, Python, CSS, JSON, etc.)
4. Verify contrast ratios using [WebAIM Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
5. Submit a pull request with screenshots

### 📸 Screenshot Contributions
Help expand our visual documentation:

**Needed Screenshots:**
- Different programming languages (Python, CSS, JavaScript, etc.)
- VS Code UI elements (sidebar, terminal, search results)
- Terminal integrations (iTerm2, Warp, Windows Terminal)
- Before/after comparisons with other themes
- Error states and debugging views

**Screenshot Guidelines:**
- Use consistent window sizing (1200x800 minimum)
- Include relevant code that showcases syntax highlighting
- Ensure good lighting and contrast
- Save as PNG with descriptive filenames
- Include captions explaining what's shown

### 🛠️ Platform Support
Add theme support for new editors or terminals:

**Supported Platforms Process:**
1. **Research**: Study the target platform's theme format
2. **Fork**: Create a fork of the repository
3. **Implement**: Create theme files following our color standards
4. **Test**: Verify the theme works correctly across different file types
5. **Document**: Add installation instructions and screenshots
6. **Submit**: Create a pull request with your new platform support

**New Platform Requirements:**
- Consistent color mapping with existing themes
- Comprehensive installation guide
- Testing across multiple file formats
- Screenshots demonstrating the theme
- Platform-specific README in the new directory

## 🎯 Development Guidelines

### Color Palette Standards
All theme variants must use these exact color values:

```json
{
  "background": {
    "primary": "#0d1117",
    "secondary": "#0b1929"
  },
  "foreground": {
    "primary": "#a8c3d8",
    "secondary": "#8b9dc3"
  },
  "syntax": {
    "keywords": "#7fb3d5",
    "strings": "#48bb78",
    "functions": "#5dade2",
    "constants": "#d4af37",
    "properties": "#4dc1b5",
    "errors": "#e53e3e",
    "comments": "#4a5568"
  }
}
```

### Accessibility Requirements
- **Contrast Ratios**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Color Blindness**: Test with Deuteranopia, Protanopia, and Tritanopia filters
- **Tools**: Use [Stark](https://www.getstark.co/) or [Color Oracle](https://colororacle.org/) for testing

### Testing Checklist
Before submitting changes, verify:

- [ ] Colors maintain nautical theme consistency
- [ ] All contrast ratios meet WCAG AA standards
- [ ] Theme works across multiple programming languages
- [ ] No syntax highlighting regressions
- [ ] UI elements (sidebar, status bar, terminal) look correct
- [ ] Error states and warnings are clearly visible
- [ ] Theme loads without console errors

## 🚀 Submission Process

### Pull Request Guidelines
1. **Branch Naming**: Use descriptive names
   - `feature/add-atom-support`
   - `fix/javascript-string-highlighting`
   - `docs/update-installation-guide`

2. **Commit Messages**: Follow conventional format
   ```
   type(scope): description
   
   feat(vscode): add support for TypeScript decorators
   fix(iterm): correct string color consistency
   docs(readme): update installation instructions
   ```

3. **PR Description**: Include
   - Clear description of changes
   - Screenshots for visual changes
   - Testing performed
   - Related issue numbers

### Review Process
1. **Automated Checks**: PRs must pass all automated tests
2. **Visual Review**: Screenshots will be reviewed for consistency
3. **Accessibility Check**: Contrast ratios will be verified
4. **Community Feedback**: Complex changes may request community input
5. **Maintainer Approval**: Final approval from project maintainers

### Merge Requirements
- [ ] All automated tests pass
- [ ] Two approving reviews (one from maintainer)
- [ ] No merge conflicts
- [ ] Documentation updated if needed
- [ ] Screenshots provided for visual changes

## 🛠️ Development Setup

### Prerequisites
- Node.js 14+ (for package management)
- VS Code (for testing)
- Git (for version control)

### Local Development
1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR-USERNAME/the-flying-dutchman-theme.git
   cd the-flying-dutchman-theme
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Development Workflow**
   ```bash
   # Make your changes to theme files
   # Test in VS Code by loading the development version
   # Package for testing
   npm run package
   ```

4. **Testing**
   - Load the theme in VS Code using "Developer: Reload Window"
   - Test with multiple file types and languages
   - Verify terminal integration if applicable

## 📝 Documentation Standards

### README Updates
When contributing features that affect user experience:
- Update installation instructions
- Add new screenshots if applicable
- Update feature lists
- Maintain consistent formatting and tone

### Code Documentation
- Comment complex color token mappings
- Document any platform-specific workarounds
- Include references to design decisions

## 🎖️ Recognition

Contributors are recognized in several ways:
- **Contributors List**: All contributors listed in project documentation
- **Release Notes**: Significant contributions highlighted in changelog
- **Community Showcase**: Featured contributions shared on project discussions
- **Maintainer Path**: Outstanding contributors may be invited to become maintainers

## 🆘 Getting Help

Need assistance with your contribution?

- **Development Questions**: [GitHub Discussions Q&A](https://github.com/ADWilkinson/the-flying-dutchman-theme/discussions)
- **Technical Issues**: [GitHub Issues](https://github.com/ADWilkinson/the-flying-dutchman-theme/issues)
- **General Chat**: [GitHub Discussions](https://github.com/ADWilkinson/the-flying-dutchman-theme/discussions)

## 📋 Contribution Checklist

Before submitting your contribution:

- [ ] Read and understood the contributing guidelines
- [ ] Tested changes thoroughly across multiple scenarios
- [ ] Verified accessibility compliance
- [ ] Updated documentation as needed
- [ ] Added screenshots for visual changes
- [ ] Followed code style and naming conventions
- [ ] Written clear commit messages
- [ ] Created descriptive pull request

---

## ⚓ Final Words

Thank you for contributing to The Flying Dutchman theme! Your efforts help create a better coding experience for developers worldwide. Whether you're fixing a small color issue or adding support for an entirely new platform, every contribution is valuable.

*"Part of the ship, part of the crew"* - Welcome aboard! 🚢

---

*Need immediate help? Tag @ADWilkinson in your issue or PR for faster response.*