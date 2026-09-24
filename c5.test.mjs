import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CHAPTER5,TERMS,scriptLines,quizDeck} from './c5-data.mjs';
import {freshMission,freshBoard,tickField,tickBoard,primary,nearGoal,blocked,STATIONS,snapshot,boardSnapshot} from './c5-sim.mjs';
import {C5_VOICES} from './c5-voices.mjs';
function hold(s,duration=3){for(let i=0;i<duration*20;i++)tickField(s,{interact:true},.05);}
test('Ward follows the route without walking into a stationary player camera',()=>{
 const s=freshMission(0);s.enemies=[];s.walls=[];
 for(let i=0;i<80;i++)tickField(s,{forward:true},.05);
 const before=s.escort.z;
 for(let i=0;i<140;i++){tickField(s,{},.05);assert.ok(Math.hypot(s.player.x-s.escort.x,s.player.z-s.escort.z)>=2.99);}
 assert.ok(s.escort.z<before,'the companion catches up along the route');assert.equal(s.escort.moving,false);
});
test('all fifteen supplied terms occur on the playable path, with the punitive acts distinguished',()=>{
 assert.equal(TERMS.length,15);const unlocked=new Set();for(const m of CHAPTER5){m.goals.forEach(g=>g.terms.forEach(t=>unlocked.add(t)));(m.workshopLines||m.boatLines||[]).forEach(l=>l[2].forEach(t=>unlocked.add(t)));}
 assert.deepEqual([...unlocked].sort(),TERMS.map(t=>t.id).sort());
 assert.match(TERMS.find(t=>t.id==='intolerable').definition,/Quebec Act/);assert.match(TERMS.find(t=>t.id==='coercive').definition,/Four/);assert.match(TERMS.find(t=>t.id==='massacre').definition,/March 5, 1770/);assert.equal(CHAPTER5[3].armed,undefined);
});
test('every objective can be reached on foot without crossing scenery or leaving the level',()=>{
 for(let i=0;i<CHAPTER5.length;i++){
  const s=freshMission(i),m=s.mission;if(!m.goals.length)continue;
  const start=[Math.round(s.player.x),Math.round(s.player.z)],queue=[start],seen=new Set([start.join(',')]);
  for(let k=0;k<queue.length;k++){const [x,z]=queue[k];for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=z+dz,key=a+','+b;if(seen.has(key)||blocked(a,b,s.walls,.5,0,m.theme==='ship'?10.4:27))continue;seen.add(key);queue.push([a,b]);}}
  for(const g of m.goals)assert.ok(queue.some(([x,z])=>Math.hypot(x-g.x,z-g.z)<2),m.id+': '+g.label);
 }
});
test('field checkpoints preserve objective progress and rescued civilians, not a death state',()=>{
 const s=freshMission(3);s.enemies=[];s.player.x=s.mission.goals[0].x;s.player.z=s.mission.goals[0].z;hold(s,1.1);assert.equal(s.stage,1);assert.equal(s.carrying,true);
 const retry=freshMission(3,'normal',snapshot(s));assert.equal(retry.stage,1);assert.equal(retry.carrying,true);assert.equal(retry.player.hp,100);
 retry.player.x=0;retry.player.z=29;hold(retry,1);assert.equal(retry.stage,2);assert.equal(retry.carrying,false);
 assert.equal(primary(retry),null,'rescue scenes must not fire at the crowd');
});
test('flintlock hits, reloads, and cannot shoot through solid cover',()=>{
 const s=freshMission(0);s.enemies=[{x:0,z:10,hp:2,alert:0,cool:4,aim:0,sx:0,sz:10,phase:0}];s.player.x=0;s.player.z=25;s.player.yaw=0;s.walls=[];
 assert.equal(primary(s),'hit');assert.equal(s.enemies[0].hp,1);assert.equal(primary(s),null);
 for(let i=0;i<35;i++)tickField(s,{},.05);assert.equal(s.round,1);
 s.enemies[0].x=0;s.enemies[0].z=10;s.walls=[{x:0,z:18,w:5,d:2,h:2}];assert.equal(primary(s),'shot');assert.equal(s.enemies[0].hp,1);
});
test('interactions require proximity and holding; completed field missions cannot advance twice',()=>{
 for(const index of [0,1,3,4,6]){const s=freshMission(index,'story');s.enemies=[];hold(s,.2);assert.equal(s.stage,0);
  for(const g of s.mission.goals){s.player.x=g.x;s.player.z=g.z;assert.ok(nearGoal(s));const stage=s.stage;hold(s,g.hold+.12);assert.equal(s.stage,stage+1,s.mission.id+g.label);}
  assert.equal(s.done,true);const stage=s.stage;hold(s,2);assert.equal(s.stage,stage);
 }
});
test('a continuous workshop run wins using movement, station actions, and dash',()=>{
 const s=freshBoard(2);for(let frame=0;frame<12000&&!s.done&&!s.failed;frame++){
  const target=STATIONS[s.carrying],dx=target.x-s.player.x,dz=target.z-s.player.z,d=Math.hypot(dx,dz);
  tickBoard(s,{right:dx>8&&d>50,left:dx< -8&&d>50,back:dz>8&&d>50,forward:dz< -8&&d>50,interact:d<65,jump:d>180},.025);
 }
 assert.equal(s.done,true);assert.equal(s.delivered,4);assert.ok(s.timeLeft>0);
});
test('a quiet harbor route can deliver all relief without combat',()=>{
 const s=freshBoard(5);for(let frame=0;frame<15000&&!s.done&&!s.failed;frame++){
  const target=s.cargo?{x:450,z:540}:s.supplies.find(p=>!p.taken);const dx=target.x-s.player.x,dz=target.z-s.player.z;
  tickBoard(s,{right:dx>5,left:dx< -5,back:dz>5,forward:dz< -5,crouch:true},.025);
 }
 assert.equal(s.done,true);assert.equal(s.delivered,4);assert.ok(s.hp>0);
});
test('board retries restore delivered work and do not duplicate relief',()=>{
 const s=freshBoard(5);s.delivered=2;s.score=200;const retry=freshBoard(5,'normal',boardSnapshot(s));assert.equal(retry.delivered,2);assert.equal(retry.supplies.filter(p=>p.taken).length,2);assert.equal(retry.cargo,0);assert.equal(retry.hp,100);
});
test('practice draws five unique terms with four unique options and one right answer; full review covers fifteen',()=>{
 for(let i=0;i<40;i++){const deck=quizDeck();assert.equal(deck.length,5);assert.equal(new Set(deck.map(q=>q.id)).size,5);for(const q of deck){assert.equal(new Set(q.options.map(o=>o.id)).size,4);assert.equal(q.options.filter(o=>o.id===q.id).length,1);}}
 assert.equal(new Set(quizDeck(15).map(q=>q.id)).size,15);
});
test('all original dialogue has an actual packaged recording; chapter four remains accessible',()=>{
 const voices=new Map(C5_VOICES.map(v=>[v.id,v]));assert.equal(voices.size,84);
 for(const line of scriptLines()){const voice=voices.get(line.id);assert.equal(voice.text,line.text);assert.equal(voice.speaker,line.speaker);const bytes=fs.statSync(new URL(voice.file,import.meta.url)).size;assert.ok(bytes>4000);assert.ok(voice.duration>.5&&voice.duration<15);}
 const old=fs.readFileSync(new URL('chapter4.html',import.meta.url),'utf8');assert.match(old,/action.mjs/);assert.ok(fs.statSync(new URL('c5-cover.png',import.meta.url)).size>100000);
});
