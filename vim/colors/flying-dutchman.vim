" The Flying Dutchman - Vim Color Scheme
" A dark nautical theme inspired by Davy Jones and ghost ships
" Maintainer: Your Name

set background=dark
highlight clear

if exists("syntax_on")
  syntax reset
endif

let g:colors_name = "flying-dutchman"

" Define colors
let s:bg = "#0B1119"
let s:bg_dark = "#101820"
let s:bg_highlight = "#182028"
let s:bg_selection = "#2B4C6F"
let s:fg = "#B0C4DE"
let s:fg_idle = "#94A3B8"
let s:fg_dark = "#546E7A"
let s:blue = "#5DADE2"
let s:blue_dark = "#2B4C6F"
let s:cyan = "#4DC1B5"
let s:green = "#45B097"
let s:yellow = "#E4B968"
let s:orange = "#E4B968"
let s:red = "#E85D5D"
let s:magenta = "#5C7C8A"
let s:purple = "#7AA3C1"
let s:none = "NONE"

" Terminal colors
let g:terminal_color_0 = "#0B1119"
let g:terminal_color_1 = "#E85D5D"
let g:terminal_color_2 = "#45B097"
let g:terminal_color_3 = "#E4B968"
let g:terminal_color_4 = "#5DADE2"
let g:terminal_color_5 = "#5C7C8A"
let g:terminal_color_6 = "#4DC1B5"
let g:terminal_color_7 = "#B0C4DE"
let g:terminal_color_8 = "#546E7A"
let g:terminal_color_9 = "#FF7575"
let g:terminal_color_10 = "#68D391"
let g:terminal_color_11 = "#F0D074"
let g:terminal_color_12 = "#90CDF4"
let g:terminal_color_13 = "#6B8A96"
let g:terminal_color_14 = "#81E6D9"
let g:terminal_color_15 = "#FFFFFF"

" Helper function
function! s:h(group, style)
  execute "highlight" a:group
    \ "guifg=" (has_key(a:style, "fg") ? a:style.fg : "NONE")
    \ "guibg=" (has_key(a:style, "bg") ? a:style.bg : "NONE")
    \ "gui=" (has_key(a:style, "gui") ? a:style.gui : "NONE")
endfunction

" Editor colors
call s:h("Normal", {"fg": s:fg, "bg": s:bg})
call s:h("ColorColumn", {"bg": s:bg_highlight})
call s:h("Cursor", {"fg": s:bg, "bg": s:blue})
call s:h("CursorColumn", {"bg": s:bg_highlight})
call s:h("CursorLine", {"bg": s:bg_highlight})
call s:h("CursorLineNr", {"fg": s:blue, "bg": s:bg_highlight})
call s:h("LineNr", {"fg": s:fg_dark})
call s:h("NonText", {"fg": s:fg_dark})
call s:h("SpecialKey", {"fg": s:fg_dark})
call s:h("VertSplit", {"fg": s:bg_dark, "bg": s:bg_dark})
call s:h("Visual", {"bg": s:bg_selection})
call s:h("VisualNOS", {"bg": s:bg_selection})
call s:h("Search", {"fg": s:bg, "bg": s:yellow})
call s:h("IncSearch", {"fg": s:bg, "bg": s:yellow})
call s:h("MatchParen", {"fg": s:yellow, "gui": "bold"})
call s:h("Question", {"fg": s:yellow})
call s:h("ModeMsg", {"fg": s:yellow, "gui": "bold"})
call s:h("MoreMsg", {"fg": s:yellow, "gui": "bold"})
call s:h("ErrorMsg", {"fg": s:bg, "bg": s:red, "gui": "bold"})
call s:h("WarningMsg", {"fg": s:yellow})
call s:h("Title", {"fg": s:blue, "gui": "bold"})
call s:h("Conceal", {"fg": s:blue})
call s:h("Folded", {"fg": s:fg_dark})
call s:h("FoldColumn", {"fg": s:fg_dark})
call s:h("SignColumn", {"fg": s:fg_dark})
call s:h("StatusLine", {"fg": s:fg, "bg": s:bg_dark})
call s:h("StatusLineNC", {"fg": s:fg_dark, "bg": s:bg_dark})
call s:h("TabLine", {"fg": s:fg_dark, "bg": s:bg_dark})
call s:h("TabLineFill", {"bg": s:bg_dark})
call s:h("TabLineSel", {"fg": s:fg, "bg": s:bg})
call s:h("WildMenu", {"fg": s:bg, "bg": s:blue})
call s:h("Pmenu", {"fg": s:fg, "bg": s:bg_dark})
call s:h("PmenuSel", {"fg": s:bg, "bg": s:blue})
call s:h("PmenuSbar", {"bg": s:bg_dark})
call s:h("PmenuThumb", {"bg": s:fg_dark})
call s:h("DiffAdd", {"fg": s:green})
call s:h("DiffChange", {"fg": s:yellow})
call s:h("DiffDelete", {"fg": s:red})
call s:h("DiffText", {"fg": s:blue})
call s:h("SpellBad", {"fg": s:red, "gui": "underline"})
call s:h("SpellCap", {"fg": s:yellow, "gui": "underline"})
call s:h("SpellLocal", {"fg": s:yellow, "gui": "underline"})
call s:h("SpellRare", {"fg": s:yellow, "gui": "underline"})

" Syntax colors
call s:h("Comment", {"fg": s:fg_dark, "gui": "italic"})
call s:h("Constant", {"fg": s:yellow})
call s:h("String", {"fg": s:green})
call s:h("Character", {"fg": s:green})
call s:h("Number", {"fg": s:yellow})
call s:h("Boolean", {"fg": s:yellow})
call s:h("Float", {"fg": s:yellow})
call s:h("Identifier", {"fg": s:fg})
call s:h("Function", {"fg": s:blue})
call s:h("Statement", {"fg": s:purple})
call s:h("Conditional", {"fg": s:purple})
call s:h("Repeat", {"fg": s:purple})
call s:h("Label", {"fg": s:purple})
call s:h("Operator", {"fg": s:fg_idle})
call s:h("Keyword", {"fg": s:purple})
call s:h("Exception", {"fg": s:purple})
call s:h("PreProc", {"fg": s:purple})
call s:h("Include", {"fg": s:purple})
call s:h("Define", {"fg": s:purple})
call s:h("Macro", {"fg": s:purple})
call s:h("PreCondit", {"fg": s:purple})
call s:h("Type", {"fg": s:yellow})
call s:h("StorageClass", {"fg": s:purple})
call s:h("Structure", {"fg": s:yellow})
call s:h("Typedef", {"fg": s:yellow})
call s:h("Special", {"fg": s:cyan})
call s:h("SpecialChar", {"fg": s:cyan})
call s:h("Tag", {"fg": s:red})
call s:h("Delimiter", {"fg": s:fg_idle})
call s:h("SpecialComment", {"fg": s:fg_dark, "gui": "italic"})
call s:h("Debug", {"fg": s:red})
call s:h("Underlined", {"fg": s:blue, "gui": "underline"})
call s:h("Error", {"fg": s:red})
call s:h("Todo", {"fg": s:yellow, "gui": "bold"})

" Language specific
" HTML
call s:h("htmlTag", {"fg": s:fg_idle})
call s:h("htmlEndTag", {"fg": s:fg_idle})
call s:h("htmlTagName", {"fg": s:red})
call s:h("htmlArg", {"fg": s:yellow})
call s:h("htmlSpecialChar", {"fg": s:yellow})

" CSS
call s:h("cssProp", {"fg": s:cyan})
call s:h("cssUIAttr", {"fg": s:yellow})
call s:h("cssFunctionName", {"fg": s:blue})
call s:h("cssColor", {"fg": s:yellow})
call s:h("cssPseudoClassId", {"fg": s:yellow})
call s:h("cssClassName", {"fg": s:yellow})
call s:h("cssValueLength", {"fg": s:yellow})
call s:h("cssCommonAttr", {"fg": s:yellow})
call s:h("cssBraces", {"fg": s:fg_idle})

" JavaScript
call s:h("javaScriptFunction", {"fg": s:purple})
call s:h("javaScriptConditional", {"fg": s:purple})
call s:h("javaScriptRepeat", {"fg": s:purple})
call s:h("javaScriptNumber", {"fg": s:yellow})
call s:h("javaScriptMember", {"fg": s:cyan})

" Python
call s:h("pythonOperator", {"fg": s:purple})
call s:h("pythonRepeat", {"fg": s:purple})
call s:h("pythonInclude", {"fg": s:purple})
call s:h("pythonStatement", {"fg": s:purple})

" Ruby
call s:h("rubyControl", {"fg": s:purple})
call s:h("rubyInclude", {"fg": s:purple})
call s:h("rubyConstant", {"fg": s:yellow})
call s:h("rubyFunction", {"fg": s:blue})

" Markdown
call s:h("markdownCode", {"fg": s:cyan})
call s:h("markdownCodeBlock", {"fg": s:cyan})
call s:h("markdownHeadingDelimiter", {"fg": s:blue, "gui": "bold"})
call s:h("markdownItalic", {"fg": s:purple, "gui": "italic"})
call s:h("markdownBold", {"fg": s:yellow, "gui": "bold"})
call s:h("markdownUrl", {"fg": s:green})

" Git
call s:h("gitcommitOverflow", {"fg": s:red})
call s:h("gitcommitSummary", {"fg": s:green})
call s:h("gitcommitComment", {"fg": s:fg_dark})
call s:h("gitcommitUntracked", {"fg": s:fg_dark})
call s:h("gitcommitDiscarded", {"fg": s:fg_dark})
call s:h("gitcommitSelected", {"fg": s:fg_dark})
call s:h("gitcommitHeader", {"fg": s:purple})
call s:h("gitcommitSelectedType", {"fg": s:blue})
call s:h("gitcommitUnmergedType", {"fg": s:blue})
call s:h("gitcommitDiscardedType", {"fg": s:blue})
call s:h("gitcommitBranch", {"fg": s:yellow, "gui": "bold"})
call s:h("gitcommitUntrackedFile", {"fg": s:yellow})
call s:h("gitcommitUnmergedFile", {"fg": s:red, "gui": "bold"})
call s:h("gitcommitDiscardedFile", {"fg": s:red, "gui": "bold"})
call s:h("gitcommitSelectedFile", {"fg": s:green, "gui": "bold"})