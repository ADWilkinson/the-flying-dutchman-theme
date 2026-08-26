# The Flying Dutchman — dev context

An artisan nautical dark theme for VS Code plus six terminals/editors. It is a
**pure theme** — no runtime extension code, no activation, no background
services. Just JSON/config files, all generated from one palette.

## The single source of truth

`scripts/palette.mjs` defines every colour, in HSL, once. `scripts/emitters.mjs`
turns those roles into each editor's format. `scripts/build-themes.mjs` writes
every file; `--check` prints a WCAG report and verifies committed outputs
without rewriting them.

```bash
npm run build:themes    # regenerate all editors + all 3 variants
npm run check:themes    # WCAG + byte-identical generated files (read-only; non-zero on AA or drift)
npm test                # clean tree passes; stale/missing generated files fail without being rewritten
```

**Never hand-edit a generated theme file.** Change `palette.mjs`, rebuild, commit
the palette change and the regenerated output together.

## Structure

```
scripts/
  palette.mjs      # HSL master palette — the only place colours are decided
  emitters.mjs     # role -> VS Code / ghostty / iterm / warp / wt / vim / sublime
  build-themes.mjs # writes every file; --check is read-only (WCAG + artifact match)
themes/            # 3 generated VS Code variants (standard, high-contrast, soft)
ghostty/ iterm/ sublime-text/ vim/ warp/ windows-terminal/   # generated ports
screenshots/       # hero.png used by the README (absolute raw URL)
package.json       # pure theme contribution (contributes.themes only)
```

## Design rules

- **One palette, three intensities.** The variants share hues; only lightness and
  saturation move. They must always read as the same theme.
- **Harmony over variety.** Every syntax role is tuned to a similar brightness so
  no colour shouts. Warm brass/gold and a single coral anchor an otherwise cool
  ocean palette.
- **AA everywhere.** Every role clears 4.5:1 against its editor background;
  comments/punctuation may sit at AA-large (3:1). `check:themes` enforces it
  and that committed generated files still match the palette and emitters.

## Publishing

`npm run package` builds the `.vsix` (prepublish regenerates themes first);
`npm run publish` pushes to the VS Code Marketplace under the `DavyJones`
publisher. Bump `version` in `package.json` and add a `CHANGELOG.md` entry first.

Merging is not shipping. `npm run check:published` reports whether the listing
actually serves what `package.json` claims; the `Release drift` workflow runs it
on every push to `main` and weekly and warns without ever blocking a merge. After
publishing, read it back with `npm run check:published -- --strict`, which exits
non-zero until the gallery serves the current version (allow ~15 min for CDN
propagation).
