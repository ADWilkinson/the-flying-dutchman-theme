// Regression: a workbench colour the theme never sets does not fall back to the
// palette — it falls back to VS Code's own registry default, and 217 of those
// defaults are hard-coded literals rather than derivations of the theme. Until
// this list was set, the Command Palette drew its group labels in stock
// `#3794FF`, the Variables view drew token names in stock `#c586c0`, the
// suggest widget drew method icons in stock `#B180D7`, and the merge editor
// drew its changes in stock lime — straight through a palette whose whole rule
// is that nothing shouts.
//
// KEYS is an audit of every `registerColor()` call in microsoft/vscode at tag
// `1.135.0`: each colour whose *dark* default is a hard-coded hex rather than a
// reference to another colour. It covers the whole registry, not just
// `src/vs/platform/theme/common/colors/*.ts` — the debug, testing, merge-editor,
// SCM-graph, chat and symbol-icon registries live under `src/vs/workbench` and
// `src/vs/editor` and leak just as visibly.
//
// It is a fixture, not a live fetch, so the check stays offline and
// deterministic. To refresh it against a newer VS Code, list the files that
// register colours and read the dark default out of each call:
//
//   gh api -X GET search/code \
//     -f q='"registerColor(" repo:microsoft/vscode path:src/vs extension:ts' \
//     --jq '.items[].path'
//
// Deliberately absent, and not leaks:
//   listFilterWidget.outline      — defaults to transparent, so no colour appears
//   minimap.foregroundOpacity     — an opacity control, not a palette colour
//   editorIndentGuide.background2-6, editorBracketPairGuide.*, and the other
//                                   `#00000000` defaults — off unless a theme
//                                   opts in; nothing shows through
//   scrollbar.shadow              — set to `#00000000` on purpose: the theme
//                                   drops the shadow rather than recolouring it

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { palette, variants } from '../scripts/palette.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const THEMES = {
  standard: 'themes/flying-dutchman-color-theme.json',
  'high-contrast': 'themes/flying-dutchman-high-contrast.json',
  soft: 'themes/flying-dutchman-soft.json',
};

// key -> the VS Code dark default it would otherwise inherit (recorded so a
// failure shows what would appear, not just which key went missing).
const KEYS = {
  'activityBar.background': '#333333',
  'activityBarBadge.background': '#007acc',
  'activityBarTop.foreground': '#e7e7e7',
  'activityErrorBadge.background': '#f14c4c',
  'activityWarningBadge.background': '#b27c00',
  'agentsMobileDiff.addedForeground': '#81b88b',
  'agentsMobileDiff.deletedForeground': '#c74e39',
  'agentsMobileDiff.modifiedForeground': '#e2c08d',
  'agentsVoice.speakingBackground': '#a371f714',
  'agentsVoice.speakingForeground': '#a371f7',
  'badge.background': '#4d4d4d',
  'button.background': '#0e639c',
  'chart.line': '#236b8e',
  'charts.green': '#89d185',
  'charts.purple': '#b180d7',
  'chat.avatarBackground': '#1f1f1f',
  'chat.checkpointSeparator': '#585858',
  'chat.editedFileForeground': '#e2c08d',
  'chat.linesAddedForeground': '#54b054',
  'chat.linesRemovedForeground': '#fc6a6a',
  'chat.requestCodeBorder': '#004972b8',
  'chat.slashCommandBackground': '#26477866',
  'chat.slashCommandForeground': '#85b6ff',
  'chat.thinkingShimmer': '#ffffff',
  'debugExceptionWidget.background': '#420b0d',
  'debugExceptionWidget.border': '#a31515',
  'debugIcon.breakpointCurrentStackframeForeground': '#ffcc00',
  'debugIcon.breakpointDisabledForeground': '#848484',
  'debugIcon.breakpointForeground': '#e51400',
  'debugIcon.breakpointStackframeForeground': '#89d185',
  'debugIcon.breakpointUnverifiedForeground': '#848484',
  'debugIcon.continueForeground': '#75beff',
  'debugIcon.disconnectForeground': '#f48771',
  'debugIcon.pauseForeground': '#75beff',
  'debugIcon.restartForeground': '#89d185',
  'debugIcon.startForeground': '#89d185',
  'debugIcon.stepBackForeground': '#75beff',
  'debugIcon.stepIntoForeground': '#75beff',
  'debugIcon.stepOutForeground': '#75beff',
  'debugIcon.stepOverForeground': '#75beff',
  'debugIcon.stopForeground': '#f48771',
  'debugTokenExpression.boolean': '#4e94ce',
  'debugTokenExpression.error': '#f48771',
  'debugTokenExpression.name': '#c586c0',
  'debugTokenExpression.number': '#b5cea8',
  'debugTokenExpression.string': '#ce9178',
  'debugTokenExpression.type': '#4a90e2',
  'debugTokenExpression.value': '#cccccc99',
  'debugToolBar.background': '#333333',
  'debugView.exceptionLabelBackground': '#6c2022',
  'debugView.stateLabelBackground': '#88888844',
  'debugView.valueChangedHighlight': '#569cd6',
  'diffEditor.diagonalFill': '#cccccc33',
  'diffEditor.insertedTextBackground': '#9ccc2c33',
  'diffEditor.move.border': '#8b8b8b9c',
  'diffEditor.moveActive.border': '#ffa500',
  'diffEditor.removedTextBackground': '#ff000033',
  'diffEditor.unchangedCodeBackground': '#74747429',
  'diffEditor.unchangedRegionShadow': '#000000',
  'disabledForeground': '#cccccc80',
  'dropdown.background': '#3c3c3c',
  'dropdown.foreground': '#f0f0f0',
  'editor.background': '#1e1e1e',
  'editor.compositionBorder': '#ffffff',
  'editor.findMatchBackground': '#515c6a',
  'editor.findMatchHighlightBackground': '#ea5c0055',
  'editor.findRangeHighlightBackground': '#3a3d4166',
  'editor.focusedStackFrameHighlightBackground': '#7abd7a4d',
  'editor.foldPlaceholderForeground': '#808080',
  'editor.foreground': '#bbbbbb',
  'editor.hoverHighlightBackground': '#264f7840',
  'editor.inlineValuesBackground': '#ffc80033',
  'editor.inlineValuesForeground': '#ffffff80',
  'editor.lineHighlightBorder': '#282828',
  'editor.rangeHighlightBackground': '#ffffff0b',
  'editor.selectionBackground': '#264f78',
  'editor.snippetFinalTabstopHighlightBorder': '#525252',
  'editor.stackFrameHighlightBackground': '#ffff0033',
  'editor.wordHighlightBackground': '#575757b8',
  'editor.wordHighlightStrongBackground': '#004972b8',
  'editorActiveLineNumber.foreground': '#c6c6c6',
  'editorBracketHighlight.foreground1': '#ffd700',
  'editorBracketHighlight.foreground2': '#da70d6',
  'editorBracketHighlight.foreground3': '#179fff',
  'editorBracketMatch.background': '#0064001a',
  'editorBracketMatch.border': '#888',
  'editorCodeLens.foreground': '#999999',
  'editorCursor.foreground': '#aeafad',
  'editorError.foreground': '#f14c4c',
  'editorGroup.border': '#444444',
  'editorGroupHeader.tabsBackground': '#252526',
  'editorGutter.addedBackground': '#487e02',
  'editorGutter.modifiedBackground': '#1b81a8',
  'editorInfo.foreground': '#59a4f9',
  'editorInlayHint.foreground': '#969696',
  'editorLightBulb.foreground': '#ffcc00',
  'editorLightBulbAutoFix.foreground': '#75beff',
  'editorLineNumber.foreground': '#858585',
  'editorLink.activeForeground': '#4e94ce',
  'editorOverviewRuler.border': '#7f7f7f4d',
  'editorOverviewRuler.bracketMatchForeground': '#a0a0a0',
  'editorOverviewRuler.findMatchForeground': '#d186167e',
  'editorOverviewRuler.selectionHighlightForeground': '#a0a0a0cc',
  'editorOverviewRuler.wordHighlightForeground': '#a0a0a0cc',
  'editorOverviewRuler.wordHighlightStrongForeground': '#c0a0c0cc',
  'editorRuler.foreground': '#5a5a5a',
  'editorStickyScrollHover.background': '#2a2d2e',
  'editorWarning.foreground': '#cca700',
  'editorWhitespace.foreground': '#e3e4e229',
  'editorWidget.background': '#252526',
  'errorForeground': '#f48771',
  'extensionIcon.preReleaseForeground': '#1d9271',
  'extensionIcon.privateForeground': '#ffffff60',
  'extensionIcon.sponsorForeground': '#d758b3',
  'extensionIcon.starForeground': '#ff8e00',
  'focusBorder': '#007fd4',
  'foreground': '#cccccc',
  'icon.foreground': '#c5c5c5',
  'input.background': '#3c3c3c',
  'inputOption.activeBorder': '#007acc',
  'inputOption.hoverBackground': '#5a5d5e80',
  'inputValidation.errorBackground': '#5a1d1d',
  'inputValidation.errorBorder': '#be1100',
  'inputValidation.infoBackground': '#063b49',
  'inputValidation.infoBorder': '#007acc',
  'inputValidation.warningBackground': '#352a05',
  'inputValidation.warningBorder': '#b89500',
  'list.activeSelectionBackground': '#04395e',
  'list.deemphasizedForeground': '#8c8c8c',
  'list.dropBackground': '#062f4a',
  'list.errorForeground': '#f88070',
  'list.highlightForeground': '#2aaaff',
  'list.hoverBackground': '#2a2d2e',
  'list.inactiveSelectionBackground': '#37373d',
  'list.invalidItemForeground': '#b89500',
  'list.warningForeground': '#cca700',
  'listFilterWidget.noMatchesOutline': '#be1100',
  'mcpIcon.starForeground': '#ff8e00',
  'mergeEditor.change.background': '#9bb95533',
  'mergeEditor.change.word.background': '#9ccc2c33',
  'mergeEditor.changeBase.background': '#4b1818ff',
  'mergeEditor.changeBase.word.background': '#6f1313ff',
  'mergeEditor.conflict.handled.minimapOverViewRuler': '#adaca8ee',
  'mergeEditor.conflict.handledFocused.border': '#c1c1c1cc',
  'mergeEditor.conflict.handledUnfocused.border': '#86868649',
  'mergeEditor.conflict.unhandled.minimapOverViewRuler': '#fcba03ff',
  'mergeEditor.conflict.unhandledFocused.border': '#ffa600',
  'mergeEditor.conflict.unhandledUnfocused.border': '#ffa6007a',
  'mergeEditor.conflictingLines.background': '#ffea0047',
  'multiDiffEditor.headerBackground': '#262626',
  'panelTitle.activeForeground': '#e7e7e7',
  'peekViewEditor.background': '#001f33',
  'peekViewEditor.matchHighlightBackground': '#ff8f0099',
  'peekViewResult.background': '#252526',
  'peekViewResult.lineForeground': '#bbbbbb',
  'peekViewResult.matchHighlightBackground': '#ea5c004d',
  'peekViewResult.selectionBackground': '#3399ff33',
  'peekViewTitle.background': '#252526',
  'peekViewTitleDescription.foreground': '#ccccccb3',
  'pickerGroup.border': '#3f3f46',
  'pickerGroup.foreground': '#3794ff',
  'profileBadge.background': '#4d4d4d',
  'scmGraph.foreground1': '#ffb000',
  'scmGraph.foreground2': '#dc267f',
  'scmGraph.foreground3': '#994f00',
  'scmGraph.foreground4': '#40b0a6',
  'scmGraph.foreground5': '#b66dff',
  'scmGraph.historyItemBaseRefColor': '#ea5c00',
  'scmGraph.historyItemHoverAdditionsForeground': '#81b88b',
  'scmGraph.historyItemHoverDeletionsForeground': '#c74e39',
  'settings.headerForeground': '#e7e7e7',
  'sideBar.background': '#252526',
  'simpleFindWidget.sashBorder': '#454545',
  'statusBar.background': '#007acc',
  'statusBar.debuggingBackground': '#cc6633',
  'statusBar.foreground': '#ffffff',
  'statusBar.noFolderBackground': '#68217a',
  'statusBarItem.offlineBackground': '#6c1717',
  'strongForeground': '#ffffff',
  'symbolIcon.classForeground': '#ee9d28',
  'symbolIcon.constructorForeground': '#b180d7',
  'symbolIcon.enumeratorForeground': '#ee9d28',
  'symbolIcon.enumeratorMemberForeground': '#75beff',
  'symbolIcon.eventForeground': '#ee9d28',
  'symbolIcon.fieldForeground': '#75beff',
  'symbolIcon.functionForeground': '#b180d7',
  'symbolIcon.interfaceForeground': '#75beff',
  'symbolIcon.methodForeground': '#b180d7',
  'symbolIcon.variableForeground': '#75beff',
  'tab.activeModifiedBorder': '#3399cc',
  'tab.border': '#252526',
  'tab.inactiveBackground': '#2d2d2d',
  'terminal.foreground': '#cccccc',
  'terminal.initialHintForeground': '#ffffff56',
  'terminalCommandDecoration.defaultBackground': '#ffffff40',
  'terminalCommandDecoration.errorBackground': '#f14c4c',
  'terminalCommandDecoration.successBackground': '#1b81a8',
  'terminalOverviewRuler.cursorForeground': '#a0a0a0cc',
  'terminalStickyScrollHover.background': '#2a2d2e',
  'testing.iconPassed': '#73c991',
  'testing.iconSkipped': '#848484',
  'testing.iconUnset': '#848484',
  'textBlockQuote.background': '#222222',
  'textBlockQuote.border': '#007acc80',
  'textCodeBlock.background': '#0a0a0a66',
  'textLink.activeForeground': '#3794ff',
  'textLink.foreground': '#3794ff',
  'textPreformat.background': '#ffffff1a',
  'textPreformat.foreground': '#d7ba7d',
  'textSeparator.foreground': '#ffffff2e',
  'titleBar.activeBackground': '#3c3c3c',
  'titleBar.activeForeground': '#cccccc',
  'toolbar.hoverBackground': '#5a5d5e50',
  'tree.indentGuidesStroke': '#585858',
  'tree.tableColumnsBorder': '#cccccc20',
  'walkthrough.stepTitle.foreground': '#ffffff',
  'welcomePage.tileBorder': '#ffffff1a',
};

test('no workbench colour falls back to a VS Code stock default', async (t) => {
  assert.deepEqual(Object.keys(THEMES), variants, 'every variant needs checking');

  for (const [variant, rel] of Object.entries(THEMES)) {
    await t.test(rel, () => {
      const { colors } = JSON.parse(readFileSync(resolve(root, rel), 'utf8'));

      const unset = Object.keys(KEYS).filter((key) => !(key in colors));
      assert.deepEqual(unset, [], `unset, so VS Code's stock default shows through: ${unset.join(', ')}`);

      // Present is not enough: the value has to come from a palette role, or a
      // future edit could silently pin the stock literal it was meant to replace.
      // Compared on the role set rather than the literal, because high-contrast's
      // fgBright legitimately is #ffffff — the same hex as strongForeground's default.
      const roles = new Set(Object.values(palette(variant)));
      const offPalette = Object.keys(KEYS).filter((key) => !roles.has(colors[key].slice(0, 7)));
      assert.deepEqual(offPalette, [], `not a palette role: ${offPalette.join(', ')}`);

      for (const key of Object.keys(KEYS)) {
        assert.match(colors[key], /^#[0-9a-f]{6}([0-9a-f]{2})?$/, `${key} is not a lowercase hex colour`);
      }
    });
  }
});
