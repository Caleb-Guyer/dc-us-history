import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const file=name=>readFile(new URL(name,import.meta.url),'utf8');

test('the course entry opens three real independent review sections while the midterm keeps its own activities',async()=>{
 const [home,midterm,controller]=await Promise.all(['index.html','midterm.html','midterm.mjs'].map(file));
 for(const route of ['test911.html','c10-review.html','midterm.html']){assert.ok(home.includes(`href="${route}"`));assert.match(await file(route),/<main\b/);}
 const scriptVersion=home.match(/history\.mjs\?v=([\d.]+)/)?.[1],styleVersion=home.match(/history\.css\?v=([\d.]+)/)?.[1];
 assert.match(scriptVersion,/^\d+\.\d+\.\d+$/);assert.equal(styleVersion,scriptVersion);
 assert.ok(home.indexOf('href="test911.html"')<home.indexOf('href="c10-review.html"'));
 assert.match(home,/40<\/strong> multiple-choice questions/);
 assert.match(home,/base of 20 points/);
 assert.doesNotMatch(home,/src="midterm\.mjs/);
 assert.match(midterm,/src="midterm\.mjs(?:\?[^"\s]*)?"/);
 assert.doesNotMatch(controller,/c10-launch|chapter10\.html|test911\.html/);
});

test('midterm return routes preserve quiet-preview settings and the existing save namespaces',async()=>{
 const previousLocation=globalThis.location,previousStorage=globalThis.localStorage;
 const records=new Map();globalThis.localStorage={getItem:key=>records.get(key)||null,setItem:(key,value)=>records.set(key,value)};
 try{
  globalThis.location={search:'?muted=1&preview=1'};
  const preview=await import('./midterm-store.mjs?section-test=preview');
  assert.equal(preview.KEY,'dc-midterm-preview-v1');
  assert.equal(preview.homeLink(),'midterm.html?muted=1&preview=1');
  assert.equal(preview.gameLink(7),'chapter7.html?muted=1&preview=1');
  preview.write(preview.read());assert.ok(records.has('dc-midterm-preview-v1'));
  globalThis.location={search:''};
  const normal=await import('./midterm-store.mjs?section-test=normal');
  assert.equal(normal.KEY,'dc-midterm-v1');
  assert.equal(normal.homeLink(),'midterm.html');
  normal.write(normal.read());assert.ok(records.has('dc-midterm-v1'));
  assert.equal(records.size,2);
 }finally{globalThis.location=previousLocation;globalThis.localStorage=previousStorage;}
});

test('course section navigation carries explicit preview switches without forwarding unrelated page state',async()=>{
 const previousLocation=globalThis.location,previousDocument=globalThis.document;
 const routes=['index.html','test911.html','c10-review.html','midterm.html','chapter10.html'];
 const links=routes.map(path=>({href:path,getAttribute:()=>path}));
 const note={hidden:true},body={dataset:{}};
 globalThis.location={search:'?muted=1&preview=1&chapter=8&view=quiz'};
 globalThis.document={querySelectorAll:()=>links,querySelector:()=>note,body};
 try{
  await import('./history.mjs?section-test=navigation');
  assert.deepEqual(links.map(a=>a.href),routes.map(path=>`${path}?muted=1&preview=1`));
  assert.equal(note.hidden,false);
  assert.equal(body.dataset.version,(await file('index.html')).match(/history\.mjs\?v=([\d.]+)/)?.[1]);
 }finally{globalThis.location=previousLocation;globalThis.document=previousDocument;}
});
