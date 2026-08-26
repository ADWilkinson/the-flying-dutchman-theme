# Changelog

All notable changes to The Flying Dutchman. Format based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/); versioning follows
[SemVer](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.2]

- `npm run check:themes` now also verifies every generated theme file matches
  the palette and emitters byte-for-byte. Check mode is read-only: it names
  missing or stale files and does not rewrite them.
- Pointed the README Galleon attribution at https://galleonlabs.io (the old
  `/fleet/flying-dutchman` path 404ed).

## [2.0.1]

Recorded here but never published to the Marketplace, which served 2.0.0 from
2026-07-12; the badge fix below reaches users in 2.0.2.

- Replaced the README status badges — shields.io retired its `visual-studio-marketplace`
  endpoints (they rendered as "retired badge"). Version/installs/rating now use live
  `vsmarketplacebadges.dev` badges in the theme's own palette colours.

## [2.0.0]

A ground-up redraw for harmony and craft.

### Changed

- **One harmonious palette.** Every colour is now derived from a single
  HSL-authored source (`scripts/palette.mjs`) and tuned to the same brightness,
  so the theme reads as one weathered instrument. Functions are now a
  bioluminescent teal instead of the old dead grey; a single coral carries tags
  and `this`.
- **The three variants are true tonal siblings.** High Contrast and Soft
  previously drifted into different colour schemes (rogue purple keywords, pink
  namespaces). They now share the Standard hues and differ only in intensity.
- **Every editor is generated from the same palette**, so VS Code, Ghostty,
  iTerm2, Warp, Windows Terminal, Vim/Neovim, and Sublime Text can no longer
  drift apart. Run `npm run build:themes` to regenerate; `npm run check:themes`
  prints a WCAG report.
- All roles verified ≥ 4.5:1 against the editor background on all three variants.

### Removed

- **The runtime extension.** The theme-switcher commands, the status-bar item,
  and the configuration settings are gone. This is now a pure theme
  contribution — no activation, no background code. Switch variants with the
  native picker (`Ctrl/Cmd`+`K` `Ctrl/Cmd`+`T`).
- Committed build artifacts, coverage reports, and the Jest test harness. Theme
  correctness is now validated by `check:themes`.

## [1.4.0]

- Documentation cleanup; modern `ts-jest` configuration.

## [1.3.0]

- Added the High Contrast and Soft variants and the extension configuration
  system (both reworked in 2.0.0).

## [1.0.0]

- Initial release: nautical dark theme for VS Code with semantic and TextMate
  highlighting, plus terminal and editor ports.
