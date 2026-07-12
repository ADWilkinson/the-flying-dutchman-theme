// Renders the README hero from the real Standard palette, so the image never
// drifts from the theme. Emits HTML; rasterise it to screenshots/hero.png with:
//   node scripts/hero.mjs /tmp/hero.html
//   chrome --headless=new --force-device-scale-factor=2 --window-size=960,640 \
//     --screenshot=screenshots/hero.png file:///tmp/hero.html
import { writeFileSync } from 'node:fs';
import { palette } from './palette.mjs';

const p = palette('standard');

// [text, role] segments — role names map straight onto palette entries.
const R = { punc: 'fgMuted', num: 'constant', tag: 'coral', this: 'coral' };
const sample = [
  [['// The Flying Dutchman — bound to ferry souls across the deep', 'comment']],
  [['import', 'keyword'], [' { useState, useEffect } ', 'punc'], ['from', 'keyword'], [' ', 'punc'], ["'react'", 'string']],
  [['import', 'keyword'], [' type', 'keyword'], [' { ', 'punc'], ['Soul', 'type'], [' } ', 'punc'], ['from', 'keyword'], [' ', 'punc'], ["'./crew'", 'string']],
  [],
  [['const', 'keyword'], [' ', 'punc'], ['DEPTH', 'constant'], [' = ', 'punc'], ['11_000', 'num']],
  [],
  [['export', 'keyword'], [' ', 'punc'], ['function', 'keyword'], [' ', 'punc'], ['Dutchman', 'func'], ['({ souls }: { souls: ', 'punc'], ['Soul', 'type'], ['[] }) {', 'punc']],
  [['  const', 'keyword'], [' [bound, ', 'punc'], ['setBound', 'func'], ['] = ', 'punc'], ['useState', 'func'], ['(', 'punc'], ['true', 'num'], [')', 'punc']],
  [['  const', 'keyword'], [' captain = ', 'punc'], ['this', 'this'], ['?.', 'punc'], ['name', 'property'], [' ?? ', 'punc'], ["'Davy Jones'", 'string']],
  [],
  [['  useEffect', 'func'], ['(() => {', 'punc']],
  [['    if', 'keyword'], [' (!bound) ', 'punc'], ['return', 'keyword']],
  [['    ferry', 'func'], ['(souls).', 'punc'], ['catch', 'func'], ['(console.', 'punc'], ['error', 'property'], [')', 'punc']],
  [['  }, [souls, bound])', 'punc']],
  [],
  [['  return', 'keyword'], [' souls.', 'punc'], ['map', 'func'], ['((soul) => ({', 'punc']],
  [['    name', 'property'], [': soul.', 'punc'], ['name', 'property'], [',', 'punc']],
  [['    fathoms', 'property'], [': ', 'punc'], ['DEPTH', 'constant'], [',', 'punc']],
  [['    cursed', 'property'], [': soul.years > ', 'punc'], ['100', 'num'], [',', 'punc']],
  [['  }))', 'punc']],
  [['}', 'punc']],
];

const color = (role) => p[R[role] || role] || p.fg;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const codeLines = sample
  .map((segs, i) => {
    const num = `<span class="gnum">${String(i + 1).padStart(2, ' ')}</span>`;
    const body = segs.length
      ? segs.map(([t, r]) => `<span style="color:${color(r)}">${esc(t)}</span>`).join('')
      : '&nbsp;';
    return `<div class="row">${num}<span class="gc">${body}</span></div>`;
  })
  .join('');

const html = `<!doctype html><meta charset="utf8">
<style>
  *{box-sizing:border-box}
  html,body{margin:0}
  body{width:960px;height:640px;display:flex;align-items:center;justify-content:center;
    background:radial-gradient(120% 120% at 50% 0%, #0f1720 0%, #05080c 70%);
    font-family:'SF Mono',ui-monospace,Menlo,Consolas,monospace}
  .win{width:872px;border-radius:14px;overflow:hidden;border:1px solid ${p.borderSubtle};
    box-shadow:0 30px 80px #000b, 0 2px 0 #ffffff08 inset;background:${p.bg}}
  .title{display:flex;align-items:center;gap:14px;padding:13px 18px;background:${p.bgChrome};
    border-bottom:1px solid ${p.borderSubtle}}
  .dots{display:flex;gap:8px}
  .dots i{width:12px;height:12px;border-radius:50%}
  .title .name{color:${p.fgMuted};font-size:12.5px;letter-spacing:.04em}
  .tabs{display:flex;background:${p.bgChrome};padding:0 10px;font-size:12.5px}
  .tab{padding:9px 16px;color:${p.fgDim}}
  .tab.on{color:${p.fgBright};background:${p.bg};border-top:2px solid ${p.func}}
  .code{padding:20px 22px 24px;font-size:14px;line-height:1.72;color:${p.fg}}
  .row{white-space:pre;display:flex}
  .gnum{color:${p.fgFaint};width:34px;text-align:right;padding-right:20px;user-select:none}
  .status{display:flex;gap:10px;align-items:center;padding:7px 18px;background:${p.bgChrome};
    color:${p.fgMuted};font-size:11.5px;border-top:1px solid ${p.borderSubtle}}
  .status .dot{color:${p.func}}
  .grow{flex:1}
</style>
<div class="win">
  <div class="title">
    <div class="dots"><i style="background:${p.error}"></i><i style="background:${p.constant}"></i><i style="background:${p.string}"></i></div>
    <span class="name">The Flying Dutchman — dutchman.tsx</span>
  </div>
  <div class="tabs"><div class="tab on">dutchman.tsx</div><div class="tab">crew.ts</div></div>
  <div class="code">${codeLines}</div>
  <div class="status"><span class="dot">✦</span><span>main</span><span class="grow"></span><span>TypeScript React</span><span style="color:${p.func}">The Flying Dutchman</span></div>
</div>`;

writeFileSync(process.argv[2] || 'hero.html', html);
console.log('wrote', process.argv[2] || 'hero.html');
