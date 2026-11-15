import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {GAME_VERSION} from './c13-games-data.mjs';
import {VERSION} from './c13-data.mjs';

test('the browser dependency graph cannot mix cached Chapter 13 banks or state engines from older releases',async()=>{
 assert.equal(VERSION,GAME_VERSION);
 const visited=new Set();
 async function visit(file){
  if(visited.has(file))return;visited.add(file);
  const source=await readFile(new URL(file,import.meta.url),'utf8');
  for(const match of source.matchAll(/(?:from\s*|import\s*)['"](\.\/c13-[^'"]+\.mjs(?:\?[^'"]*)?)['"]/g)){
   const spec=match[1],url=new URL(spec,import.meta.url);
   assert.equal(url.searchParams.get('v'),GAME_VERSION,`${file} imports stale or unversioned ${spec}`);
   await visit(spec.split('?')[0]);
  }
 }
 await visit('./c13-games.mjs');await visit('./c13-review.mjs');
 assert(visited.has('./c13-state.mjs'));assert(visited.has('./c13-data.mjs'));assert(visited.has('./c13-record.mjs'));
});

test('the public game and review entry pages load the same release as their module graph',async()=>{
 for(const file of ['chapter13.html','c13-review.html']){
  const html=await readFile(new URL(file,import.meta.url),'utf8');
  const assets=[...html.matchAll(/(?:src|href)="(c13-[^"]+\.(?:mjs|css)\?[^"]+)"/g)].map(m=>new URL(m[1],import.meta.url));
  assert.equal(assets.length,2,file);
  for(const asset of assets)assert.equal(asset.searchParams.get('v'),GAME_VERSION,file+' has a stale entry asset');
 }
});
