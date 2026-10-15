const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/app.js','utf8');
const fn=source.slice(source.indexOf('function drawIntakeGauge('),source.indexOf('// Daily Energy view is UI-only.'));
function render(total,food,exercise,recorded=true){
 const root={querySelector:()=>null,prepend(){}};
 const nodes=[];const document={createElementNS:(ns,tag)=>{const e={tag,attrs:{},children:[],classList:{add(){}},setAttribute(k,v){this.attrs[k]=String(v)},append(x){this.children.push(x)},replaceChildren(){this.children=[]}};if(tag==='svg')nodes.push(e);return e}};
 vm.runInNewContext(fn+`;drawIntakeGauge(root,${total},${food},${exercise},${recorded})`,{document,root});
 return nodes[0].children;
}
const cases=[
 [2789,3880,336,[1091,336,1362],2],
 [2789,1880,336,[1544,336],1],
 [2789,1880,0,[1880],0],
 [2789,2789,0,[2789],0],
 [2789,2789,336,[2453,336],1],
 [2789,3880,0,[1091,1698],1],
 [2789,0,336,[],0],
 [2789,200,500,[200],0],
 [2789,10000,336,[2789],0],
];
for(const [total,food,exercise,lengths,separatorCount] of cases){
 const nodes=render(total,food,exercise);
 const arcs=nodes.filter(x=>['#e96b78','#ef9b43','#3299bc'].includes(x.attrs.stroke));
 const separators=nodes.filter(x=>x.attrs['data-energy-separator']==='true');
 assert.equal(arcs.length,lengths.length,`${food}: segment count`);
 assert.equal(separators.length,separatorCount,`${food}: separators`);
 let cursor=0;
 for(let i=0;i<arcs.length;i++){
  const arc=arcs[i],span=lengths[i]/total*360;
  assert.equal(arc.attrs['stroke-width'],'29');
  if(arc.tag==='path'){
   const angle=(cursor-90)*Math.PI/180;
   const m=arc.attrs.d.match(/^M ([^ ]+) ([^ ]+) /);
   assert.ok(Math.abs(+m[1]-(110+91*Math.cos(angle)))<1e-7);
   assert.ok(Math.abs(+m[2]-(110+91*Math.sin(angle)))<1e-7);
  }
  cursor+=span;
  if(i<separators.length){
   const theta=(cursor-90)*Math.PI/180;
   const x=110+(91-29/2)*Math.cos(theta),y=110+(91-29/2)*Math.sin(theta);
   assert.ok(Math.abs(+separators[i].attrs.x1-x)<1e-7);
   assert.ok(Math.abs(+separators[i].attrs.y1-y)<1e-7);
  }
 }
}
assert.equal(render(2789,1880,336,false).filter(x=>x.attrs['data-energy-separator']==='true').length,0);
console.log('v3.8.16: 10 ring geometry/boundary scenarios passed');
