# Contributing

Thanks for helping improve The Flying Dutchman.

## The one rule: never hand-edit the theme files

Every file under `themes/`, `ghostty/`, `iterm/`, `sublime-text/`, `vim/`,
`warp/`, and `windows-terminal/` is **generated**. The single source of truth is
[`scripts/palette.mjs`](scripts/palette.mjs).

```bash
node scripts/build-themes.mjs          # regenerate every editor + variant
node scripts/build-themes.mjs --check  # WCAG report + byte-identical generated files (read-only)
npm test                               # clean tree passes; stale/missing generated files fail without being rewritten
```

`--check` never creates, overwrites, or repairs generated files. It exits
non-zero and names the path when any output is missing or does not match the
palette and emitters exactly.

There are no dependencies to install — the scripts are plain Node ESM.

## Changing a colour

1. Edit the relevant role in `scripts/palette.mjs`. Colours are authored in HSL
   so the three variants stay tonal siblings — change a hue once and it moves
   everywhere consistently.
2. Run `node scripts/build-themes.mjs` and commit the regenerated files together
   with the palette change.
3. Keep every role at **≥ 4.5:1** against its editor background (`--check`
   enforces this, and that generated files still match). Comments and
   punctuation may sit at AA-large (3:1).

## Adding an editor

Add an emitter to [`scripts/emitters.mjs`](scripts/emitters.mjs) that consumes the
shared role names, wire it into `build-themes.mjs`, and open a PR with the
generated output included.

## Reporting

Open an [issue](https://github.com/ADWilkinson/the-flying-dutchman-theme/issues)
with a screenshot, the variant, and the language you're looking at.
