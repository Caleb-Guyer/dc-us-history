import test from 'node:test';
import assert from 'node:assert/strict';
import {createUnion,enact,ready,acceptDraft,beginRatification,ratify} from './union-sim.mjs';
import {createFort,advance,interact,fire,beginBattery,restartCheckpoint,targetBarge,dodge,DEPOT,POSTS,GUN,FLAG,FIRES} from './fort-sim.mjs';
import {createCourier,advanceCourier,steer,leap,dash,DISPATCHES,ROAD_LENGTH} from './courier-sim.mjs';
import {VOICES} from './short-voices.mjs';
import {LINES} from './short-games-data.mjs';
import {existsSync} from 'node:fs';
test('Historical voice lines have packaged stock synthetic performances',()=>{for(const [id,line] of Object.entries(LINES)){assert.equal(VOICES[id].text,line.text);assert.ok(existsSync(new URL(VOICES[id].file,import.meta.url)),id);}});
test('Convention requires both chambers and checks, and a viable coalition before ratification',()=>{
 let s=createUnion();assert.equal(acceptDraft(s),s);
 for(const p of ['house','senate','tax','trade','checks','courts'])s=enact(s,p);
 assert.ok(ready(s));assert.equal(s.turn,6);assert.equal(enact(s,'house'),s);
 s=beginRatification(acceptDraft(s));assert.equal(s.phase,'ratify');s=ratify(s,'papers');assert.equal(ratify(s,'papers'),s);
 s=ratify(ratify(s,'amend'),'conventions');assert.equal(s.phase,'won');
});
test('Eight unbalanced debate rounds fail without changing the historical ratification record',()=>{let s=createUnion();for(let i=0;i<8;i++)s=enact(s,'lobby-large');assert.ok(s.failed);assert.equal(s.phase,'draft');assert.equal(enact(s,'house'),s);assert.equal(s.ratified.length,0);});
test('Up means decreasing screen y, diagonals preserve speed, and movement stays within the fort',()=>{
 const a=createFort(),b=createFort();advance(a,.05,{y:-1});advance(b,.05,{x:1,y:-1});assert.ok(a.player.y<DEPOT.y);assert.equal(a.player.x,DEPOT.x);
 assert.ok(Math.abs(Math.hypot(b.player.x-DEPOT.x,b.player.y-DEPOT.y)-(DEPOT.y-a.player.y))<1e-8);
 for(let i=0;i<300;i++)advance(a,.05,{x:1,y:-1,crouch:true});assert.equal(a.player.x,835);assert.equal(a.player.y,220);
});
test('Actual supply interactions gate nightfall; cannon position, aim and cooldown gate the barge phase',()=>{
 const s=createFort();s.player.x=200;s.player.y=240;assert.equal(interact(s).event,null);
 for(let i=0;i<4;i++){Object.assign(s.player,DEPOT);assert.equal(interact(s).event,'pickup');Object.assign(s.player,POSTS[i]);assert.equal(interact(s).event,'deliver');}
 assert.equal(s.phase,'transition');beginBattery(s);assert.equal(s.phase,'battery');assert.equal(fire(s,targetBarge(s)).event,null);
 Object.assign(s.player,GUN);assert.equal(fire(s,{x:999,y:999}).event,'miss');assert.equal(fire(s,targetBarge(s)).event,null);
 for(let i=0;i<31;i++)advance(s,.05,{crouch:true});assert.equal(fire(s,targetBarge(s)).event,'barge-hit');
 while(s.repelled<4){for(let i=0;i<31;i++)advance(s,.05,{crouch:true});fire(s,targetBarge(s));}
 assert.equal(s.phase,'lastwatch');Object.assign(s.player,{x:495,y:520});for(let i=0;i<481;i++)advance(s,.05,{crouch:true});assert.equal(s.phase,'lastwatch','waiting alone cannot skip the emergency');
 for(const p of FIRES){Object.assign(s.player,p);for(let i=0;i<3;i++)interact(s);}advance(s,.05,{crouch:true});assert.equal(s.phase,'flag');
 assert.equal(interact(s).event,null);Object.assign(s.player,FLAG);for(let i=0;i<5;i++)interact(s);assert.equal(s.phase,'won');assert.ok(s.completed);
});
test('Courier completes a short route through movement and collected arguments; no completion for missing papers',()=>{
 const s=createCourier();for(let i=0;i<1000&&!s.finished;i++){const next=DISPATCHES.find(p=>!s.collected.includes(p.id));if(next&&s.d>next.d-20)steer(s,next.lane-s.lane);if(s.d>95&&s.d<104)leap(s);advanceCourier(s,.05);}
 assert.equal(s.finished,true);assert.equal(s.collected.length,3);assert.ok(s.time<50,'courier route stays under one minute');
 const missing=createCourier();missing.d=ROAD_LENGTH-1;advanceCourier(missing,.05);advanceCourier(missing,.05);assert.equal(missing.finished,false);assert.ok(missing.d<74);assert.equal(missing.health,3);
});
test('Courier jump clears a low crate, wagons need lateral evasion, and dash has a cooldown',()=>{
 const s=createCourier();s.d=27;leap(s);for(let i=0;i<8;i++)advanceCourier(s,.05);assert.equal(s.health,3);
 const wagon=createCourier();wagon.d=119;for(let i=0;i<6;i++)advanceCourier(wagon,.05);assert.equal(wagon.health,2);
 const d=createCourier();dash(d);const cd=d.dashCooldown;dash(d);assert.equal(d.dashCooldown,cd);advanceCourier(d,.05);assert.ok(d.d>.5);
 steer(d,-1);steer(d,-1);assert.equal(d.lane,-1);
});
test('Fort sprint spends and replenishes stamina; dodge moves in the requested direction without allowing a spam loop',()=>{
 const s=createFort(),walk=createFort();advance(s,.05,{x:1,sprint:true});advance(walk,.05,{x:1});assert.ok(s.player.x>walk.player.x);assert.ok(s.stamina<1);
 const x=s.player.x;assert.ok(dodge(s,{x:1,y:0}));assert.equal(dodge(s,{x:1,y:0}),false);advance(s,.05);assert.ok(s.player.x-x>20);assert.ok(s.invulnerable>0);
 for(let i=0;i<50;i++)advance(s,.05,{crouch:true});assert.ok(s.stamina>.7);assert.ok(dodge(s,{x:0,y:-1}));
});
test('Powder emergency requires proximity; a missed shot follows the actual aim rather than the target',()=>{
 const s=createFort();s.phase='lastwatch';assert.equal(interact(s).event,null);Object.assign(s.player,FIRES[0]);for(let i=0;i<25;i++)advance(s,.05,{interact:true,crouch:true});assert.equal(s.fires[0],1);assert.equal(s.fires[1],0);
 s.phase='battery';Object.assign(s.player,GUN);fire(s,{x:999,y:999});assert.deepEqual([s.shot.x,s.shot.y],[999,999]);assert.equal(s.repelled,0);
});
test('Click destinations converge exactly instead of overshooting at low frame rates',()=>{
 const s=createFort({assist:true}),destination={x:240,y:280};for(let i=0;i<100;i++)advance(s,.05,{destination,crouch:true});assert.equal(s.player.x,destination.x);assert.equal(s.player.y,destination.y);
 for(let i=0;i<20;i++)advance(s,.05,{destination,crouch:true});assert.equal(s.player.x,destination.x);assert.equal(s.player.y,destination.y);
 const before=s.player.y;advance(s,.05,{destination,y:1,crouch:true});assert.ok(s.player.y>before,'manual movement takes priority over a click route');
});
test('Cover reduces a burst and assist reduces damage; retries preserve the correct local checkpoint',()=>{
 const a=createFort(),b=createFort({assist:true});for(const s of [a,b])s.shells=[{x:500,y:465,t:.01,max:2,r:60}];
 advance(a,.02,{crouch:true});advance(b,.02);assert.equal(a.player.health,88);assert.equal(b.player.health,89);
 a.delivered=4;a.repelled=2;a.failed=true;const c=restartCheckpoint(a);assert.equal(c.phase,'battery');assert.equal(c.repelled,0);assert.equal(c.player.health,100);
 a.repelled=4;assert.equal(restartCheckpoint(a).phase,'lastwatch');b.failed=true;assert.equal(restartCheckpoint(b).phase,'supply');assert.ok(restartCheckpoint(b).assist);
});
