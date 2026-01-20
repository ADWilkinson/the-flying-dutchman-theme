# The Flying Dutchman Theme - Development Context

## Overview
The Flying Dutchman is a multi-editor color theme package inspired by the legendary ghost ship and maritime folklore. The project provides consistent nautical-themed dark color schemes across VSCode, Ghostty, iTerm, Sublime Text, Vim, and Windows Terminal, featuring deep ocean blues, aged brass accents, and bioluminescent highlights.

## Key Files and Structure
```
the-flying-dutchman-theme/
├── package.json                           # VSCode extension manifest and metadata
├── themes/
│   └── flying-dutchman-color-theme.json  # Primary VSCode theme definition
├── ghostty/
│   └── The-Flying-Dutchman               # Ghostty terminal theme
├── iterm/
│   └── The-Flying-Dutchman.itermcolors   # iTerm2 color scheme
├── sublime-text/
│   └── The-Flying-Dutchman.tmTheme       # Sublime Text theme (TextMate format)
├── vim/
│   └── colors/
│       └── flying-dutchman.vim           # Vim colorscheme
├── windows-terminal/
│   └── The-Flying-Dutchman.json          # Windows Terminal theme
└── README.md                             # User documentation and installation guide
```

## Theme Philosophy
The color palette follows a consistent nautical design language across all editors:
- **Deep Ocean Blues**: Primary backgrounds (#0d1117, #0b1929) representing ocean depths
- **Aged Brass & Gold**: Syntax highlighting (#d4af37) like ship instruments 
- **Sea Foam & Mist**: Text colors (#a8c3d8, #8b9dc3) resembling maritime atmosphere
- **Weathered Elements**: UI colors reflecting aged ship materials
- **Bioluminescent Accents**: Special highlights mimicking deep-sea creatures

## Color Palette Standards
Core colors used consistently across all theme formats:
- **Background**: `#0d1117` (deep ocean), `#0b1929` (abyss)
- **Foreground**: `#a8c3d8` (sea spray), `#8b9dc3` (aged parchment)
- **Keywords**: `#7fb3d5` (storm blue)
- **Strings**: `#48bb78` (seaweed green)
- **Functions**: `#5dade2` (Caribbean blue)
- **Constants**: `#d4af37` (aged brass)
- **Properties**: `#4dc1b5` (turquoise)
- **Errors**: `#e53e3e` (danger red)
- **Comments**: `#4a5568` (fog grey)

## Development Guidelines

### Adding New Editor Support
When porting the theme to a new editor:
1. Research the editor's theme format and color token structure
2. Map VSCode theme tokens to the target editor's syntax scopes
3. Maintain color consistency using the established palette
4. Test with multiple programming languages to ensure proper coverage
5. Update README.md with installation instructions for the new editor

### Color Token Mapping
Each editor uses different naming conventions for syntax highlighting:
- **VSCode**: Uses semantic tokens and TextMate scopes
- **Ghostty**: Uses palette indices and named colors (similar to iTerm)
- **iTerm**: Uses ANSI color indices and named colors
- **Sublime Text**: Uses TextMate grammar scopes
- **Vim**: Uses highlight group names
- **Windows Terminal**: Uses scheme-based color definitions

### Maintaining Consistency
- Use the same hex color values across all editor themes
- Test themes with the same code samples in each editor
- Ensure readability and contrast ratios meet accessibility standards
- Document any editor-specific adaptations or limitations

## Architecture Patterns

### Theme Structure
- **Primary Theme**: VSCode theme serves as the canonical color definition
- **Port Themes**: Other editors maintain color consistency while adapting to their formats
- **Single Source**: All themes derive from the same color palette specification

### File Organization
- Each editor has its own subdirectory with appropriate file extensions
- Theme files follow each editor's naming conventions and directory structures
- Configuration files (package.json) contain all necessary metadata for distribution

## Testing Strategy
- **Visual Testing**: Compare themes across editors with identical code samples
- **Accessibility Testing**: Verify contrast ratios meet WCAG guidelines
- **Multi-Language Testing**: Test with various programming languages to ensure comprehensive syntax coverage
- **Cross-Platform Testing**: Validate themes work on different operating systems

## Common Tasks

### Creating a New Editor Port
1. Research the target editor's theme format documentation
2. Create appropriate directory structure (e.g., `editor-name/`)
3. Convert color values from VSCode theme to target format
4. Map syntax scopes to achieve visual consistency
5. Test thoroughly with multiple file types
6. Add installation instructions to README.md

### Updating Colors
1. Modify colors in the primary VSCode theme file
2. Update all editor ports to maintain consistency
3. Test changes across all supported editors
4. Update color documentation in README.md
5. Verify accessibility and readability standards

### Publishing Updates
1. Update version in package.json
2. Test all theme files in their respective editors
3. Update README.md with any new features or changes
4. Use `npm run package` to create VSCode extension
5. Use `npm run publish` to publish to VSCode Marketplace

## Integration Points
- **VSCode Marketplace**: Primary distribution channel for VSCode extension
- **Editor Plugin Repositories**: Each editor may have its own theme distribution system
- **GitHub Releases**: Manual installation source for all theme variants
- **Package Managers**: Some editors support theme installation via package managers

## Development Environment Setup
1. Install VSCode with theme development extensions
2. Install target editors for testing (iTerm, Sublime Text, Vim, Windows Terminal)
3. Set up theme development workflow with hot-reload where possible
4. Use JSON/XML validation tools for theme file syntax checking

## Quality Standards
- All theme files must validate against their respective format schemas
- Color contrast ratios must meet WCAG AA standards (4.5:1 for normal text)
- Themes must support both light and dark syntax highlighting needs
- Cross-editor visual consistency is prioritized over editor-specific optimizations

Remember: This is a theme package focused on visual consistency and user experience across multiple development environments. Changes should maintain the nautical aesthetic while ensuring excellent readability and developer productivity.