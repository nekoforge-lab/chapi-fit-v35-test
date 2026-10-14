const assert=require('node:assert/strict');const fs=require('node:fs');
const a=fs.readFileSync('app.js','utf8'),h=fs.readFileSync('index.html','utf8'),c=fs.readFileSync('styles.css','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.match(a,/VERSION='3\.8\.15'/);assert.match(h,/v3\.8 開発版⑮/);assert.match(sw,/v3815-energy-axis/);assert.match(h,/v=3\.8\.15-energy-axis/);
assert.match(a,/let energyView='balance'/);assert.match(h,/グラフをタップで食事目標に切り替え/);
assert.match(a,/const excess=Math\.min\(total,Math\.max\(0,intake-total\)\)/);
assert.match(a,/const orange=Math\.min\(total-excess,work/);
assert.match(c,/energy-metric-stack\{justify-content:center/);
assert.match(h,/id="energyLegendBalance"/);
console.log('PASS: stage13 version / default / surplus overlay / compact layout');
