import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {LEVELS,SCENES,LINES,SAVE_KEY} from './c6-data.mjs';
import {fresh,restore,snapshot,tick,blocked,collide,currentGoal,goalNear,distance} from './c6-sim.mjs';
import {C6_VOICES} from './c6-voices.mjs';
import {C6_SCORE} from './c6-score.mjs';
function step(s,input={},seconds=1){const all=[];for(let i=0;i<seconds*40;i++)all.push(...tick(s,input,.025));return all;}
function interact(s){assert.ok(goalNear(s));return step(s,{interact:true},1.3);}
test('all objectives have a traversable route from their level spawn',()=>{
 for(const id of Object.keys(LEVELS)){const s=fresh(id),queue=[[s.player.x,s.player.z]],seen=new Set([queue[0].join(',')]);
  for(let i=0;i<queue.length;i++){const [x,z]=queue[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=z+dz,key=a+','+b;if(seen.has(key)||collide(s,a,b,.4))continue;seen.add(key);queue.push([a,b]);}}
  for(const goal of LEVELS[id].goals)assert.ok(queue.some(([x,z])=>Math.hypot(x-goal.x,z-goal.z)<2.1),id+': '+goal.label);
 }
});
test('Ward support and both Lexington rescues survive checkpoint restoration',()=>{
 for(const id of ['release','lexington']){let s=fresh(id);const stages=LEVELS[id].goals.length;
  for(let i=0;i<stages;i++){const goal=currentGoal(s);s.player.x=goal.x;s.player.z=goal.z;interact(s);if(!s.finished){const loaded=restore(snapshot(s));assert.equal(loaded.stage,s.stage);assert.equal(loaded.carrying,s.carrying);s=loaded;}}
  assert.equal(s.finished,true);assert.equal(step(s,{interact:true},3).length,0);
 }
});
test('a warning requires proximity; alarm can be escaped without combat',()=>{
 const s=fresh('night');step(s,{interact:true},3);assert.equal(s.stage,0);s.player.x=-7;s.player.z=-39;
 step(s,{},14);assert.ok(s.spotted);s.player.x=-21;s.player.z=-54;step(s,{crouch:true},5);assert.ok(s.alert<.1);assert.equal(s.armed,false);
});
test('crouching behind the stone wall blocks fire while standing allows it',()=>{
 assert.equal(blocked('concord',{x:0,z:-10,y:1.4},{x:0,z:5,y:1.02}),true);
 assert.equal(blocked('concord',{x:0,z:-10,y:1.4},{x:0,z:5,y:1.7}),false);
});
test('one loaded round, deliberate reload, and solid-cover occlusion',()=>{
 const s=fresh('concord');s.armed=true;s.stage=2;s.player.x=0;s.player.z=6;
 s.enemies=[{id:0,x:0,z:-15,hp:1,yaw:0,route:[0,-15],cooldown:99,dead:0,fired:0}];
 s.player.pitch=Math.atan2(1.15-1.7,21);step(s,{fire:true,aim:true},.025);assert.equal(s.enemies[0].hp,0);assert.equal(s.loaded,false);
 const count=s.events.filter(e=>e.type==='shot').length;step(s,{fire:true},1);assert.equal(s.loaded,false);assert.equal(count,1);
 step(s,{reload:true},4.3);assert.equal(s.loaded,true);assert.equal(s.ammo,17);
 const c=fresh('concord');c.armed=true;c.stage=2;c.player.x=-19;c.player.z=12;c.enemies=[{id:0,x:-19,z:-7,hp:1,yaw:0,route:[-19,-7],cooldown:99,dead:0,fired:0}];c.player.pitch=Math.atan2(1.15-1.7,19);step(c,{fire:true,aim:true},.025);assert.equal(c.enemies[0].hp,1);
});
test('abandoning the wagon cannot silently complete the defense',()=>{
 const s=fresh('concord','story');s.player.x=2;s.player.z=9;interact(s);const before=s.defense;s.player.x=22;s.player.z=25;step(s,{crouch:true},80);assert.equal(s.defense,before);assert.ok(s.stage===1);assert.ok(!s.finished);
});
test('a complete defense can be won by shooting, reloading and using cover',()=>{
 const s=fresh('concord','story');s.player.x=2;s.player.z=9;interact(s);s.player.x=0;s.player.z=6;
 for(let i=0;i<5000&&s.stage===1&&!s.failed;i++){
  const target=s.enemies.filter(e=>e.hp>0).sort((a,b)=>distance(a,s.player)-distance(b,s.player))[0];
  if(target){const d=distance(target,s.player);s.player.yaw=Math.atan2(-(target.x-s.player.x),-(target.z-s.player.z));s.player.pitch=Math.atan2(1.15-1.7,d);}
  tick(s,{fire:s.loaded&&!!target,aim:true,reload:!s.loaded,crouch:!s.loaded},.025);
 }
 assert.equal(s.failed,false);assert.equal(s.stage,2);assert.equal(s.wave,3);assert.ok(s.wagonHealth>0);assert.ok(s.enemies.filter(e=>e.hp===0).length>=6);
 s.player.x=18;s.player.z=23;interact(s);assert.equal(s.finished,true);
});
test('malformed saves are rejected and the save namespace is separate',()=>{
 assert.notEqual(SAVE_KEY,'dc-us-history-chapter5-v1');assert.equal(restore(null),null);
 for(const raw of [{...snapshot(fresh('night')),stage:99},{...snapshot(fresh('release')),enemies:[{}]},{...snapshot(fresh('release')),player:{x:Infinity}}])assert.equal(restore(raw),null);
 const restored=restore(snapshot(fresh('night')));assert.equal(restored.level,'night');assert.equal(restored.player.health,100);
});
test('every scene transition leads to a valid scene, level, or ending',()=>{
 for(const s of Object.values(SCENES)){assert.ok(SCENES[s.after]||LEVELS[s.after]||s.after==='complete');for(const id of s.lines)assert.ok(LINES.find(l=>l.id===id));}
 assert.equal(SCENES.release.after,'release');assert.equal(SCENES.gate.after,'nightIntro');assert.equal(SCENES.ending.after,'complete');
});
test('every line and score has a packaged, nonempty media asset',()=>{
 assert.equal(C6_VOICES.length,LINES.length);assert.equal(new Set(C6_VOICES.map(v=>v.id)).size,LINES.length);
 for(const l of LINES){const v=C6_VOICES.find(v=>v.id===l.id);assert.equal(v.text,l.text);assert.equal(v.speaker,l.speaker);assert.ok(v.duration>.5);assert.ok(fs.statSync(new URL(v.file,import.meta.url)).size>4000);}
 assert.equal(Object.keys(C6_SCORE).length,4);for(const s of Object.values(C6_SCORE)){assert.ok(s.loopEnd>s.loopStart+10);assert.ok(s.peak<1);assert.ok(s.rms>.1);assert.equal(fs.statSync(new URL(s.file,import.meta.url)).size,s.bytes);}
});
