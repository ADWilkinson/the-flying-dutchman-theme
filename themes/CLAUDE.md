# VSCode Theme - Development Context

## Overview
The VSCode theme is the canonical implementation of The Flying Dutchman color scheme, serving as the primary reference for all other editor ports. It uses VSCode's modern theme structure with both semantic token colors and traditional TextMate token colors to provide comprehensive syntax highlighting support.

## Key Files and Structure
```
themes/
└── flying-dutchman-color-theme.json  # Complete VSCode theme definition
```

## Theme Architecture

### Dual Token System
The theme uses VSCode's modern dual approach for maximum compatibility:

**Semantic Token Colors** (lines 5-57):
- Modern, language-aware highlighting
- Context-sensitive color assignment
- Supports TypeScript, JavaScript, and other LSP-enabled languages
- Provides precise differentiation between declarations, usage, and library items

**TextMate Token Colors** (lines 315-575):
- Traditional scope-based highlighting
- Fallback for unsupported languages
- Broader language compatibility
- Pattern-based syntax matching

### Color Token Structure

#### Semantic Tokens
```json
"semanticTokenColors": {
    "parameter.declaration": "#d1a458",    // Function parameter definitions
    "parameter": "#b0c4de",                // Function parameters in usage
    "property.declaration": "#4dbdba",     // Property definitions
    "property.defaultLibrary": "#5dade2",  // Built-in properties
    "variable.declaration": "#7aa3c1",     // Variable declarations
    "variable": "#b0c4de",                 // Variable usage
    "function": "#5dade2",                 // Function names
    "method": "#5c7c8a",                   // Method calls
    "type": "#d1a458",                     // Type definitions
    "class": "#d1a458",                    // Class names
    "namespace": "#d1a458"                 // Namespace identifiers
}
```

#### UI Color Categories
- **Editor**: Background, foreground, selections, highlights, cursor
- **Activity Bar**: Navigation sidebar with icons and badges
- **Side Bar**: File explorer, search, extensions panel
- **Tabs**: Active/inactive tab styling and borders
- **Status Bar**: Bottom information bar
- **Terminal**: ANSI colors and terminal-specific styling
- **Panels**: Output, debug, problems panels
- **Lists**: Hover, selection, focus states
- **Input**: Form controls and validation states
- **Notifications**: Toast messages and notification center

## Nautical Color Mapping

### Core Theme Colors
- **Deep Ocean**: `#0b1119` (editor background), `#0b1929` (secondary backgrounds)
- **Sea Spray**: `#b0c4de` (primary text), `#a8c3d8` (terminal text)
- **Aged Brass**: `#d1a458` (constants, types, classes)
- **Caribbean Blue**: `#5dade2` (functions, keywords, links)
- **Seaweed Green**: `#45b097` (strings)
- **Turquoise**: `#4dc1b5` (properties, CSS properties)
- **Storm Blue**: `#7aa3c1` (storage, keywords)
- **Fog Grey**: `#546e7a` (comments)
- **Weathered Slate**: `#94a3b8` (operators, punctuation)

### ANSI Terminal Colors
Maintains nautical theme consistency in integrated terminal:
- **Black**: `#0d1117` (ocean depths)
- **Red**: `#e85d5d` (danger/errors)
- **Green**: `#45b097` (success/additions)
- **Yellow**: `#e4b968` (warnings)
- **Blue**: `#5dade2` (information)
- **Magenta**: `#5c7c8a` (methods/special)
- **Cyan**: `#4dc1b5` (properties/data)
- **White**: `#a8c3d8` (text)

## Language-Specific Support

### JavaScript/TypeScript
- **Functions**: Caribbean blue for definitions, storm blue for calls
- **Variables**: Light blue for declarations, sea spray for usage
- **Properties**: Turquoise for object properties
- **Constants**: Aged brass for immutable values
- **JSX Elements**: Brass tones for React components

### HTML/XML
- **Tags**: Brass tones for element names
- **Attributes**: Gold/yellow for attribute names
- **Text Content**: Sea spray for inner text
- **Embedded Expressions**: Maintains JavaScript coloring

### CSS
- **Selectors**: Storm blue for CSS selectors
- **Properties**: Turquoise for CSS properties
- **Values**: Various colors based on value type
- **Classes**: Brass for class selectors
- **IDs**: Caribbean blue for ID selectors

### Markdown
- **Headings**: Caribbean blue with bold styling
- **Quotes**: Fog grey with italic styling
- **Bold**: Brass with bold styling
- **Italic**: Storm blue with italic styling
- **Code**: Turquoise for inline code
- **Links**: Caribbean blue for URLs

## Development Guidelines

### Color Consistency Rules
1. **Semantic Hierarchy**: More important elements use brighter, warmer colors
2. **Visual Grouping**: Related syntax elements share similar hue families
3. **Contrast Standards**: All text maintains WCAG AA contrast ratios
4. **Accessibility**: Sufficient color differentiation for colorblind users

### Token Scope Mapping
When adding support for new languages:
1. Map new scopes to existing semantic tokens where possible
2. Use TextMate token colors as fallback for unsupported semantic tokens
3. Maintain color consistency with similar syntax elements
4. Test with actual code samples to verify readability

### Color Modification Process
1. Update colors in semantic tokens first
2. Update corresponding TextMate scopes
3. Verify UI colors complement syntax changes
4. Test across multiple languages and file types
5. Ensure terminal colors maintain theme consistency

## Testing Strategy

### Visual Testing
- **Multi-Language**: Test with JavaScript, TypeScript, Python, HTML, CSS, JSON, Markdown
- **Code Complexity**: Test with nested functions, complex objects, long files
- **Edge Cases**: Test with syntax errors, incomplete code, mixed languages

### Accessibility Testing
- **Contrast Ratios**: Verify all text meets WCAG AA standards (4.5:1)
- **Color Blindness**: Test with deuteranopia and protanopia simulators
- **Screen Readers**: Ensure semantic meaning isn't color-dependent

### Integration Testing
- **Extensions**: Test with popular VSCode extensions (Prettier, ESLint, GitLens)
- **Themes**: Verify compatibility with icon themes and product icon themes
- **Settings**: Test with different font sizes, line heights, and editor settings

## Common Modifications

### Adding New Language Support
1. Research language's TextMate grammar scopes
2. Map scopes to existing color categories
3. Add specific scope overrides in `tokenColors` array
4. Test with representative code samples
5. Document any special considerations

### Adjusting Contrast
1. Identify problematic color combinations
2. Adjust lightness while maintaining hue consistency
3. Re-test across all supported languages
4. Update color documentation

### UI Element Styling
1. Locate appropriate UI color category in `colors` object
2. Maintain consistency with existing nautical palette
3. Test interactive states (hover, active, focus)
4. Verify across different panel configurations

## Integration Points
- **package.json**: Theme metadata and VSCode engine compatibility
- **Extension Ports**: Color values referenced by other editor themes
- **Documentation**: Color descriptions in README.md
- **Testing**: Color contrast and accessibility validation

## Quality Standards
- All colors must pass WCAG AA contrast requirements
- Semantic tokens take precedence over TextMate tokens
- Color choices must align with nautical theme philosophy
- UI elements must maintain visual hierarchy and clarity
- Terminal colors must be distinct and readable

Remember: This theme serves as the canonical color definition for the entire The Flying Dutchman theme family. Changes here should be reflected across all editor ports to maintain consistency.