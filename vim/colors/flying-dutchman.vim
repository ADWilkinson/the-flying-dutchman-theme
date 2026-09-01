" The Flying Dutchman — Vim / Neovim
" Generated from scripts/palette.mjs · do not edit by hand
" Maintainer: Andrew Wilkinson (https://github.com/ADWilkinson)

set background=dark
highlight clear
if exists("syntax_on")
  syntax reset
endif
let g:colors_name = "flying-dutchman"

" Terminal palette
let g:terminal_color_0 = "#0c1117"
let g:terminal_color_1 = "#e56661"
let g:terminal_color_2 = "#65bd9c"
let g:terminal_color_3 = "#e0c471"
let g:terminal_color_4 = "#6eb5d8"
let g:terminal_color_5 = "#c68baa"
let g:terminal_color_6 = "#5cc4cc"
let g:terminal_color_7 = "#bfcbd9"
let g:terminal_color_8 = "#8a98a8"
let g:terminal_color_9 = "#ec908d"
let g:terminal_color_10 = "#84d2b4"
let g:terminal_color_11 = "#e5d49e"
let g:terminal_color_12 = "#99c9e1"
let g:terminal_color_13 = "#d7adc3"
let g:terminal_color_14 = "#86cfd5"
let g:terminal_color_15 = "#e4ebf1"

" Editor UI
highlight Normal guifg=#bfcbd9 guibg=#131920 gui=NONE
highlight NormalFloat guifg=#bfcbd9 guibg=#192029 gui=NONE
highlight ColorColumn guifg=NONE guibg=#171e26 gui=NONE
highlight Cursor guifg=#131920 guibg=#5cc4cc gui=NONE
highlight CursorLine guifg=NONE guibg=#171e26 gui=NONE
highlight CursorColumn guifg=NONE guibg=#171e26 gui=NONE
highlight CursorLineNr guifg=#5cc4cc guibg=#171e26 gui=bold
highlight LineNr guifg=#2a323c guibg=NONE gui=NONE
highlight NonText guifg=#2a323c guibg=NONE gui=NONE
highlight SpecialKey guifg=#2a323c guibg=NONE gui=NONE
highlight VertSplit guifg=#212831 guibg=NONE gui=NONE
highlight WinSeparator guifg=#212831 guibg=NONE gui=NONE
highlight Visual guifg=NONE guibg=#2c4459 gui=NONE
highlight Search guifg=#131920 guibg=#e0c471 gui=NONE
highlight IncSearch guifg=#131920 guibg=#e3ac54 gui=NONE
highlight MatchParen guifg=#5cc4cc guibg=#202832 gui=bold
highlight Pmenu guifg=#bfcbd9 guibg=#192029 gui=NONE
highlight PmenuSel guifg=#0c1117 guibg=#5cc4cc gui=NONE
highlight PmenuSbar guifg=NONE guibg=#192029 gui=NONE
highlight PmenuThumb guifg=NONE guibg=#8a98a8 gui=NONE
highlight WildMenu guifg=#0c1117 guibg=#5cc4cc gui=NONE
highlight StatusLine guifg=#bfcbd9 guibg=#0c1117 gui=NONE
highlight StatusLineNC guifg=#6a7b8a guibg=#0c1117 gui=NONE
highlight StatusLineTerm guifg=#bfcbd9 guibg=#0c1117 gui=NONE
highlight StatusLineTermNC guifg=#6a7b8a guibg=#0c1117 gui=NONE
highlight TabLine guifg=#6a7b8a guibg=#0c1117 gui=NONE
highlight TabLineFill guifg=NONE guibg=#0c1117 gui=NONE
highlight TabLineSel guifg=#e4ebf1 guibg=#131920 gui=NONE
highlight Title guifg=#5cc4cc guibg=NONE gui=bold
highlight Folded guifg=#6a7b8a guibg=#0e131a gui=NONE
highlight FoldColumn guifg=#2a323c guibg=NONE gui=NONE
highlight SignColumn guifg=#2a323c guibg=NONE gui=NONE
highlight Conceal guifg=#6a7b8a guibg=NONE gui=NONE
highlight ErrorMsg guifg=#e56661 guibg=NONE gui=bold
highlight WarningMsg guifg=#e3ac54 guibg=NONE gui=NONE
highlight MoreMsg guifg=#5fc491 guibg=NONE gui=NONE
highlight Question guifg=#6eb5d8 guibg=NONE gui=NONE
highlight Directory guifg=#5cc4cc guibg=NONE gui=NONE

" GUI toolbar (gvim only — Vim draws it from its own defaults otherwise)
highlight ToolbarLine guifg=NONE guibg=#0c1117 gui=NONE
highlight ToolbarButton guifg=#bfcbd9 guibg=#192029 gui=bold

" Syntax
highlight Comment guifg=#6a7b8a guibg=NONE gui=italic
highlight Constant guifg=#e0c471 guibg=NONE gui=NONE
highlight String guifg=#65bd9c guibg=NONE gui=NONE
highlight Character guifg=#65bd9c guibg=NONE gui=NONE
highlight Number guifg=#e0c471 guibg=NONE gui=NONE
highlight Boolean guifg=#e0c471 guibg=NONE gui=NONE
highlight Float guifg=#e0c471 guibg=NONE gui=NONE
highlight Identifier guifg=#bfcbd9 guibg=NONE gui=NONE
highlight Function guifg=#5cc4cc guibg=NONE gui=NONE
highlight Statement guifg=#75acd1 guibg=NONE gui=NONE
highlight Conditional guifg=#75acd1 guibg=NONE gui=NONE
highlight Repeat guifg=#75acd1 guibg=NONE gui=NONE
highlight Label guifg=#75acd1 guibg=NONE gui=NONE
highlight Operator guifg=#8a98a8 guibg=NONE gui=NONE
highlight Keyword guifg=#75acd1 guibg=NONE gui=NONE
highlight Exception guifg=#75acd1 guibg=NONE gui=NONE
highlight PreProc guifg=#75acd1 guibg=NONE gui=NONE
highlight Include guifg=#75acd1 guibg=NONE gui=NONE
highlight Define guifg=#75acd1 guibg=NONE gui=NONE
highlight Macro guifg=#5cc4cc guibg=NONE gui=NONE
highlight Type guifg=#d3ac64 guibg=NONE gui=NONE
highlight StorageClass guifg=#75acd1 guibg=NONE gui=NONE
highlight Structure guifg=#d3ac64 guibg=NONE gui=NONE
highlight Typedef guifg=#d3ac64 guibg=NONE gui=NONE
highlight Special guifg=#8bc0d0 guibg=NONE gui=NONE
highlight SpecialChar guifg=#e0c471 guibg=NONE gui=NONE
highlight Tag guifg=#e09585 guibg=NONE gui=NONE
highlight Delimiter guifg=#8a98a8 guibg=NONE gui=NONE
highlight Underlined guifg=#6eb5d8 guibg=NONE gui=underline
highlight Error guifg=#e56661 guibg=NONE gui=NONE
highlight Todo guifg=#e0c471 guibg=#171e26 gui=bold

" Diagnostics (LSP)
highlight DiagnosticError guifg=#e56661 guibg=NONE gui=NONE
highlight DiagnosticWarn guifg=#e3ac54 guibg=NONE gui=NONE
highlight DiagnosticInfo guifg=#6eb5d8 guibg=NONE gui=NONE
highlight DiagnosticHint guifg=#5fc491 guibg=NONE gui=NONE

" Spelling — undercurl only, so the word keeps its syntax colour
highlight SpellBad guifg=NONE guibg=NONE gui=undercurl guisp=#e56661
highlight SpellCap guifg=NONE guibg=NONE gui=undercurl guisp=#e3ac54
highlight SpellRare guifg=NONE guibg=NONE gui=undercurl guisp=#e09585
highlight SpellLocal guifg=NONE guibg=NONE gui=undercurl guisp=#6eb5d8

" Diff & Git
highlight DiffAdd guifg=#5fc491 guibg=#171e26 gui=NONE
highlight DiffChange guifg=#e3ac54 guibg=#171e26 gui=NONE
highlight DiffDelete guifg=#e56661 guibg=#171e26 gui=NONE
highlight DiffText guifg=#6eb5d8 guibg=#202832 gui=NONE
highlight diffAdded guifg=#5fc491 guibg=NONE gui=NONE
highlight diffRemoved guifg=#e56661 guibg=NONE gui=NONE

" this / self (Neovim only — Vim rejects `@` in a group name)
if has('nvim')
  highlight @variable.builtin guifg=#e09585 guibg=NONE gui=italic
endif

" Markdown
highlight markdownH1 guifg=#5cc4cc guibg=NONE gui=bold
highlight markdownH2 guifg=#5cc4cc guibg=NONE gui=bold
highlight markdownCode guifg=#8bc0d0 guibg=NONE gui=NONE
highlight markdownUrl guifg=#6eb5d8 guibg=NONE gui=underline
highlight markdownBold guifg=#e0c471 guibg=NONE gui=bold
highlight markdownItalic guifg=#75acd1 guibg=NONE gui=italic

