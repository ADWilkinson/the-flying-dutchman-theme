// Format emitters — turn a palette into each editor's native theme format.
// Every editor consumes the same role names, so a colour decided once in
// palette.mjs lands identically everywhere.

import { alpha, ansi } from './palette.mjs';

// ---------------------------------------------------------------------------
// VS Code
// ---------------------------------------------------------------------------

export function vscodeTheme(name, p) {
  const t = (foreground, fontStyle) =>
    fontStyle ? { foreground, fontStyle } : { foreground };

  const semanticTokenColors = {
    variable: p.fg,
    'variable.readonly': p.constant,
    parameter: p.fg,
    property: p.property,
    'property.readonly': p.property,
    'variable.defaultLibrary': p.info,
    'property.defaultLibrary': p.info,
    function: p.func,
    'function.defaultLibrary': p.func,
    method: p.func,
    'method.defaultLibrary': p.func,
    macro: p.func,
    type: p.type,
    class: p.type,
    interface: p.type,
    enum: p.type,
    struct: p.type,
    namespace: p.type,
    typeParameter: p.type,
    enumMember: p.constant,
    decorator: p.constant,
    keyword: p.keyword,
    number: p.constant,
    boolean: p.constant,
    string: p.string,
    regexp: p.constant,
    operator: p.fgMuted,
    comment: t(p.fgDim, 'italic'),
    'variable.builtin': t(p.coral, 'italic'),
    selfParameter: t(p.coral, 'italic'),
  };

  const tokenColors = [
    { scope: ['comment', 'punctuation.definition.comment'], settings: t(p.fgDim, 'italic') },
    { scope: ['string', 'punctuation.definition.string', 'string.quoted', 'string.template'], settings: t(p.string) },
    { scope: ['constant.character.escape', 'string.regexp', 'punctuation.definition.template-expression'], settings: t(p.constant) },
    { scope: ['constant.numeric', 'constant.language', 'constant.language.boolean', 'keyword.other.unit'], settings: t(p.constant) },
    { scope: ['constant', 'support.constant', 'variable.other.constant'], settings: t(p.constant) },
    { scope: ['keyword', 'keyword.control', 'keyword.operator.new', 'keyword.operator.expression', 'storage', 'storage.type', 'storage.modifier'], settings: t(p.keyword) },
    { scope: ['keyword.operator', 'punctuation.accessor', 'punctuation.separator', 'punctuation.terminator', 'meta.brace.round', 'meta.brace.square', 'meta.brace.curly', 'punctuation.section', 'punctuation.definition.block'], settings: t(p.fgMuted) },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call.generic', 'variable.function'], settings: t(p.func) },
    { scope: ['entity.name.type', 'entity.name.class', 'support.class', 'support.type', 'entity.other.inherited-class', 'entity.name.namespace', 'entity.name.type.class'], settings: t(p.type) },
    { scope: ['variable', 'variable.other.readwrite', 'meta.definition.variable.name', 'support.variable'], settings: t(p.fg) },
    { scope: ['variable.parameter', 'meta.parameter'], settings: t(p.fg) },
    { scope: ['variable.language', 'variable.language.this', 'variable.language.super'], settings: t(p.coral, 'italic') },
    { scope: ['support.type.property-name', 'meta.object-literal.key', 'variable.other.property', 'variable.other.object.property'], settings: t(p.property) },
    { scope: ['entity.name.tag', 'entity.name.tag.html', 'entity.name.tag.xml'], settings: t(p.coral) },
    { scope: ['entity.other.attribute-name'], settings: t(p.constant) },
    { scope: ['support.class.component', 'support.class.component.jsx', 'support.class.component.tsx'], settings: t(p.type) },
    // CSS
    { scope: ['entity.name.tag.css', 'meta.selector'], settings: t(p.keyword) },
    { scope: ['entity.other.attribute-name.class.css'], settings: t(p.type) },
    { scope: ['entity.other.attribute-name.id.css'], settings: t(p.func) },
    { scope: ['entity.other.attribute-name.pseudo-class.css', 'entity.other.attribute-name.pseudo-element.css'], settings: t(p.constant) },
    { scope: ['support.type.property-name.css', 'support.type.property-name.scss', 'support.type.property-name.less'], settings: t(p.property) },
    { scope: ['support.constant.property-value.css', 'meta.property-value.css'], settings: t(p.fg) },
    // JSON
    { scope: ['support.type.property-name.json', 'meta.structure.dictionary.key.json'], settings: t(p.property) },
    // Markdown & markup
    { scope: ['markup.heading', 'markup.heading entity.name', 'entity.name.section.markdown'], settings: t(p.func, 'bold') },
    { scope: ['markup.bold'], settings: t(p.constant, 'bold') },
    { scope: ['markup.italic'], settings: t(p.keyword, 'italic') },
    { scope: ['markup.quote'], settings: t(p.fgDim, 'italic') },
    { scope: ['markup.inline.raw', 'markup.raw', 'markup.fenced_code'], settings: t(p.property) },
    { scope: ['markup.underline.link', 'string.other.link', 'constant.other.reference.link.markdown'], settings: t(p.info) },
    { scope: ['markup.list.punctuation', 'punctuation.definition.list.begin.markdown'], settings: t(p.coral) },
    { scope: ['markup.inserted'], settings: t(p.green) },
    { scope: ['markup.deleted'], settings: t(p.error) },
    { scope: ['markup.changed'], settings: t(p.warn) },
    // Diagnostics
    { scope: ['invalid', 'invalid.illegal'], settings: t(p.error) },
    { scope: ['invalid.deprecated'], settings: t(p.warn) },
  ];

  return {
    $schema: 'vscode://schemas/color-theme',
    name,
    type: 'dark',
    semanticHighlighting: true,
    semanticTokenColors,
    colors: workbench(p),
    tokenColors,
  };
}

function workbench(p) {
  const a = alpha;
  return {
    // Base
    foreground: p.fg,
    focusBorder: p.func,
    'widget.shadow': '#00000066',
    'selection.background': p.bgSel,
    'icon.foreground': p.fgMuted,
    'sash.hoverBorder': p.func,
    'errorForeground': p.error,
    'descriptionForeground': p.fgMuted,
    'disabledForeground': p.fgFaint,

    // Text / links
    'textLink.foreground': p.info,
    'textLink.activeForeground': p.func,
    'textPreformat.foreground': p.property,
    'textBlockQuote.background': p.bgPanel,
    'textCodeBlock.background': p.bgPanel,

    // Buttons & badges
    'button.background': p.func,
    'button.foreground': p.bgChrome,
    'button.hoverBackground': p.property,
    'button.secondaryBackground': p.bgElev,
    'button.secondaryForeground': p.fg,
    'button.secondaryHoverBackground': p.bgHover,
    'badge.background': p.func,
    'badge.foreground': p.bgChrome,
    'activityBarBadge.background': p.func,
    'activityBarBadge.foreground': p.bgChrome,
    'progressBar.background': p.func,

    // Inputs & dropdowns
    'input.background': p.bgChrome,
    'input.foreground': p.fg,
    'input.border': p.borderSubtle,
    'input.placeholderForeground': p.fgDim,
    'inputOption.activeForeground': p.bgChrome,
    'inputOption.activeBackground': p.func,
    'inputOption.activeBorder': p.func,
    'inputValidation.infoForeground': p.fgBright,
    'inputValidation.infoBackground': p.bgElev,
    'inputValidation.infoBorder': p.info,
    'inputValidation.warningForeground': p.bgChrome,
    'inputValidation.warningBackground': p.warn,
    'inputValidation.warningBorder': p.warn,
    'inputValidation.errorForeground': p.fgBright,
    'inputValidation.errorBackground': a(p.error, 0x33),
    'inputValidation.errorBorder': p.error,
    'dropdown.background': p.bgChrome,
    'dropdown.listBackground': p.bgElev,
    'dropdown.foreground': p.fg,
    'dropdown.border': p.borderSubtle,

    // Editor
    'editor.background': p.bg,
    'editor.foreground': p.fg,
    'editorLineNumber.foreground': p.fgFaint,
    'editorLineNumber.activeForeground': p.fgMuted,
    'editorCursor.foreground': p.func,
    'editorCursor.background': p.bg,
    'editor.selectionBackground': p.bgSel,
    'editor.selectionHighlightBackground': a(p.func, 0x22),
    'editor.inactiveSelectionBackground': p.bgSelMuted,
    'editor.wordHighlightBackground': a(p.func, 0x22),
    'editor.wordHighlightStrongBackground': a(p.func, 0x33),
    'editor.findMatchBackground': a(p.constant, 0x66),
    'editor.findMatchHighlightBackground': a(p.constant, 0x33),
    'editor.findRangeHighlightBackground': a(p.bgSel, 0x66),
    'editor.hoverHighlightBackground': a(p.func, 0x22),
    'editor.lineHighlightBackground': p.bgLine,
    'editor.rangeHighlightBackground': a(p.bgSel, 0x44),
    'editorLink.activeForeground': p.info,
    'editorWhitespace.foreground': p.fgFaint,
    'editorIndentGuide.background1': p.borderSubtle,
    'editorIndentGuide.activeBackground1': p.border,
    'editorRuler.foreground': p.borderSubtle,
    'editorCodeLens.foreground': p.fgDim,
    'editorBracketMatch.background': a(p.func, 0x22),
    'editorBracketMatch.border': p.func,
    'editorBracketHighlight.foreground1': p.constant,
    'editorBracketHighlight.foreground2': p.func,
    'editorBracketHighlight.foreground3': p.coral,
    'editorBracketHighlight.foreground4': p.keyword,
    'editorBracketHighlight.foreground5': p.property,
    'editorBracketHighlight.foreground6': p.type,
    'editorBracketHighlight.unexpectedBracket.foreground': p.error,

    // Diagnostics
    'editorError.foreground': p.error,
    'editorWarning.foreground': p.warn,
    'editorInfo.foreground': p.info,
    'editorHint.foreground': p.green,
    'editorGutter.modifiedBackground': p.info,
    'editorGutter.addedBackground': p.green,
    'editorGutter.deletedBackground': p.error,

    // Overview ruler
    'editorOverviewRuler.border': p.bgChrome,
    'editorOverviewRuler.findMatchForeground': p.constant,
    'editorOverviewRuler.modifiedForeground': p.info,
    'editorOverviewRuler.addedForeground': p.green,
    'editorOverviewRuler.deletedForeground': p.error,
    'editorOverviewRuler.errorForeground': p.error,
    'editorOverviewRuler.warningForeground': p.warn,
    'editorOverviewRuler.infoForeground': p.info,

    // Gutter / minimap
    'minimapGutter.modifiedBackground': p.info,
    'minimapGutter.addedBackground': p.green,
    'minimapGutter.deletedBackground': p.error,

    // Editor groups & tabs
    'editorGroup.border': p.borderSubtle,
    'editorGroupHeader.tabsBackground': p.bgChrome,
    'editorGroupHeader.tabsBorder': p.bgChrome,
    'editorGroupHeader.noTabsBackground': p.bg,
    'tab.activeBackground': p.bg,
    'tab.activeForeground': p.fgBright,
    'tab.activeBorderTop': p.func,
    'tab.inactiveBackground': p.bgChrome,
    'tab.inactiveForeground': p.fgDim,
    'tab.hoverBackground': p.bgLine,
    'tab.border': p.bgChrome,
    'tab.unfocusedActiveForeground': p.fgMuted,
    'tab.lastPinnedBorder': p.borderSubtle,

    // Activity bar
    'activityBar.background': p.bgChrome,
    'activityBar.foreground': p.fg,
    'activityBar.inactiveForeground': p.fgDim,
    'activityBar.border': p.bgChrome,
    'activityBar.activeBorder': p.func,

    // Side bar
    'sideBar.background': p.bgPanel,
    'sideBar.foreground': p.fgMuted,
    'sideBar.border': p.bgChrome,
    'sideBarTitle.foreground': p.fg,
    'sideBarSectionHeader.background': p.bgPanel,
    'sideBarSectionHeader.foreground': p.fg,
    'sideBarSectionHeader.border': p.borderSubtle,

    // Lists & trees
    'list.activeSelectionBackground': p.bgSel,
    'list.activeSelectionForeground': p.fgBright,
    'list.inactiveSelectionBackground': p.bgSelMuted,
    'list.inactiveSelectionForeground': p.fg,
    'list.hoverBackground': p.bgHover,
    'list.hoverForeground': p.fgBright,
    'list.focusBackground': p.bgSel,
    'list.focusForeground': p.fgBright,
    'list.highlightForeground': p.func,
    'list.dropBackground': p.bgSelMuted,
    'list.errorForeground': p.error,
    'list.warningForeground': p.warn,
    'tree.indentGuidesStroke': p.borderSubtle,

    // Scrollbar
    'scrollbar.shadow': '#00000000',
    'scrollbarSlider.background': a(p.fgMuted, 0x22),
    'scrollbarSlider.hoverBackground': a(p.fgMuted, 0x44),
    'scrollbarSlider.activeBackground': a(p.fgMuted, 0x66),

    // Status bar
    'statusBar.background': p.bgChrome,
    'statusBar.foreground': p.fgMuted,
    'statusBar.border': p.bgChrome,
    'statusBar.noFolderBackground': p.bgChrome,
    'statusBar.debuggingBackground': p.warn,
    'statusBar.debuggingForeground': p.bgChrome,
    'statusBar.debuggingBorder': p.warn,
    'statusBarItem.hoverBackground': p.bgHover,
    'statusBarItem.activeBackground': p.bgSel,
    'statusBarItem.prominentBackground': p.func,
    'statusBarItem.prominentForeground': p.bgChrome,
    'statusBarItem.remoteBackground': p.func,
    'statusBarItem.remoteForeground': p.bgChrome,
    'statusBarItem.errorBackground': p.error,
    'statusBarItem.errorForeground': p.bgChrome,

    // Title bar
    'titleBar.activeBackground': p.bgChrome,
    'titleBar.activeForeground': p.fgMuted,
    'titleBar.inactiveBackground': p.bgChrome,
    'titleBar.inactiveForeground': p.fgDim,
    'titleBar.border': p.bgChrome,

    // Menus & command center
    'menubar.selectionForeground': p.fgBright,
    'menubar.selectionBackground': p.bgHover,
    'menu.foreground': p.fgMuted,
    'menu.background': p.bgElev,
    'menu.selectionForeground': p.fgBright,
    'menu.selectionBackground': p.bgSel,
    'menu.separatorBackground': p.borderSubtle,
    'menu.border': p.borderSubtle,
    'commandCenter.foreground': p.fgMuted,
    'commandCenter.activeForeground': p.fgBright,
    'commandCenter.background': p.bgChrome,
    'commandCenter.activeBackground': p.bgHover,
    'commandCenter.border': p.borderSubtle,
    'commandCenter.inactiveForeground': p.fgDim,

    // Widgets (suggest / hover / peek)
    'editorWidget.background': p.bgElev,
    'editorWidget.foreground': p.fg,
    'editorWidget.border': p.borderSubtle,
    'editorSuggestWidget.background': p.bgElev,
    'editorSuggestWidget.border': p.borderSubtle,
    'editorSuggestWidget.foreground': p.fg,
    'editorSuggestWidget.selectedBackground': p.bgSel,
    'editorSuggestWidget.highlightForeground': p.func,
    'editorHoverWidget.background': p.bgElev,
    'editorHoverWidget.border': p.borderSubtle,
    'peekView.border': p.func,
    'peekViewEditor.background': p.bgPanel,
    'peekViewEditor.matchHighlightBackground': a(p.constant, 0x44),
    'peekViewResult.background': p.bgPanel,
    'peekViewResult.fileForeground': p.fgBright,
    'peekViewResult.lineForeground': p.fgMuted,
    'peekViewResult.matchHighlightBackground': a(p.constant, 0x44),
    'peekViewResult.selectionBackground': p.bgSel,
    'peekViewResult.selectionForeground': p.fgBright,
    'peekViewTitle.background': p.bgElev,
    'peekViewTitleDescription.foreground': p.fgDim,
    'peekViewTitleLabel.foreground': p.fgBright,

    // Panel & terminal
    'panel.background': p.bg,
    'panel.border': p.borderSubtle,
    'panelTitle.activeBorder': p.func,
    'panelTitle.activeForeground': p.fgBright,
    'panelTitle.inactiveForeground': p.fgDim,
    'terminal.background': p.bg,
    'terminal.foreground': p.fg,
    'terminal.selectionBackground': p.bgSel,
    'terminalCursor.foreground': p.func,
    'terminalCursor.background': p.bg,
    ...ansiColors(p),

    // Breadcrumbs
    'breadcrumb.foreground': p.fgDim,
    'breadcrumb.background': p.bg,
    'breadcrumb.focusForeground': p.fgBright,
    'breadcrumb.activeSelectionForeground': p.func,
    'breadcrumbPicker.background': p.bgElev,

    // Notifications
    'notificationCenter.border': p.borderSubtle,
    'notificationCenterHeader.foreground': p.fgBright,
    'notificationCenterHeader.background': p.bgElev,
    'notifications.foreground': p.fg,
    'notifications.background': p.bgElev,
    'notifications.border': p.borderSubtle,
    'notificationLink.foreground': p.info,
    'notificationsErrorIcon.foreground': p.error,
    'notificationsWarningIcon.foreground': p.warn,
    'notificationsInfoIcon.foreground': p.info,

    // Git decorations
    'gitDecoration.addedResourceForeground': p.green,
    'gitDecoration.modifiedResourceForeground': p.info,
    'gitDecoration.deletedResourceForeground': p.error,
    'gitDecoration.untrackedResourceForeground': p.green,
    'gitDecoration.ignoredResourceForeground': p.fgFaint,
    'gitDecoration.conflictingResourceForeground': p.warn,
    'gitDecoration.submoduleResourceForeground': p.fgMuted,

    // Diff & merge
    'diffEditor.insertedTextBackground': a(p.green, 0x22),
    'diffEditor.removedTextBackground': a(p.error, 0x22),
    'diffEditor.insertedLineBackground': a(p.green, 0x18),
    'diffEditor.removedLineBackground': a(p.error, 0x18),
    'merge.currentHeaderBackground': a(p.info, 0x66),
    'merge.currentContentBackground': a(p.info, 0x33),
    'merge.incomingHeaderBackground': a(p.green, 0x66),
    'merge.incomingContentBackground': a(p.green, 0x33),
    'merge.border': p.borderSubtle,

    // Sticky scroll & inline chat
    'editorStickyScroll.background': p.bgPanel,
    'editorStickyScrollHover.background': p.bgHover,
    'inlineChat.background': p.bgElev,
    'inlineChat.border': p.borderSubtle,
    'inlineChatInput.background': p.bgChrome,
    'inlineChatInput.focusBorder': p.func,

    // Debug
    'debugToolBar.background': p.bgElev,
    'debugToolBar.border': p.borderSubtle,
    'debugExceptionWidget.background': a(p.error, 0x33),
    'debugExceptionWidget.border': p.error,
    'debugIcon.breakpointForeground': p.error,

    // Misc
    'window.activeBorder': p.bgChrome,
    'window.inactiveBorder': p.bgChrome,
    'toolbar.hoverBackground': p.bgHover,
    'toolbar.activeBackground': p.bgSel,
    'keybindingLabel.background': p.bgElev,
    'keybindingLabel.foreground': p.fg,
    'keybindingLabel.border': p.borderSubtle,
    'keybindingLabel.bottomBorder': p.borderSubtle,
    'settings.headerForeground': p.fgBright,
    'settings.modifiedItemIndicator': p.func,
    'charts.foreground': p.fg,
    'charts.blue': p.info,
    'charts.green': p.green,
    'charts.yellow': p.constant,
    'charts.orange': p.warn,
    'charts.red': p.error,
    'charts.purple': p.magenta,
  };
}

function ansiColors(p) {
  const c = ansi(p, 'standard');
  return {
    'terminal.ansiBlack': c.black,
    'terminal.ansiRed': c.red,
    'terminal.ansiGreen': c.green,
    'terminal.ansiYellow': c.yellow,
    'terminal.ansiBlue': c.blue,
    'terminal.ansiMagenta': c.magenta,
    'terminal.ansiCyan': c.cyan,
    'terminal.ansiWhite': c.white,
    'terminal.ansiBrightBlack': c.brightBlack,
    'terminal.ansiBrightRed': c.brightRed,
    'terminal.ansiBrightGreen': c.brightGreen,
    'terminal.ansiBrightYellow': c.brightYellow,
    'terminal.ansiBrightBlue': c.brightBlue,
    'terminal.ansiBrightMagenta': c.brightMagenta,
    'terminal.ansiBrightCyan': c.brightCyan,
    'terminal.ansiBrightWhite': c.brightWhite,
  };
}

// ---------------------------------------------------------------------------
// Terminals
// ---------------------------------------------------------------------------

export function ghostty(p) {
  const c = ansi(p, 'standard');
  const order = [c.black, c.red, c.green, c.yellow, c.blue, c.magenta, c.cyan, c.white, c.brightBlack, c.brightRed, c.brightGreen, c.brightYellow, c.brightBlue, c.brightMagenta, c.brightCyan, c.brightWhite];
  const lines = [
    '# The Flying Dutchman — Ghostty',
    '# Generated from scripts/palette.mjs · do not edit by hand',
    '',
  ];
  order.forEach((hex, i) => lines.push(`palette = ${i}=${hex}`));
  lines.push('', `background = ${p.bg}`, `foreground = ${p.fg}`, `cursor-color = ${p.func}`, `cursor-text = ${p.bg}`, `selection-background = ${p.bgSel}`, `selection-foreground = ${p.fgBright}`, '');
  return lines.join('\n');
}

export function warp(name, p) {
  const c = ansi(p, 'standard');
  return `# The Flying Dutchman — Warp
# Generated from scripts/palette.mjs · do not edit by hand
name: '${name}'
accent: '${p.func}'
cursor: '${p.func}'
background: '${p.bg}'
foreground: '${p.fg}'
details: darker
terminal_colors:
  normal:
    black: '${c.black}'
    red: '${c.red}'
    green: '${c.green}'
    yellow: '${c.yellow}'
    blue: '${c.blue}'
    magenta: '${c.magenta}'
    cyan: '${c.cyan}'
    white: '${c.white}'
  bright:
    black: '${c.brightBlack}'
    red: '${c.brightRed}'
    green: '${c.brightGreen}'
    yellow: '${c.brightYellow}'
    blue: '${c.brightBlue}'
    magenta: '${c.brightMagenta}'
    cyan: '${c.brightCyan}'
    white: '${c.brightWhite}'
`;
}

export function windowsTerminal(name, p) {
  const c = ansi(p, 'standard');
  const up = (h) => h.toUpperCase();
  return {
    name,
    background: up(p.bg),
    foreground: up(p.fg),
    cursorColor: up(p.func),
    selectionBackground: up(p.bgSel),
    black: up(c.black),
    red: up(c.red),
    green: up(c.green),
    yellow: up(c.yellow),
    blue: up(c.blue),
    purple: up(c.magenta),
    cyan: up(c.cyan),
    white: up(c.white),
    brightBlack: up(c.brightBlack),
    brightRed: up(c.brightRed),
    brightGreen: up(c.brightGreen),
    brightYellow: up(c.brightYellow),
    brightBlue: up(c.brightBlue),
    brightPurple: up(c.brightMagenta),
    brightCyan: up(c.brightCyan),
    brightWhite: up(c.brightWhite),
  };
}

// ---------------------------------------------------------------------------
// iTerm2 (.itermcolors plist — sRGB components)
// ---------------------------------------------------------------------------

function itermColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return `	<dict>
		<key>Color Space</key>
		<string>sRGB</string>
		<key>Alpha Component</key>
		<real>1</real>
		<key>Red Component</key>
		<real>${r}</real>
		<key>Green Component</key>
		<real>${g}</real>
		<key>Blue Component</key>
		<real>${b}</real>
	</dict>`;
}

export function iterm(p) {
  const c = ansi(p, 'standard');
  const ansiRow = [c.black, c.red, c.green, c.yellow, c.blue, c.magenta, c.cyan, c.white, c.brightBlack, c.brightRed, c.brightGreen, c.brightYellow, c.brightBlue, c.brightMagenta, c.brightCyan, c.brightWhite];
  const entries = {};
  ansiRow.forEach((hex, i) => (entries[`Ansi ${i} Color`] = hex));
  entries['Background Color'] = p.bg;
  entries['Foreground Color'] = p.fg;
  entries['Bold Color'] = p.fgBright;
  entries['Cursor Color'] = p.func;
  entries['Cursor Text Color'] = p.bg;
  entries['Selection Color'] = p.bgSel;
  entries['Selected Text Color'] = p.fgBright;
  entries['Link Color'] = p.info;
  entries['Cursor Guide Color'] = p.bgLine;
  entries['Badge Color'] = p.coral;
  const body = Object.entries(entries)
    .map(([k, hex]) => `	<key>${k}</key>\n${itermColor(hex)}`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
${body}
</dict>
</plist>
`;
}

// ---------------------------------------------------------------------------
// Vim / Neovim
// ---------------------------------------------------------------------------

export function vim(p) {
  const c = ansi(p, 'standard');
  const term = [c.black, c.red, c.green, c.yellow, c.blue, c.magenta, c.cyan, c.white, c.brightBlack, c.brightRed, c.brightGreen, c.brightYellow, c.brightBlue, c.brightMagenta, c.brightCyan, c.brightWhite];
  const H = (group, fg, bg, gui) => {
    const parts = [`highlight ${group}`];
    parts.push(`guifg=${fg || 'NONE'}`);
    parts.push(`guibg=${bg || 'NONE'}`);
    parts.push(`gui=${gui || 'NONE'}`);
    return parts.join(' ');
  };
  const L = [
    '" The Flying Dutchman — Vim / Neovim',
    '" Generated from scripts/palette.mjs · do not edit by hand',
    '" Maintainer: Andrew Wilkinson (https://github.com/ADWilkinson)',
    '',
    'set background=dark',
    'highlight clear',
    'if exists("syntax_on")',
    '  syntax reset',
    'endif',
    'let g:colors_name = "flying-dutchman"',
    '',
    '" Terminal palette',
    ...term.map((hex, i) => `let g:terminal_color_${i} = "${hex}"`),
    '',
    '" Editor UI',
    H('Normal', p.fg, p.bg),
    H('NormalFloat', p.fg, p.bgElev),
    H('ColorColumn', null, p.bgLine),
    H('Cursor', p.bg, p.func),
    H('CursorLine', null, p.bgLine),
    H('CursorLineNr', p.func, p.bgLine, 'bold'),
    H('LineNr', p.fgFaint, null),
    H('NonText', p.fgFaint, null),
    H('SpecialKey', p.fgFaint, null),
    H('VertSplit', p.borderSubtle, null),
    H('WinSeparator', p.borderSubtle, null),
    H('Visual', null, p.bgSel),
    H('Search', p.bg, p.constant),
    H('IncSearch', p.bg, p.warn),
    H('MatchParen', p.func, p.bgHover, 'bold'),
    H('Pmenu', p.fg, p.bgElev),
    H('PmenuSel', p.bgChrome, p.func),
    H('PmenuSbar', null, p.bgElev),
    H('PmenuThumb', null, p.fgMuted),
    H('StatusLine', p.fg, p.bgChrome),
    H('StatusLineNC', p.fgDim, p.bgChrome),
    H('TabLine', p.fgDim, p.bgChrome),
    H('TabLineFill', null, p.bgChrome),
    H('TabLineSel', p.fgBright, p.bg),
    H('Title', p.func, null, 'bold'),
    H('Folded', p.fgDim, p.bgPanel),
    H('SignColumn', p.fgFaint, null),
    H('ErrorMsg', p.error, null, 'bold'),
    H('WarningMsg', p.warn, null),
    H('Directory', p.func, null),
    '',
    '" Syntax',
    H('Comment', p.fgDim, null, 'italic'),
    H('Constant', p.constant, null),
    H('String', p.string, null),
    H('Character', p.string, null),
    H('Number', p.constant, null),
    H('Boolean', p.constant, null),
    H('Float', p.constant, null),
    H('Identifier', p.fg, null),
    H('Function', p.func, null),
    H('Statement', p.keyword, null),
    H('Conditional', p.keyword, null),
    H('Repeat', p.keyword, null),
    H('Label', p.keyword, null),
    H('Operator', p.fgMuted, null),
    H('Keyword', p.keyword, null),
    H('Exception', p.keyword, null),
    H('PreProc', p.keyword, null),
    H('Include', p.keyword, null),
    H('Define', p.keyword, null),
    H('Macro', p.func, null),
    H('Type', p.type, null),
    H('StorageClass', p.keyword, null),
    H('Structure', p.type, null),
    H('Typedef', p.type, null),
    H('Special', p.property, null),
    H('SpecialChar', p.constant, null),
    H('Tag', p.coral, null),
    H('Delimiter', p.fgMuted, null),
    H('Underlined', p.info, null, 'underline'),
    H('Error', p.error, null),
    H('Todo', p.constant, p.bgLine, 'bold'),
    '',
    '" Diagnostics (LSP)',
    H('DiagnosticError', p.error, null),
    H('DiagnosticWarn', p.warn, null),
    H('DiagnosticInfo', p.info, null),
    H('DiagnosticHint', p.green, null),
    '',
    '" Diff & Git',
    H('DiffAdd', p.green, p.bgLine),
    H('DiffChange', p.warn, p.bgLine),
    H('DiffDelete', p.error, p.bgLine),
    H('DiffText', p.info, p.bgHover),
    H('diffAdded', p.green, null),
    H('diffRemoved', p.error, null),
    '',
    '" this / self',
    H('Boolean', p.constant, null),
    H('markdownH1', p.func, null, 'bold'),
    H('markdownH2', p.func, null, 'bold'),
    H('markdownCode', p.property, null),
    H('markdownUrl', p.info, null, 'underline'),
    H('markdownBold', p.constant, null, 'bold'),
    H('markdownItalic', p.keyword, null, 'italic'),
    '',
  ];
  return L.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// Sublime Text (.tmTheme plist)
// ---------------------------------------------------------------------------

function sublimeRule(name, scope, fg, fontStyle) {
  const settings = [`			<key>foreground</key>\n			<string>${fg}</string>`];
  if (fontStyle) settings.push(`			<key>fontStyle</key>\n			<string>${fontStyle}</string>`);
  return `		<dict>
			<key>name</key>
			<string>${name}</string>
			<key>scope</key>
			<string>${scope}</string>
			<key>settings</key>
			<dict>
${settings.join('\n')}
			</dict>
		</dict>`;
}

export function sublime(name, p) {
  const rules = [
    sublimeRule('Comment', 'comment, punctuation.definition.comment', p.fgDim, 'italic'),
    sublimeRule('String', 'string, string.quoted', p.string),
    sublimeRule('Escape', 'constant.character.escape, string.regexp', p.constant),
    sublimeRule('Number & Constant', 'constant.numeric, constant.language, constant, support.constant', p.constant),
    sublimeRule('Keyword', 'keyword, keyword.control, storage.type, storage.modifier', p.keyword),
    sublimeRule('Operator', 'keyword.operator, punctuation.accessor, punctuation.separator', p.fgMuted),
    sublimeRule('Function', 'entity.name.function, support.function, meta.function-call', p.func),
    sublimeRule('Type & Class', 'entity.name.type, entity.name.class, support.type, support.class, entity.other.inherited-class', p.type),
    sublimeRule('Variable', 'variable, variable.other, meta.definition.variable', p.fg),
    sublimeRule('This', 'variable.language', p.coral, 'italic'),
    sublimeRule('Property', 'support.type.property-name, meta.object-literal.key, variable.other.property', p.property),
    sublimeRule('Tag', 'entity.name.tag', p.coral),
    sublimeRule('Attribute', 'entity.other.attribute-name', p.constant),
    sublimeRule('CSS Selector', 'entity.name.tag.css, meta.selector', p.keyword),
    sublimeRule('CSS Property', 'support.type.property-name.css', p.property),
    sublimeRule('JSON Key', 'support.type.property-name.json', p.property),
    sublimeRule('Heading', 'markup.heading, entity.name.section', p.func, 'bold'),
    sublimeRule('Bold', 'markup.bold', p.constant, 'bold'),
    sublimeRule('Italic', 'markup.italic', p.keyword, 'italic'),
    sublimeRule('Quote', 'markup.quote', p.fgDim, 'italic'),
    sublimeRule('Code', 'markup.inline.raw, markup.raw', p.property),
    sublimeRule('Link', 'markup.underline.link, string.other.link', p.info),
    sublimeRule('Inserted', 'markup.inserted', p.green),
    sublimeRule('Deleted', 'markup.deleted', p.error),
    sublimeRule('Invalid', 'invalid, invalid.illegal', p.error),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>name</key>
	<string>${name}</string>
	<key>settings</key>
	<array>
		<dict>
			<key>settings</key>
			<dict>
				<key>background</key>
				<string>${p.bg}</string>
				<key>foreground</key>
				<string>${p.fg}</string>
				<key>caret</key>
				<string>${p.func}</string>
				<key>invisibles</key>
				<string>${p.fgFaint}</string>
				<key>lineHighlight</key>
				<string>${p.bgLine}</string>
				<key>selection</key>
				<string>${p.bgSel}</string>
				<key>selectionForeground</key>
				<string>${p.fgBright}</string>
				<key>findHighlight</key>
				<string>${p.constant}</string>
				<key>findHighlightForeground</key>
				<string>${p.bg}</string>
				<key>gutter</key>
				<string>${p.bg}</string>
				<key>gutterForeground</key>
				<string>${p.fgFaint}</string>
				<key>activeGuide</key>
				<string>${p.border}</string>
			</dict>
		</dict>
${rules.join('\n')}
	</array>
</dict>
</plist>
`;
}
