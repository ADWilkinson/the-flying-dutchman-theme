# Changelog

All notable changes to The Flying Dutchman. Format based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/); versioning follows
[SemVer](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- 102 more workbench colours fell through to VS Code's own stock defaults. The
  previous audit covered only `src/vs/platform/theme/common/colors/*.ts`, but
  colours are registered all over the tree, and the registries it missed are the
  loud ones: the Variables and Watch views drew token names in Dark+ purple
  (`#c586c0`) and types in Dark+ blue (`#4A90E2`); the suggest widget, outline
  and breadcrumbs drew method and constructor icons in `#B180D7` and class icons
  in `#EE9D28`; the three-way merge editor drew its changes in lime
  (`#9bb95533`) over amber conflict borders (`#ffa600`); the Source Control
  graph drew branch lanes in magenta and brown; the Test Explorer drew passing
  tests in `#73c991`; and the debug toolbar drew every step icon in `#75BEFF`.
  None of those hexes exists anywhere in this palette. Every one is now read
  from a palette role — debug token expressions and symbol icons from the same
  roles as the syntax tokens they stand for, so a value in the Variables view is
  the colour it is in the editor. All three variants gain the same 102 keys
  (307 -> 409 colours each). `test/workbench-defaults.test.mjs` now audits the
  whole `registerColor()` registry at VS Code `1.135.0` — 217 keys, up from 29 —
  and still requires each one to resolve to a palette role rather than a pinned
  literal.

- The High Contrast and Soft variants shipped the Standard variant's bright
  terminal ANSI row. `ansi()` took a variant name and all six of its call sites
  passed the literal `'standard'`, so the palette's authored Soft bright row was
  dead code and High Contrast had no bright row at all. In High Contrast the
  result was an inversion: bright green (`#84d2b4`), yellow (`#e5d49e`) and cyan
  (`#86cfd5`) were *darker* than their own normal counterparts (`#7fd7b5`,
  `#f6db88`, `#86dee4`), so bold integrated-terminal output read duller than
  plain text in the variant chosen for maximum contrast. Soft got a fully
  saturated bright row against its muted normal row. `ansi()` now takes only a
  palette — no caller can pass a wrong variant — and each variant's bright row
  is authored in `palette.mjs` beside its other roles. The Standard theme and
  all six terminal/editor ports are byte-identical; only the High Contrast and
  Soft theme JSONs change.

- `vsce package` shipped a second copy of the whole repository when an agent
  worktree was present. `.vscodeignore` did not name `.worktrees/`, and `vsce`
  reads only that file — never `.gitignore` — so a scratch tree that `git
  status` reports as clean (it is ignored by a machine-local global gitignore)
  turned a 9-file / 30 KB vsix into 35 files / 340 KB, including `CLAUDE.md`,
  `.github/`, `scripts/` and every terminal port. `.worktrees/` and `.claude/`
  are now excluded, and a new test asserts the packaged payload is exactly the
  seven files a user should receive, with a scratch worktree planted in the tree.

- 29 workbench colours were never set, so VS Code filled them from its own
  registry defaults instead of the palette — and those defaults are hard-coded
  literals, not derivations of the theme. The Command Palette drew its group
  labels in stock `#3794FF`, the code-action bulb in stock `#FFCC00`, the error
  activity badge in `#F14C4C`, and inlay hints in `#969696`, straight through a
  palette whose whole rule is that nothing shouts. All 29 now resolve to a
  palette role in all three variants, and a new test pins the audited list so a
  future VS Code colour cannot quietly reopen the gap. `check:themes` could not
  see this: it proves the committed bytes match the emitter, and a key the
  emitter never writes matches perfectly.

- The Vim / Neovim port raised an error on every `:colorscheme flying-dutchman`
  in Vim. The `this` / `self` fix below emitted the Neovim treesitter group
  `@variable.builtin` unguarded, and Vim only accepts `[A-Za-z0-9_]` in a group
  name, so Vim 9.1 answered `W18: Invalid character in group name`. The group is
  now wrapped in `if has('nvim')`: Neovim keeps the coral role, Vim loads
  silently, and a new test rejects any group name Vim would parse and refuse.
  Neovim was never affected.

- The Vim / Neovim port never coloured `this` / `self`. Its `" this / self"`
  section re-emitted `Boolean` instead, so the coral role that VS Code
  (`variable.language`) and Sublime (the `This` rule) both ship was missing, and
  `Boolean` was defined twice — the second definition silently overrode the
  first. The port now emits `@variable.builtin` in coral italic, and a new test
  pins cross-port parity and rejects any duplicate `highlight` group;
  `check:themes` could only prove the committed bytes matched the emitter, so a
  wrong mapping round-tripped clean. Broken since the 2.0 redraw.

- The Sublime Text port was not valid XML and would not load. The rule names
  `Number & Constant` and `Type & Class` wrote a bare `&` into the `.tmTheme`,
  which every plist parser rejects; it has been broken since the 2.0 redraw.
  The plist emitters now escape interpolated text, and a new test parses the
  generated `.tmTheme` and `.itermcolors` for well-formedness — `check:themes`
  alone could only prove the committed bytes matched the emitters, so a
  malformed artifact round-tripped clean. Only the repo-served port changed;
  the `.vsix` never contained these files.

- Added `npm run check:published`, which compares `package.json` against the
  version the Marketplace actually serves. A new `Release drift` workflow runs it
  on every push to `main` and weekly, so a merged-but-unpublished fix reports
  itself instead of sitting silently — 2.0.1 went six weeks without reaching a
  single user. It only warns; an unreachable gallery cannot block a merge.

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
