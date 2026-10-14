const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/app.js','utf8');const fn=source.slice(source.indexOf('function drawIntakeGauge('),source.indexOf('// Daily Energy view is UI-only.'));
function run(total,food,exercise){const elements=[];const root={querySelector:()=>null,prepend(){}};const document={createElementNS:(ns,tag)=>{const el={tag,attrs:{},children:[],classList:{add(){}},setAttribute(k,v){this.attrs[k]=v},append(e){this.children.push(e)},replaceChildren(){this.children=[]}};if(tag==='svg')elements.push(el);return el}};vm.runInNewContext(fn+`;drawIntakeGauge(root,${total},${food},${exercise},true)`,{document,root});return elements[0].children}
const colors=['#e96b78','#ef9b43','#3299bc'];
function check(total,food,exercise,expected){const shapes=run(total,food,exercise).filter(x=>colors.includes(x.attrs.stroke));assert.deepEqual(shapes.map(x=>x.attrs.stroke),expected.map(x=>x[0]));const degs=expected.map(x=>x[1]/total*360);let start=0;for(let i=0;i<shapes.length;i++){const el=shapes[i];assert.equal(el.attrs['stroke-width'],'29');if(el.tag==='circle'){assert.equal(expected.length,1);continue}assert.equal(el.attrs['stroke-linecap'],'butt');const rad=(start-90)*Math.PI/180;const x=110+91*Math.cos(rad),y=110+91*Math.sin(rad);const m=el.attrs.d.match(/^M ([^ ]+) ([^ ]+) /);assert.ok(m);assert.ok(Math.abs(Number(m[1])-x)<1e-8&&Math.abs(Number(m[2])-y)<1e-8);start+=degs[i]}}
check(2789,3880,336,[['#e96b78',1091],['#ef9b43',336],['#3299bc',1362]]);
check(2789,1880,336,[['#3299bc',1544],['#ef9b43',336]]);
check(2789,1880,0,[['#3299bc',1880]]);
check(2789,2789,0,[['#3299bc',2789]]);
check(2789,2789,336,[['#3299bc',2453],['#ef9b43',336]]);
check(2789,3880,0,[['#e96b78',1091],['#3299bc',1698]]);
assert.equal(run(2789,0,336).filter(x=>colors.includes(x.attrs.stroke)).length,0);
console.log('Unified energy axis: 7 scenarios passed');
