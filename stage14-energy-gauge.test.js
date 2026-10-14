const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/app.js','utf8');
const fn=source.slice(source.indexOf('function drawIntakeGauge('),source.indexOf('// Daily Energy view is UI-only.'));
function run(total,food,exercise){
 const elements=[];const root={querySelector:()=>null,prepend:el=>{}};
 const document={createElementNS:(ns,tag)=>{const el={tag,attrs:{},children:[],classList:{add(){}},setAttribute(k,v){this.attrs[k]=v},append(e){this.children.push(e)},replaceChildren(){this.children=[]}};if(tag==='svg')elements.push(el);return el}};
 vm.runInNewContext(fn+';drawIntakeGauge(root,'+total+','+food+','+exercise+',true)',{document,root});
 return elements[0].children;
}
let els=run(2789,3880,336);
const orange=els.filter(e=>e.attrs.stroke==='#ef9b43');const red=els.filter(e=>e.attrs.stroke==='#e96b78');
assert.equal(orange.length,1,'exercise overlay should be one contiguous segment');
assert.equal(red.length,1,'surplus must remain red');
const d=orange[0].attrs.d;const expectedStart=(1091/2789*360);const expectedEnd=(1427/2789*360);
function pt(deg){const rad=(deg-90)*Math.PI/180;return [110+94.625*Math.cos(rad),110+94.625*Math.sin(rad)]}
const [x,y]=pt(expectedStart);assert.ok(d.startsWith(`M ${x} ${y} `),'orange must start at remaining red endpoint');
const lines=els.filter(e=>e.tag==='line');assert.equal(lines.length,2);const [mx,my]=pt(expectedStart);const markerX=110+75*Math.cos((expectedStart-90)*Math.PI/180);assert.ok(Math.abs(Number(lines[0].attrs.x1)-markerX)<0.00001,'white boundary at final red surplus');
assert.equal(run(2789,2160,336).filter(e=>e.attrs.stroke==='#ef9b43').length,1);
console.log('Daily Energy gauge regression passed');
