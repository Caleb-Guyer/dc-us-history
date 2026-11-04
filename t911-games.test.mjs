import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CAMPAIGNS} from './t911-games-data.mjs';
import {BY_ID} from './t911-data.mjs';
import {emptyRecord,completeMission,availableMission} from './t911-games-store.mjs';
const read=n=>fs.readFileSync(new URL(n,import.meta.url),'utf8');
test('campaign final recall is grounded in the correct chapter bank, with all sections represented',()=>{
 for(const ch of [9,11]){
  const c=CAMPAIGNS[ch],sections=new Set(c.missions.flatMap(m=>m.sections));assert.equal(new Set(c.debrief).size,6);
  for(const id of c.debrief){const q=BY_ID.get(id);assert.equal(q?.chapter,ch);sections.add(q.section);}
  assert.equal(sections.size,ch===9?4:5);
 }
});
test('all campaign routes resolve real pages and preserve the independent hub',()=>{
 for(const ch of [9,11]){const page=read(`chapter${ch}.html`);assert.match(page,new RegExp(`data-chapter="${ch}"`));assert.match(page,/t911-games\.mjs\?v=7\.2\.0/);assert.match(page,/test911\.html/);}
 const hub=read('t911.mjs');assert.match(hub,/short-campaigns/);assert.ok(hub.includes("route('chapter'+c.id+'.html')"));
 assert.match(read('midterm.mjs'),/midterm/);
});
test('each winning checkpoint unlocks only the next mission and survives JSON storage',()=>{
 for(const ch of [9,11]){let r=emptyRecord();for(let i=0;i<3;i++){assert.equal(availableMission(r,ch,i),true);if(i<2)assert.equal(availableMission(r,ch,i+1),false);r=completeMission(r,ch,CAMPAIGNS[ch].missions[i].id,{won:true,score:100+i,hits:0,seconds:30});r=JSON.parse(JSON.stringify(r));}assert.equal(r.chapters[ch].completed.length,3);assert.equal(r.chapters[ch===9?11:9].completed.length,0);}
});
test('forced-muted initial setup and preview keys remain explicit',()=>{const engine=read('t911-games.mjs');assert.match(engine,/forcedMute=params\.get\('muted'\)==='1'/);assert.match(engine,/!forcedMute&&localStorage/);assert.match(engine,/preview\?GAME_KEY\.replace/);assert.match(engine,/visibilitychange/);});

test('the campaigns use genuine retained WebGL stages and authored 3D cameras',()=>{
 const engine=read('t911-games.mjs');assert.ok(engine.includes('new CampaignWorld('));assert.ok(engine.includes('placeholder.replaceWith(worldCanvas)'));assert.ok(engine.includes('directorShot(mission()'));assert.ok(!engine.includes("getContext('2d')"));
 const renderer=read('t911-games-3d.mjs');assert.ok(renderer.includes('three.module.js'));assert.ok(renderer.includes('CampaignWorld'));
});
