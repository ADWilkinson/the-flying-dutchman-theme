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
    'strongForeground': p.fgBright,

    // Text / links
    'textLink.foreground': p.info,
    'textLink.activeForeground': p.func,
    'textPreformat.foreground': p.property,
    'textPreformat.background': p.bgPanel,
    'textBlockQuote.background': p.bgPanel,
    // Markdown quotes read as fgDim in the token colours; keep the bar the same.
    'textBlockQuote.border': p.fgDim,
    'textCodeBlock.background': p.bgPanel,
    'textSeparator.foreground': p.borderSubtle,

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
    'activityErrorBadge.background': p.error,
    'activityErrorBadge.foreground': p.bgChrome,
    'activityWarningBadge.background': p.warn,
    'activityWarningBadge.foreground': p.bgChrome,
    'progressBar.background': p.func,

    // Inputs & dropdowns
    'input.background': p.bgChrome,
    'input.foreground': p.fg,
    'input.border': p.borderSubtle,
    'input.placeholderForeground': p.fgDim,
    'inputOption.hoverBackground': p.bgHover,
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
    'editorActiveLineNumber.foreground': p.fgMuted,
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
    // Same colour as the highlight itself: the line reads as one band, not a box.
    'editor.lineHighlightBorder': p.bgLine,
    'editor.rangeHighlightBackground': a(p.bgSel, 0x44),
    'editor.snippetTabstopHighlightBackground': a(p.bgSel, 0x66),
    'editor.snippetFinalTabstopHighlightBorder': p.func,
    'editor.compositionBorder': p.func,
    'editorLink.activeForeground': p.info,
    'editorWhitespace.foreground': p.fgFaint,
    'editorIndentGuide.background1': p.borderSubtle,
    'editorIndentGuide.activeBackground1': p.border,
    'editorRuler.foreground': p.borderSubtle,
    'editorCodeLens.foreground': p.fgDim,
    'editorInlayHint.foreground': p.fgDim,
    'editor.foldPlaceholderForeground': p.fgDim,
    'editorLightBulb.foreground': p.constant,
    'editorLightBulbAutoFix.foreground': p.func,
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
    'editorOverviewRuler.selectionHighlightForeground': a(p.func, 0x66),
    'editorOverviewRuler.modifiedForeground': p.info,
    'editorOverviewRuler.addedForeground': p.green,
    'editorOverviewRuler.deletedForeground': p.error,
    'editorOverviewRuler.errorForeground': p.error,
    'editorOverviewRuler.warningForeground': p.warn,
    'editorOverviewRuler.infoForeground': p.info,
    'editorOverviewRuler.bracketMatchForeground': p.fgDim,
    'editorOverviewRuler.wordHighlightForeground': a(p.func, 0xcc),
    'editorOverviewRuler.wordHighlightStrongForeground': a(p.property, 0xcc),

    // Gutter / minimap
    'minimap.errorHighlight': a(p.error, 0xb3),
    'minimapGutter.modifiedBackground': p.info,
    'minimapGutter.addedBackground': p.green,
    'minimapGutter.deletedBackground': p.error,

    // Symbol icons (outline, breadcrumbs, suggest widget). Read from the same
    // roles as the syntax tokens so a glyph always matches the code it stands for.
    'symbolIcon.classForeground': p.type,
    'symbolIcon.interfaceForeground': p.type,
    'symbolIcon.enumeratorForeground': p.type,
    'symbolIcon.eventForeground': p.type,
    'symbolIcon.enumeratorMemberForeground': p.constant,
    'symbolIcon.functionForeground': p.func,
    'symbolIcon.methodForeground': p.func,
    'symbolIcon.constructorForeground': p.func,
    'symbolIcon.fieldForeground': p.property,
    'symbolIcon.variableForeground': p.fg,

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
    'tab.activeModifiedBorder': p.info,

    // Activity bar
    'activityBar.background': p.bgChrome,
    'activityBar.foreground': p.fg,
    'activityBar.inactiveForeground': p.fgDim,
    'activityBar.border': p.bgChrome,
    'activityBar.activeBorder': p.func,
    'activityBarTop.foreground': p.fg,
    'profileBadge.background': p.bgHover,

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
    'list.deemphasizedForeground': p.fgDim,
    'list.invalidItemForeground': p.warn,
    'listFilterWidget.noMatchesOutline': p.error,
    'tree.indentGuidesStroke': p.borderSubtle,
    'tree.tableColumnsBorder': p.borderSubtle,

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
    'statusBarItem.offlineBackground': p.error,

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

    // Quick pick (command palette, Go to File). pickerGroup.* is the one place a
    // stock VS Code blue would otherwise land in the middle of the palette.
    'quickInputTitle.background': p.bgPanel,
    'pickerGroup.foreground': p.func,
    'pickerGroup.border': p.borderSubtle,

    // Widgets (suggest / hover / peek)
    'editorWidget.background': p.bgElev,
    'editorWidget.foreground': p.fg,
    'editorWidget.border': p.borderSubtle,
    'simpleFindWidget.sashBorder': p.borderSubtle,
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
    'terminal.initialHintForeground': p.fgDim,
    'terminalStickyScrollHover.background': p.bgHover,
    'terminalCommandDecoration.defaultBackground': a(p.fgMuted, 0x40),
    'terminalCommandDecoration.successBackground': p.green,
    'terminalCommandDecoration.errorBackground': p.error,
    'terminalOverviewRuler.cursorForeground': a(p.func, 0xcc),
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
    'diffEditor.diagonalFill': p.borderSubtle,
    'diffEditor.unchangedCodeBackground': a(p.fgFaint, 0x33),
    'merge.currentHeaderBackground': a(p.info, 0x66),
    'merge.currentContentBackground': a(p.info, 0x33),
    'merge.incomingHeaderBackground': a(p.green, 0x66),
    'merge.incomingContentBackground': a(p.green, 0x33),
    'merge.border': p.borderSubtle,
    'diffEditor.move.border': a(p.fgMuted, 0x9c),
    'diffEditor.moveActive.border': p.warn,
    'diffEditor.unchangedRegionShadow': p.bgChrome,
    'multiDiffEditor.headerBackground': p.bgPanel,

    // Three-way merge editor. Its stock defaults are a lime/amber/red set that
    // belongs to no part of this palette; base reads as a removal, ours as an
    // addition, and an unresolved conflict borrows the warning lamp.
    'mergeEditor.change.background': a(p.green, 0x22),
    'mergeEditor.change.word.background': a(p.green, 0x33),
    'mergeEditor.changeBase.background': a(p.error, 0x22),
    'mergeEditor.changeBase.word.background': a(p.error, 0x33),
    'mergeEditor.conflictingLines.background': a(p.constant, 0x33),
    'mergeEditor.conflict.unhandledFocused.border': p.warn,
    'mergeEditor.conflict.unhandledUnfocused.border': a(p.warn, 0x7a),
    'mergeEditor.conflict.handledFocused.border': a(p.fgMuted, 0xcc),
    'mergeEditor.conflict.handledUnfocused.border': a(p.fgDim, 0x49),
    'mergeEditor.conflict.unhandled.minimapOverViewRuler': p.warn,
    'mergeEditor.conflict.handled.minimapOverViewRuler': a(p.fgDim, 0xee),

    // Sticky scroll & inline chat
    'editorStickyScroll.background': p.bgPanel,
    'editorStickyScrollHover.background': p.bgHover,
    'inlineChat.background': p.bgElev,
    'inlineChat.border': p.borderSubtle,
    'inlineChatInput.background': p.bgChrome,
    'inlineChatInput.focusBorder': p.func,

    // Debug. The Variables / Watch / Call Stack views are the largest stock-colour
    // leak in the workbench: without these, token names draw in Dark+ purple and
    // the whole toolbar in Dark+ blue.
    'debugToolBar.background': p.bgElev,
    'debugToolBar.border': p.borderSubtle,
    'debugExceptionWidget.background': a(p.error, 0x33),
    'debugExceptionWidget.border': p.error,
    'debugIcon.breakpointForeground': p.error,
    'debugIcon.breakpointDisabledForeground': p.fgDim,
    'debugIcon.breakpointUnverifiedForeground': p.fgDim,
    'debugIcon.breakpointCurrentStackframeForeground': p.constant,
    'debugIcon.breakpointStackframeForeground': p.green,
    'debugIcon.startForeground': p.green,
    'debugIcon.restartForeground': p.green,
    'debugIcon.pauseForeground': p.info,
    'debugIcon.continueForeground': p.info,
    'debugIcon.stepOverForeground': p.info,
    'debugIcon.stepIntoForeground': p.info,
    'debugIcon.stepOutForeground': p.info,
    'debugIcon.stepBackForeground': p.info,
    'debugIcon.stopForeground': p.error,
    'debugIcon.disconnectForeground': p.error,
    // Debug token expressions mirror the syntax roles, so a value in the
    // Variables view is the same colour as the same value in the editor.
    'debugTokenExpression.name': p.property,
    'debugTokenExpression.type': p.type,
    'debugTokenExpression.value': a(p.fg, 0x99),
    'debugTokenExpression.string': p.string,
    'debugTokenExpression.number': p.constant,
    'debugTokenExpression.boolean': p.constant,
    'debugTokenExpression.error': p.error,
    'debugView.exceptionLabelBackground': a(p.error, 0x33),
    'debugView.stateLabelBackground': a(p.fgMuted, 0x44),
    'debugView.valueChangedHighlight': p.func,
    'editor.stackFrameHighlightBackground': a(p.constant, 0x33),
    'editor.focusedStackFrameHighlightBackground': a(p.green, 0x33),
    'editor.inlineValuesForeground': p.fgDim,
    'editor.inlineValuesBackground': a(p.constant, 0x22),

    // Testing
    'testing.iconPassed': p.green,
    'testing.iconUnset': p.fgDim,
    'testing.iconSkipped': p.fgDim,

    // Source control graph. Five branch lanes have to stay distinguishable, so
    // this is the one place variety is the point — but every lane is a palette
    // accent, never a stock magenta or brown.
    'scmGraph.foreground1': p.type,
    'scmGraph.foreground2': p.coral,
    'scmGraph.foreground3': p.keyword,
    'scmGraph.foreground4': p.func,
    'scmGraph.foreground5': p.magenta,
    'scmGraph.historyItemBaseRefColor': p.constant,
    'scmGraph.historyItemHoverAdditionsForeground': p.green,
    'scmGraph.historyItemHoverDeletionsForeground': p.error,

    // Chat, agent sessions & voice
    'chat.avatarBackground': p.bgElev,
    'chat.slashCommandBackground': a(p.bgSel, 0x66),
    'chat.slashCommandForeground': p.info,
    'chat.editedFileForeground': p.info,
    'chat.requestCodeBorder': a(p.border, 0xb8),
    'chat.checkpointSeparator': p.borderSubtle,
    'chat.linesAddedForeground': p.green,
    'chat.linesRemovedForeground': p.error,
    'chat.thinkingShimmer': p.fgBright,
    'agentsVoice.speakingForeground': p.func,
    'agentsVoice.speakingBackground': a(p.func, 0x14),
    'agentsMobileDiff.addedForeground': p.green,
    'agentsMobileDiff.modifiedForeground': p.info,
    'agentsMobileDiff.deletedForeground': p.error,

    // Extension & MCP gallery icons
    'extensionIcon.starForeground': p.constant,
    'extensionIcon.preReleaseForeground': p.string,
    'extensionIcon.sponsorForeground': p.coral,
    'extensionIcon.privateForeground': p.fgMuted,
    'mcpIcon.starForeground': p.constant,

    // Welcome page & walkthroughs
    'welcomePage.tileBorder': p.borderSubtle,
    'walkthrough.stepTitle.foreground': p.fgBright,

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
    'chart.line': p.info,
    'chart.axis': a(p.fgMuted, 0x66),
    'chart.guide': a(p.fgMuted, 0x33),
  };
}

function ansiColors(p) {
  const c = ansi(p);
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
  const c = ansi(p);
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
  const c = ansi(p);
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
  const c = ansi(p);
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
// plist emitters (.itermcolors, .tmTheme)
// ---------------------------------------------------------------------------

// Both plist formats are real XML, parsed by real XML parsers. Any text we
// interpolate is a text node, so the three markup characters have to be
// entities or the file will not parse at all. Rule names like "Number &
// Constant" shipped a bare `&` and broke the whole .tmTheme.
function xml(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
  const c = ansi(p);
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
    .map(([k, hex]) => `	<key>${xml(k)}</key>\n${itermColor(hex)}`)
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
  const c = ansi(p);
  const term = [c.black, c.red, c.green, c.yellow, c.blue, c.magenta, c.cyan, c.white, c.brightBlack, c.brightRed, c.brightGreen, c.brightYellow, c.brightBlue, c.brightMagenta, c.brightCyan, c.brightWhite];
  // `sp` is the undercurl/underline colour. Only the spell groups use it, and
  // omitting the attribute entirely keeps every other line byte-identical.
  const H = (group, fg, bg, gui, sp) => {
    const parts = [`highlight ${group}`];
    parts.push(`guifg=${fg || 'NONE'}`);
    parts.push(`guibg=${bg || 'NONE'}`);
    parts.push(`gui=${gui || 'NONE'}`);
    if (sp) parts.push(`guisp=${sp}`);
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
    // The two editors read the terminal palette from different variables and
    // neither falls back to the other. `g:terminal_color_0..15` is Neovim's;
    // Vim's `:terminal` reads the `g:terminal_ansi_colors` list at term_start
    // and, with it unset, renders its own built-in row of saturated primaries
    // (#e00000, #00e000, #ff40ff ...) straight through a palette whose whole
    // rule is that nothing shouts. Both are set so either editor gets the row.
    '" Terminal palette — g:terminal_color_* is Neovim, the list below is Vim',
    ...term.map((hex, i) => `let g:terminal_color_${i} = "${hex}"`),
    `let g:terminal_ansi_colors = [${term.map((hex) => `"${hex}"`).join(', ')}]`,
    '',
    '" Editor UI',
    H('Normal', p.fg, p.bg),
    H('NormalFloat', p.fg, p.bgElev),
    H('ColorColumn', null, p.bgLine),
    H('Cursor', p.bg, p.func),
    H('CursorLine', null, p.bgLine),
    H('CursorColumn', null, p.bgLine),
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
    H('WildMenu', p.bgChrome, p.func),
    H('StatusLine', p.fg, p.bgChrome),
    H('StatusLineNC', p.fgDim, p.bgChrome),
    H('StatusLineTerm', p.fg, p.bgChrome),
    H('StatusLineTermNC', p.fgDim, p.bgChrome),
    H('TabLine', p.fgDim, p.bgChrome),
    H('TabLineFill', null, p.bgChrome),
    H('TabLineSel', p.fgBright, p.bg),
    H('Title', p.func, null, 'bold'),
    H('Folded', p.fgDim, p.bgPanel),
    H('FoldColumn', p.fgFaint, null),
    H('SignColumn', p.fgFaint, null),
    H('Conceal', p.fgDim, null),
    H('ErrorMsg', p.error, null, 'bold'),
    H('WarningMsg', p.warn, null),
    H('MoreMsg', p.green, null),
    H('Question', p.info, null),
    H('Directory', p.func, null),
    '',
    '" GUI toolbar (gvim only — Vim draws it from its own defaults otherwise)',
    H('ToolbarLine', null, p.bgChrome),
    H('ToolbarButton', p.fg, p.bgElev, 'bold'),
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
    '" Spelling — undercurl only, so the word keeps its syntax colour',
    H('SpellBad', null, null, 'undercurl', p.error),
    H('SpellCap', null, null, 'undercurl', p.warn),
    H('SpellRare', null, null, 'undercurl', p.coral),
    H('SpellLocal', null, null, 'undercurl', p.info),
    '',
    '" Diff & Git',
    H('DiffAdd', p.green, p.bgLine),
    H('DiffChange', p.warn, p.bgLine),
    H('DiffDelete', p.error, p.bgLine),
    H('DiffText', p.info, p.bgHover),
    H('diffAdded', p.green, null),
    H('diffRemoved', p.error, null),
    '',
    // Parity with the VS Code `variable.language` rule and Sublime's `This`:
    // `this`/`self` carry the coral role. Vim has no builtin group for it, so
    // this is the Neovim treesitter name — and Vim does not accept it: group
    // names are `[A-Za-z0-9_]` only, so a bare `@variable.builtin` raises
    // `W18: Invalid character in group name` on every `:colorscheme`. Guarding
    // it keeps the role in Neovim and keeps Vim silent; Vim has no portable
    // group for this/self, so there it stays the plain `Identifier` colour.
    '" this / self (Neovim only — Vim rejects `@` in a group name)',
    "if has('nvim')",
    '  ' + H('@variable.builtin', p.coral, null, 'italic'),
    'endif',
    '',
    '" Markdown',
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
			<string>${xml(name)}</string>
			<key>scope</key>
			<string>${xml(scope)}</string>
			<key>settings</key>
			<dict>
${settings.join('\n')}
			</dict>
		</dict>`;
}

// Sublime honours a fixed set of global settings; anything the scheme leaves
// unset it draws from its own built-in fallback, not from this palette. The port
// defined 11 of the 24 documented colour keys, so bracket and tag matching,
// indent guides, unfocused selections, the spell-check squiggle, the
// modified-tab accent and the minimap border all rendered in stock colours. The
// full documented list is at sublimetext.com/docs/color_schemes_tmtheme.html.
//
// Deliberately absent, and not leaks:
//   popupCss / phantomCss  — CSS blobs for minihtml, not palette roles; Sublime
//                            derives sane defaults from background/foreground
//   shadowWidth            — a width in pixels, not a colour
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
	<string>${xml(name)}</string>
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
				<key>misspelling</key>
				<string>${p.error}</string>
				<key>minimapBorder</key>
				<string>${p.border}</string>
				<key>accent</key>
				<string>${p.func}</string>
				<key>gutter</key>
				<string>${p.bg}</string>
				<key>gutterForeground</key>
				<string>${p.fgFaint}</string>
				<key>selection</key>
				<string>${p.bgSel}</string>
				<key>selectionForeground</key>
				<string>${p.fgBright}</string>
				<key>selectionBorder</key>
				<string>${p.bgSel}</string>
				<key>inactiveSelection</key>
				<string>${p.bgSelMuted}</string>
				<key>inactiveSelectionForeground</key>
				<string>${p.fg}</string>
				<key>highlight</key>
				<string>${p.constant}</string>
				<key>findHighlight</key>
				<string>${p.constant}</string>
				<key>findHighlightForeground</key>
				<string>${p.bg}</string>
				<key>guide</key>
				<string>${p.borderSubtle}</string>
				<key>activeGuide</key>
				<string>${p.border}</string>
				<key>stackGuide</key>
				<string>${p.borderSubtle}</string>
				<key>bracketsOptions</key>
				<string>underline</string>
				<key>bracketsForeground</key>
				<string>${p.func}</string>
				<key>bracketContentsOptions</key>
				<string>stippled_underline</string>
				<key>bracketContentsForeground</key>
				<string>${p.fgDim}</string>
				<key>tagsOptions</key>
				<string>stippled_underline</string>
				<key>tagsForeground</key>
				<string>${p.coral}</string>
				<key>shadow</key>
				<string>#00000000</string>
			</dict>
		</dict>
${rules.join('\n')}
	</array>
</dict>
</plist>
`;
}
