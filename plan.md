# Plan: Fix method call color WCAG AA contrast (Issue #5)

## Problem Summary
`#5c7c8a` (method/function calls) has 4.24:1 contrast against `#0b1119` background — below WCAG AA 4.5:1. `#4a7c7e` (method.defaultLibrary) is even worse at 3.61:1.

## Chosen Colors
- **Method calls**: `#5c7c8a` -> `#6b8fa0` (~5.2:1 ratio). Stays in the same blue-grey family, minimal visual shift, clears AA with margin. Stays distinct from `#5dade2` (function declarations at 7.7:1).
- **method.defaultLibrary**: `#4a7c7e` -> `#5a9c9e` (~5.0:1 ratio). Stays in the teal family, distinct from method calls.

Option 2 (`#7899a8` at ~6.0:1) was considered but would shift the visual balance too far toward function declarations. Option 3 (`#7fb3d3`) is already used by the high-contrast variant and would blur the distinction between standard and high-contrast themes.

## Files to Modify

### 1. `themes/flying-dutchman-color-theme.json`

**Semantic token colors** — 4 changes:
- Line 31: `"method"` foreground `#5c7c8a` -> `#6b8fa0`
- Line 34: `"method.declaration"` foreground `#5c7c8a` -> `#6b8fa0`
- Line 37: `"method.defaultLibrary"` foreground `#4a7c7e` -> `#5a9c9e`
- Line 46: `"macro"` foreground `#5c7c8a` -> `#6b8fa0`

**UI colors** — 1 change:
- Line 100: `"descriptionForeground"` uses `#4a7c7e` -> `#5a9c9e` (this is a UI element too, same accessibility concern)

**Terminal ANSI colors** — 1 change:
- Line 304: `"terminal.ansiMagenta"` `#5c7c8a` -> `#6b8fa0` (magenta maps to the method color in the terminal palette)

**Token colors** — 1 change:
- Line 472: `meta.method-call` / `meta.function-call` / `variable.function` / `support.function.any-method` foreground `#5c7c8a` -> `#6b8fa0`

### 2. `ghostty/The-Flying-Dutchman`

- Line 10: `palette = 5=#5c7c8a` -> `palette = 5=#6b8fa0` (ANSI magenta = palette index 5)

### 3. `vim/colors/flying-dutchman.vim`

- Line 29: `let s:magenta = "#5C7C8A"` -> `let s:magenta = "#6B8FA0"`
- Line 39: `let g:terminal_color_5 = "#5C7C8A"` -> `let g:terminal_color_5 = "#6B8FA0"`

### 4. `windows-terminal/The-Flying-Dutchman.json`

- Line 18: `"purple": "#5C7C8A"` -> `"purple": "#6B8FA0"`

### 5. `iterm/The-Flying-Dutchman.itermcolors`

- Ansi 5 Color (line 148-160): Update RGB components from `#5C7C8A` to `#6B8FA0`
  - Red: `0.3607843137254902` -> `0.4196078431372549` (107/255)
  - Green: `0.48627450980392156` -> `0.5607843137254902` (143/255)
  - Blue: `0.5411764705882353` -> `0.6274509803921569` (160/255)

### 6. `warp/the-flying-dutchman.yaml`

- Line 36: `magenta: '#5C7C8A'` -> `magenta: '#6B8FA0'`

### 7. `tests/validators/theme-validator.ts`

- Line 37: Update the `functions` palette array from `['#5dade2', '#5c7c8a', '#4a7c7e']` to `['#5dade2', '#6b8fa0', '#5a9c9e']`

### 8. `tests/validators/theme-validator.js` (compiled output)

- Line 45: Same change as above — update the functions array

### 9. `themes/CLAUDE.md`

- Line 41: Update `"method": "#5c7c8a"` to `"method": "#6b8fa0"` in the color reference
- Line 80: Update `**Magenta**: \`#5c7c8a\`` to `**Magenta**: \`#6b8fa0\``

### 10. `warp/README.md` (if it references the old color)

- Line 53: Update `#5C7C8A` to `#6B8FA0` in the magenta row

## Files NOT Modified
- `themes/flying-dutchman-high-contrast.json` — already uses `#7fb3d3` for methods, no changes needed
- `sublime-text/The-Flying-Dutchman.tmTheme` — grep confirmed `#5c7c8a` does not appear in this file, so no change needed
- Bright magenta (`#6b8a96`) across all platforms — not affected by this issue, left as-is

## Approach

1. Update the VSCode theme file (canonical source) with both new colors
2. Update all terminal theme ports (Ghostty, iTerm, Vim, Windows Terminal, Warp) with the new ANSI magenta color
3. Update test validator palette to match new colors
4. Update documentation references in `themes/CLAUDE.md` and `warp/README.md`
5. Run tests to verify

## Edge Cases

- The `descriptionForeground` UI color at line 100 uses `#4a7c7e` — this is a non-syntax UI element but should also get the contrast fix since it renders text against similar dark backgrounds
- The bright magenta terminal color (`#6b8a96`) is NOT being changed — it already has better contrast and is a separate palette entry
- iTerm uses float RGB components (0.0-1.0) not hex — must convert correctly
- The compiled `.js` file for the theme validator must also be updated to stay in sync

## Validation

```bash
# Run all tests
npx jest --no-coverage

# Verify contrast ratios (manual check)
# #6b8fa0 against #0b1119: should be ~5.2:1 (PASS AA)
# #5a9c9e against #0b1119: should be ~5.0:1 (PASS AA)
```

All 39 existing tests should continue to pass. No new test files needed — the existing accessibility test validates editor text contrast, and the theme-validator palette check will pass with updated expected colors.
