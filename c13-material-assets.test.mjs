import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {MATERIAL_ASSETS,MATERIAL_FILES} from './c13-material-assets.mjs';

function jpegSize(bytes){
 assert.equal(bytes.readUInt16BE(0),0xffd8,'a bundled map must be a JPEG');
 let at=2;
 while(at+8<bytes.length){
  while(bytes[at]===0xff)at++;
  const marker=bytes[at++];
  if(marker===0xd9||marker===0xda)break;
  const length=bytes.readUInt16BE(at);
  if([0xc0,0xc1,0xc2].includes(marker))return [bytes.readUInt16BE(at+5),bytes.readUInt16BE(at+3)];
  assert(length>=2);at+=length;
 }
 throw new Error('JPEG dimensions were not found');
}
test('the material pack has actual color and linear detail maps for the five authored surfaces',()=>{
 assert.deepEqual(Object.keys(MATERIAL_ASSETS),['wood','brick','stone','plaster','cloth']);
 assert.equal(MATERIAL_FILES.length,14);assert.equal(new Set(MATERIAL_FILES).size,14);
 for(const [kind,asset] of Object.entries(MATERIAL_ASSETS)){
  assert.equal(asset.license,'CC0-1.0');assert.match(asset.source,/^https:\/\/polyhaven\.com\/a\//);
  assert(asset.normal&&asset.roughness);if(kind!=='cloth')assert(asset.albedo);
  assert(asset.physicalSize>0);assert(asset.normalScale>0&&asset.normalScale<=1);
 }
});
test('every bundled runtime map resolves locally and contains a complete 1K photograph or data image',async()=>{
 for(const path of MATERIAL_FILES){
  assert(!path.includes('..'));assert(!/^https?:/.test(path));
  const bytes=await readFile(new URL(path,import.meta.url));
  assert.deepEqual(jpegSize(bytes),[1024,1024],path);assert(bytes.length>100000,path);
 }
});
test('the complete local PBR pack stays within the published image budget',async()=>{
 const files=await Promise.all(MATERIAL_FILES.map(path=>readFile(new URL(path,import.meta.url))));
 assert.equal(files.reduce((total,bytes)=>total+bytes.length,0),7606921);
 assert(files.reduce((total,bytes)=>total+bytes.length,0)<8*1024*1024);
});
