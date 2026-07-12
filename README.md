<div align="center">

# The Flying Dutchman

*An artisan nautical dark theme — abyssal ocean, aged brass, and a bioluminescent glow.*

[![Version](https://vsmarketplacebadges.dev/version-short/DavyJones.the-flying-dutchman-theme.svg?style=flat-square&color=5cc4cc)](https://marketplace.visualstudio.com/items?itemName=DavyJones.the-flying-dutchman-theme)
[![Installs](https://vsmarketplacebadges.dev/installs-short/DavyJones.the-flying-dutchman-theme.svg?style=flat-square&color=d3ac64)](https://marketplace.visualstudio.com/items?itemName=DavyJones.the-flying-dutchman-theme)
[![Rating](https://vsmarketplacebadges.dev/rating-short/DavyJones.the-flying-dutchman-theme.svg?style=flat-square&color=65bd9c)](https://marketplace.visualstudio.com/items?itemName=DavyJones.the-flying-dutchman-theme&ssr=false#review-details)
[![License: MIT](https://img.shields.io/badge/license-MIT-e09585?style=flat-square)](LICENSE)

![The Flying Dutchman theme](https://raw.githubusercontent.com/ADWilkinson/the-flying-dutchman-theme/main/screenshots/hero.png)

</div>

Colours drawn from the legend of Davy Jones and his ghost ship: a hull lost in
abyssal blue-black, the brass of his organ, seafoam on the wake, and a cold
storm-blue in the rigging. Every colour is tuned to the same brightness so the
whole palette reads as one weathered instrument rather than a box of crayons.

Three variants, one identity — they share their hues and differ only in
intensity, so switching never feels like a different theme:

- **The Flying Dutchman** — the balanced everyday palette.
- **High Contrast** — the same colours, brighter, on near-black. WCAG AAA on text.
- **Soft** — muted and gentle for long, low-glare sessions.

## Palette

| Role | Colour | | Role | Colour |
|---|---|---|---|---|
| Keyword — storm blue | `#75acd1` | | Type — aged brass | `#d3ac64` |
| String — seafoam | `#65bd9c` | | Constant — gold | `#e0c471` |
| Function — bioluminescence | `#5cc4cc` | | Property — shoal cyan | `#8bc0d0` |
| Tag & `this` — coral | `#e09585` | | Comment — fog | `#6a7b8a` |
| Foreground — sea mist | `#bfcbd9` | | Abyss — editor | `#131920` |

Every role clears WCAG AA (4.5:1) against the editor background on all three
variants; run `npm run check:themes` to see the full contrast report.

## Install — VS Code

1. Open the Extensions view (`Ctrl/Cmd`+`Shift`+`X`), search **The Flying Dutchman**, Install.
2. `Ctrl/Cmd`+`K` `Ctrl/Cmd`+`T`, then pick a variant.

Or from the command line:

```bash
code --install-extension DavyJones.the-flying-dutchman-theme
```

## Install — terminals & other editors

The same palette ships for six more surfaces. Each folder holds one file.

| Where | File | Install |
|---|---|---|
| Ghostty | [`ghostty/`](ghostty/) | copy to `~/.config/ghostty/themes/`, set `theme = The-Flying-Dutchman` |
| iTerm2 | [`iterm/`](iterm/) | Preferences → Profiles → Colors → Import the `.itermcolors` |
| Warp | [`warp/`](warp/) | copy the `.yaml` to `~/.warp/themes/` |
| Windows Terminal | [`windows-terminal/`](windows-terminal/) | add the scheme to `settings.json` |
| Vim / Neovim | [`vim/`](vim/) | copy to `colors/`, then `colorscheme flying-dutchman` |
| Sublime Text | [`sublime-text/`](sublime-text/) | Preferences → Browse Packages → drop in the `.tmTheme` |

## One palette, one source of truth

Every theme file in this repo is generated from a single palette so the colours
can never drift apart across editors or variants:

```bash
npm run build:themes    # regenerate all editors from scripts/palette.mjs
npm run check:themes     # print the WCAG contrast report
```

To adjust a colour, edit [`scripts/palette.mjs`](scripts/palette.mjs) and rebuild —
never hand-edit the generated theme files. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).

<div align="center">
<sub><i>"Part of the ship, part of the crew."</i></sub>
</div>
