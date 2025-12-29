# The Flying Dutchman Theme for Warp Terminal

A nautical-inspired dark theme for [Warp Terminal](https://www.warp.dev/) featuring oceanic blues, weathered ship colors, and a deep sea aesthetic.

## Installation

### Method 1: Manual Installation (Recommended)

1. **Download the theme file:**
   - Download `the-flying-dutchman.yaml` from this repository

2. **Copy to Warp themes directory:**
   ```bash
   # Create the themes directory if it doesn't exist
   mkdir -p ~/.warp/themes
   
   # Copy the theme file
   cp the-flying-dutchman.yaml ~/.warp/themes/
   ```

3. **Apply the theme:**
   - Open Warp Terminal
   - Press `Cmd+,` (macOS) or `Ctrl+,` (Linux) to open Settings
   - Navigate to **Appearance** → **Themes**
   - Find "The Flying Dutchman" in the theme list
   - Click to apply

### Method 2: Direct Download

1. **Navigate to Warp themes directory:**
   ```bash
   cd ~/.warp/themes
   ```

2. **Download the theme directly:**
   ```bash
   curl -O https://raw.githubusercontent.com/[your-username]/the-flying-dutchman-theme/main/warp/the-flying-dutchman.yaml
   ```

3. **Restart Warp** or refresh themes to see the new theme

## Color Palette

| Color Type | Hex Code | Description |
|------------|----------|-------------|
| **Background** | `#0B1119` | Deep Sea |
| **Foreground** | `#B0C4DE` | Light Powder Blue |
| **Accent/Cursor** | `#5DADE2` | Ocean Blue |
| **Red** | `#E85D5D` | Ship Warning Red |
| **Green** | `#45B097` | Sea Kelp Green |
| **Yellow** | `#E4B968` | Treasure Gold |
| **Blue** | `#5DADE2` | Ocean Blue |
| **Magenta** | `#5C7C8A` | Storm Purple |
| **Cyan** | `#4DC1B5` | Seafoam Cyan |

## Features

- **Nautical Color Scheme**: Inspired by ocean depths and weathered ships
- **High Contrast**: Optimized for readability in terminal environments
- **ANSI Color Support**: Full 16-color terminal palette
- **Dark Theme**: Easy on the eyes for long coding sessions
- **Maritime Aesthetic**: Perfect for developers who love the sea

## Screenshots

*Screenshots would show the theme in action with code syntax highlighting and terminal commands*

## Compatibility

- **Warp Terminal**: v0.2022.05.02.08.40.stable and later
- **Operating Systems**: macOS, Linux
- **File Format**: YAML (.yaml)

## Theme Variants

This theme is part of The Flying Dutchman theme collection, also available for:
- [VS Code](../themes/flying-dutchman-color-theme.json)
- [iTerm2](../iterm/The-Flying-Dutchman.itermcolors)
- [Windows Terminal](../windows-terminal/The-Flying-Dutchman.json)
- [Vim/Neovim](../vim/colors/flying-dutchman.vim)
- [Sublime Text](../sublime-text/The-Flying-Dutchman.tmTheme)

## Troubleshooting

### Theme Not Appearing
- Ensure the file is in `~/.warp/themes/`
- Check that the file has a `.yaml` extension
- Restart Warp Terminal
- Verify YAML syntax is correct

### Colors Not Displaying Correctly
- Make sure your terminal supports 256 colors
- Check that Warp is updated to the latest version
- Verify the theme file wasn't corrupted during download

### Custom Theme Directory
If you use a custom themes directory, place the file there instead:
```bash
# Example custom directory
cp the-flying-dutchman.yaml ~/my-custom-themes/
```

## Contributing

Found an issue or want to suggest improvements? Please open an issue or submit a pull request on the main repository.

## License

This theme is part of The Flying Dutchman theme collection and follows the same licensing terms as the parent project.

---

*Set sail with The Flying Dutchman theme and navigate your code like a true maritime explorer.*