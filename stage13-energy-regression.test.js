const assert=require('node:assert/strict');const fs=require('node:fs');
const a=fs.readFileSync('app.js','utf8'),h=fs.readFileSync('index.html','utf8'),c=fs.readFileSync('styles.css','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.match(a,/VERSION='3\.8\.14'/);assert.match(h,/v3\.8 開発版⑭/);assert.match(sw,/v3814-energy-gauge/);assert.match(h,/v=3\.8\.14-energy-gauge/);
assert.match(a,/let energyView='balance'/);assert.match(h,/グラフをタップで食事目標に切り替え/);
assert.match(a,/const grossSurplus=Math\.max\(0,positiveFood-total\+positiveExercise\)/);
assert.match(a,/const start=positiveFood>total\?finalSurplus/);
assert.match(c,/energy-metric-stack\{justify-content:center/);
assert.match(h,/id="energyLegendBalance"/);
console.log('PASS: stage13 version / default / surplus overlay / compact layout');
